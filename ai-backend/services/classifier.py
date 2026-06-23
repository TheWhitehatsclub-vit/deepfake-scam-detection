def classify_screenshot(text: str):
    text = text.lower()

    if "whatsapp" in text:
        return "WhatsApp"

    elif "gmail" in text or "from:" in text:
        return "Email"

    elif "sms" in text or "otp" in text:
        return "SMS"

    elif "facebook" in text or "instagram" in text or "twitter" in text:
        return "Social Media"

    elif "http" in text or "www" in text:
        return "Website"

    return "Unknown"