import httpx
from bs4 import BeautifulSoup
from urllib.parse import urlparse

async def check_content(url: str) -> dict:
    flags = []
    score = 0
    try:
        async with httpx.AsyncClient(timeout=8, follow_redirects=True) as client:
            resp = await client.get(url, headers={"User-Agent": "Mozilla/5.0"})
            soup = BeautifulSoup(resp.text, "html.parser")

        page_domain = urlparse(str(resp.url)).netloc

        # check 1: forms submitting to external domains
        forms = soup.find_all("form")
        for form in forms:
            action = form.get("action", "")
            if action and action.startswith("http"):
                action_domain = urlparse(action).netloc
                if action_domain and action_domain != page_domain:
                    flags.append(f"Form submits to external domain: {action_domain}")
                    score += 50

        # check 2: password field present (informational, not inherently bad)
        password_fields = soup.find_all("input", {"type": "password"})
        has_password_field = len(password_fields) > 0

        # check 3: missing privacy policy / contact links
        page_text = soup.get_text().lower()
        has_privacy = "privacy policy" in page_text or "privacy-policy" in resp.text.lower()
        has_contact = "contact us" in page_text or "contact" in page_text

        if not has_privacy:
            flags.append("No privacy policy found")
            score += 15
        if not has_contact:
            flags.append("No contact information found")
            score += 10

        # check 4: urgency language
        urgency_words = ["limited time", "expires soon", "act now", "hurry", "only few left", "offer ends"]
        found_urgency = [w for w in urgency_words if w in page_text]
        if found_urgency:
            flags.append(f"Urgency language detected: {', '.join(found_urgency)}")
            score += 20

        # extra context if password field exists alongside other red flags
        if has_password_field and score > 0:
            flags.append("Login/password field present alongside other red flags")
            score += 15

        score = min(score, 100)
        status = "danger" if score >= 50 else ("warning" if score >= 20 else "safe")
        details = " | ".join(flags) if flags else "No significant content red flags detected."
        return {"score": score, "status": status, "details": details, "flags": flags}

    except Exception as e:
        return {"score": 30, "status": "warning", "details": f"Content analysis failed or page unreachable: {str(e)}", "flags": []}