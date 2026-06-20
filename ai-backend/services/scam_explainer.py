import os
from google import genai
from dotenv import load_dotenv
load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_explanation(url: str, checks: dict, trust_score: int, status: str) -> str:
    findings = "\n".join([
        f"- {key.replace('_', ' ').title()}: {checks[key]['details']} (risk score: {checks[key]['score']}/100)"
        for key in checks
    ])
    prompt = f"""You are a cybersecurity assistant. A user submitted this URL for scam analysis: {url}

Analysis results (risk score 0=safe, 100=dangerous):
{findings}

Overall Trust Score: {trust_score}/100 — Status: {status.upper()}

Write a clear, friendly 3-4 sentence explanation for a non-technical user:
1. Whether this site appears safe or dangerous
2. The 1-2 most important reasons why
3. What they should do (proceed with caution / avoid / safe to use)

Do not use bullet points. Write in plain English."""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        return response.text
    except Exception as e:
        # graceful fallback if API fails — page still works
        return f"This website received a trust score of {trust_score}/100 and is classified as {status}. Please review the detailed checks below for more information."