from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer
)
from reportlab.lib.styles import (
    getSampleStyleSheet
)


def generate_pdf(report, filepath):
    doc = SimpleDocTemplate(filepath)
    styles = getSampleStyleSheet()

    elements = []

    elements.append(
        Paragraph(
            "TrustShield AI Report",
            styles["Title"]
        )
    )

    elements.append(Spacer(1, 20))

    elements.append(
        Paragraph(
            f"Filename: {report.filename}",
            styles["BodyText"]
        )
    )

    elements.append(
        Paragraph(
            f"Screenshot Type: {report.screenshot_type}",
            styles["BodyText"]
        )
    )

    elements.append(
        Paragraph(
            f"Scam Probability: {report.scam_probability}",
            styles["BodyText"]
        )
    )

    elements.append(
        Paragraph(
            f"Risk Level: {report.risk_level}",
            styles["BodyText"]
        )
    )

    elements.append(
        Paragraph(
            f"Trust Score: {report.trust_score}",
            styles["BodyText"]
        )
    )

    elements.append(
        Paragraph(
            f"Tactics: {', '.join(report.tactics)}",
            styles["BodyText"]
        )
    )

    elements.append(
        Paragraph(
            f"Explanation: {report.explanation}",
            styles["BodyText"]
        )
    )

    elements.append(
        Paragraph(
            f"Recommendations: {', '.join(report.recommendations)}",
            styles["BodyText"]
        )
    )

    doc.build(elements)