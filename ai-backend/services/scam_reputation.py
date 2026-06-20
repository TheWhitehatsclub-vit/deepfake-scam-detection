import httpx, os, base64
from dotenv import load_dotenv
load_dotenv()

GOOGLE_KEY = os.getenv("GOOGLE_SAFE_BROWSING_KEY")
VT_KEY = os.getenv("VIRUSTOTAL_KEY")

async def check_reputation(url: str) -> dict:
    results = []
    score = 0

    # --- Google Safe Browsing ---
    try:
        async with httpx.AsyncClient(timeout=8) as client:
            resp = await client.post(
                f"https://safebrowsing.googleapis.com/v4/threatMatches:find?key={GOOGLE_KEY}",
                json={
                    "client": {"clientId": "scam-detector", "clientVersion": "1.0"},
                    "threatInfo": {
                        "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                        "platformTypes": ["ANY_PLATFORM"],
                        "threatEntryTypes": ["URL"],
                        "threatEntries": [{"url": url}]
                    }
                }
            )
            data = resp.json()
            if data.get("matches"):
                threat_type = data["matches"][0].get("threatType", "THREAT")
                results.append(f"Google Safe Browsing: flagged as {threat_type}")
                score += 80
            else:
                results.append("Google Safe Browsing: clean")
    except Exception as e:
        results.append(f"Google Safe Browsing: check failed ({str(e)})")

    # --- VirusTotal ---
    try:
        url_id = base64.urlsafe_b64encode(url.encode()).decode().strip("=")
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"https://www.virustotal.com/api/v3/urls/{url_id}",
                headers={"x-apikey": VT_KEY}
            )
            if resp.status_code == 200:
                stats = resp.json()["data"]["attributes"]["last_analysis_stats"]
                malicious = stats.get("malicious", 0)
                suspicious = stats.get("suspicious", 0)
                if malicious > 0:
                    results.append(f"VirusTotal: {malicious} engine(s) flagged as malicious")
                    score += min(malicious * 15, 80)
                elif suspicious > 0:
                    results.append(f"VirusTotal: {suspicious} engine(s) flagged as suspicious")
                    score += min(suspicious * 8, 40)
                else:
                    results.append("VirusTotal: clean")
            else:
                results.append("VirusTotal: URL not yet analyzed")
    except Exception as e:
        results.append(f"VirusTotal: check failed ({str(e)})")

    score = min(score, 100)
    status = "danger" if score >= 60 else ("warning" if score >= 20 else "safe")
    return {"score": score, "status": status, "details": " | ".join(results)}