def calculate_trust_score(checks: dict) -> dict:
    if checks.get("reputation", {}).get("status") == "danger":
        return {"trust_score": min(25, 100 - checks["reputation"]["score"]), "overall_status": "danger"}

    weights = {
        "domain_age":          0.12,
        "ssl_certificate":     0.12,
        "url_structure":       0.13,
        "brand_similarity":    0.18,
        "suspicious_keywords": 0.10,
        "reputation":          0.20,
        "content_analysis":    0.15,
    }
    weighted_score = sum(
        checks[key]["score"] * weight
        for key, weight in weights.items()
        if key in checks
    )
    trust_score = round(100 - weighted_score)

    if trust_score >= 75:
        overall_status = "safe"
    elif trust_score >= 45:
        overall_status = "warning"
    else:
        overall_status = "danger"

    return {"trust_score": trust_score, "overall_status": overall_status}