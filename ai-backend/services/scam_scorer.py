def calculate_trust_score(checks: dict) -> dict:
    weights = {
        "domain_age":          0.15,
        "ssl_certificate":     0.15,
        "url_structure":       0.15,
        "brand_similarity":    0.20,
        "suspicious_keywords": 0.10,
        "reputation":          0.25,
    }
    weighted_score = sum(
        checks[key]["score"] * weight
        for key, weight in weights.items()
        if key in checks
    )
    trust_score = round(100 - weighted_score)  # higher trust = lower risk

    if trust_score >= 75:
        overall_status = "safe"
    elif trust_score >= 45:
        overall_status = "warning"
    else:
        overall_status = "danger"

    return {"trust_score": trust_score, "overall_status": overall_status}