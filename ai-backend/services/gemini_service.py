def generate_explanation(
    text,
    analysis
):
    tactics = analysis.get(
        "tactics",
        []
    )

    if not tactics:
        return (
            "No significant scam indicators "
            "were detected."
        )

    return (
        "The screenshot contains possible "
        f"scam tactics: {', '.join(tactics)}. "
        "Avoid clicking suspicious links "
        "and verify information through "
        "official sources."
    )