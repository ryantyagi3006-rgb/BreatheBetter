#!/usr/bin/env python3
"""
Generate the two BreatheBetter PDF documents:
  1. Safe-Use-BreatheBetter.pdf  — Ethics charter (3 sections)
  2. BreatheBetter-Policies.pdf   — Legal / policy pack (6 policies)

Output goes to frontend/public/ so Vite serves them at /<name>.pdf
Run:  python3 scripts/generate_pdfs.py
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, mm
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER, TA_LEFT
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle,
    PageBreak, HRFlowable, ListFlowable, ListItem, KeepTogether
)

# ── Brand palette ────────────────────────────────────────────
NAVY   = HexColor("#042C53")
BLUE   = HexColor("#185FA5")
LIGHT  = HexColor("#B5D4F4")
GREY   = HexColor("#5A6B7B")
INK    = HexColor("#1A2733")

HERE       = os.path.dirname(os.path.abspath(__file__))
ROOT       = os.path.dirname(HERE)
PUBLIC     = os.path.join(ROOT, "frontend", "public")
LOGO_DPS   = os.path.join(PUBLIC, "1.png")
EFFECTIVE  = "18 June 2026"

os.makedirs(PUBLIC, exist_ok=True)

# ── Styles ───────────────────────────────────────────────────
ss = getSampleStyleSheet()
styles = {
    "wordmark": ParagraphStyle("wordmark", parent=ss["Title"], fontName="Helvetica-Bold",
                               fontSize=26, textColor=NAVY, spaceAfter=2, leading=28),
    "tagline":  ParagraphStyle("tagline", parent=ss["Normal"], fontName="Helvetica-Oblique",
                               fontSize=10, textColor=BLUE, spaceAfter=2),
    "doctitle": ParagraphStyle("doctitle", parent=ss["Title"], fontName="Helvetica-Bold",
                               fontSize=20, textColor=NAVY, spaceBefore=10, spaceAfter=4, leading=24),
    "meta":     ParagraphStyle("meta", parent=ss["Normal"], fontSize=9, textColor=GREY, spaceAfter=2),
    "intro":    ParagraphStyle("intro", parent=ss["Normal"], fontSize=10.5, textColor=INK,
                               leading=16, alignment=TA_JUSTIFY, spaceAfter=6),
    "h1":       ParagraphStyle("h1", parent=ss["Heading1"], fontName="Helvetica-Bold",
                               fontSize=15, textColor=NAVY, spaceBefore=16, spaceAfter=4, leading=18),
    "h2":       ParagraphStyle("h2", parent=ss["Heading2"], fontName="Helvetica-Bold",
                               fontSize=11.5, textColor=BLUE, spaceBefore=9, spaceAfter=2, leading=14),
    "body":     ParagraphStyle("body", parent=ss["Normal"], fontSize=10.5, textColor=INK,
                               leading=15.5, alignment=TA_JUSTIFY, spaceAfter=6),
    "bullet":   ParagraphStyle("bullet", parent=ss["Normal"], fontSize=10.5, textColor=INK,
                               leading=15, alignment=TA_LEFT),
    "kicker":   ParagraphStyle("kicker", parent=ss["Normal"], fontName="Helvetica-Bold",
                               fontSize=8.5, textColor=BLUE, spaceAfter=2),
}

def scaled_image(path, target_h):
    """Return an Image flowable scaled to target height (points), preserving aspect."""
    from reportlab.lib.utils import ImageReader
    iw, ih = ImageReader(path).getSize()
    ratio = iw / float(ih)
    return Image(path, width=target_h * ratio, height=target_h)

def header_block(doc_title, subtitle):
    """Cover header: logos row, wordmark, document title, meta."""
    flow = []
    # DPS International logo
    try:
        flow.append(scaled_image(LOGO_DPS, 34))
        flow.append(Spacer(1, 12))
    except Exception as e:
        print("logo embed skipped:", e)
    flow.append(Paragraph("BreatheBetter", styles["wordmark"]))
    flow.append(Paragraph("Spira. Scio. Vive. &nbsp;—&nbsp; Breathe. Know. Live.", styles["tagline"]))
    flow.append(Spacer(1, 6))
    flow.append(HRFlowable(width="100%", thickness=2, color=LIGHT, spaceAfter=10))
    flow.append(Paragraph(doc_title, styles["doctitle"]))
    flow.append(Paragraph(subtitle, styles["meta"]))
    flow.append(Paragraph(f"Effective date: {EFFECTIVE} &nbsp;·&nbsp; DPS International", styles["meta"]))
    flow.append(Paragraph("Prepared by Ryan Tyagi — MYP Personal Project", styles["meta"]))
    flow.append(Spacer(1, 8))
    flow.append(HRFlowable(width="100%", thickness=0.6, color=GREY, spaceAfter=14))
    return flow

def section(number, title, blocks):
    """A numbered top-level section. `blocks` is a list of ('h2'|'p'|'ul', content)."""
    flow = [Paragraph(f"{number}.&nbsp;&nbsp;{title}", styles["h1"]),
            HRFlowable(width="40%", thickness=2, color=BLUE, spaceAfter=8, hAlign="LEFT")]
    for kind, content in blocks:
        if kind == "h2":
            flow.append(Paragraph(content, styles["h2"]))
        elif kind == "p":
            flow.append(Paragraph(content, styles["body"]))
        elif kind == "ul":
            items = [ListItem(Paragraph(x, styles["bullet"]), leftIndent=10, value="•") for x in content]
            flow.append(ListFlowable(items, bulletType="bullet", start="•",
                                     leftIndent=12, spaceAfter=6, bulletColor=BLUE))
    return flow

# ── Page furniture (footer + side rule on every page) ────────
def on_page(canvas, doc):
    canvas.saveState()
    w, h = A4
    # Left accent rule
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, 6, h, fill=1, stroke=0)
    # Footer
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(GREY)
    canvas.drawString(20*mm, 12*mm,
        "This is not medical advice. For awareness and educational purposes only.")
    canvas.drawRightString(w - 18*mm, 12*mm, f"Page {doc.page}")
    canvas.setFont("Helvetica-Oblique", 7.5)
    canvas.setFillColor(BLUE)
    canvas.drawString(20*mm, 8*mm, "Spira. Scio. Vive. — BreatheBetter by Ryan Tyagi")
    canvas.restoreState()

def build(filename, title, subtitle, sections, preamble=None):
    path = os.path.join(PUBLIC, filename)
    doc = SimpleDocTemplate(path, pagesize=A4,
                            leftMargin=20*mm, rightMargin=18*mm,
                            topMargin=16*mm, bottomMargin=20*mm,
                            title=title, author="Ryan Tyagi — BreatheBetter")
    story = header_block(title, subtitle)
    if preamble:
        story.append(Paragraph(preamble, styles["intro"]))
        story.append(Spacer(1, 4))
    for i, (t, blocks) in enumerate(sections, start=1):
        story += section(i, t, blocks)
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print("wrote", path)


# ════════════════════════════════════════════════════════════
#  DOCUMENT 1 — SAFE USE (ETHICS CHARTER)
# ════════════════════════════════════════════════════════════
safe_use_sections = [
    ("Ethical Use of Artificial Intelligence in Modern Day Systems", [
        ("p", "Artificial intelligence and algorithmic decision-making increasingly sit between people and "
              "their health information. BreatheBetter converts ultrasonic sensor readings into FEV1, FVC and "
              "FEV1/FVC values using a transparent, fixed formula — not a black-box model — yet it is built in "
              "the spirit of the ethical principles that should govern any modern automated system that touches "
              "human wellbeing."),
        ("h2", "Transparency and explainability"),
        ("p", "Every value the platform reports can be traced back to a measured quantity: the height water rises "
              "in the tube, the time it takes, and a clearly documented conversion. Users are never asked to trust "
              "a number they cannot understand. Any system that influences health decisions should be able to "
              "explain, in plain language, how it reached its conclusion."),
        ("h2", "Human oversight, not human replacement"),
        ("p", "Automated tools should augment human judgement, never replace it. BreatheBetter is explicitly an "
              "awareness instrument: it flags patterns worth discussing with a qualified medical professional, and "
              "it actively directs users toward expert care rather than substituting for it."),
        ("h2", "Fairness, accountability and data minimisation"),
        ("ul", [
            "<b>Fairness:</b> a tool must work reasonably for the full range of people who use it, and must not "
            "encode bias that disadvantages any group.",
            "<b>Accountability:</b> there is a named, responsible author behind this system who can be held to "
            "account for how it behaves.",
            "<b>Data minimisation:</b> the system collects only what it needs to function — a breathing "
            "measurement and the account it belongs to — and nothing more.",
            "<b>Safety by design:</b> conservative defaults, honest uncertainty, and clear disclaimers are built "
            "in rather than bolted on.",
        ]),
        ("p", "These commitments reflect widely recognised frameworks for trustworthy AI, including the principles "
              "of transparency, human agency, technical robustness, privacy, fairness and accountability."),
    ]),
    ("Autonomy of Body and Choice", [
        ("p", "Bodily autonomy is the principle that every person has the right to make informed, voluntary "
              "decisions about their own body and health, free from coercion. BreatheBetter is designed so that "
              "the user — and only the user — is in control."),
        ("h2", "Voluntary participation"),
        ("p", "No test is ever taken automatically or without the user's deliberate action. A measurement happens "
              "only when the user chooses to breathe into the device and start a test. Participation is always "
              "optional and can stop at any moment."),
        ("h2", "Informed consent"),
        ("p", "Before storing any health measurement, the platform makes clear what is being measured, why, where "
              "it is stored, and how it can be removed. Consent is meaningful only when it is informed, specific "
              "and freely given."),
        ("h2", "Ownership and the right to withdraw"),
        ("ul", [
            "The results belong to the user, not to the platform.",
            "Users may view their full history at any time and export it.",
            "Users may withdraw by deleting results or closing their account, after which their stored "
            "measurements are removed.",
            "Choosing not to test, or not to act on a result, is always a legitimate and respected choice.",
        ]),
        ("p", "Respecting autonomy also means resisting pressure. BreatheBetter never shames, never nags, and "
              "never uses alarming language to push a person toward a decision. It presents information calmly and "
              "leaves the choice of what to do with that information entirely to the individual."),
    ]),
    ("Health Rights of the Human", [
        ("p", "The right to health is recognised internationally — including in the Universal Declaration of Human "
              "Rights and the work of the World Health Organization — as a fundamental right of every human being. "
              "BreatheBetter is a small, student-built contribution toward that principle, aligned with the United "
              "Nations Sustainable Development Goals."),
        ("h2", "The right to health information"),
        ("p", "People have a right to understandable information about their own bodies. By making a basic measure "
              "of lung function visible and easy to interpret, BreatheBetter supports early awareness — a first "
              "step that can prompt someone to seek timely professional care (SDG 3: Good Health and Well-being)."),
        ("h2", "The right to privacy of health data"),
        ("p", "Health information is among the most sensitive data a person has. It must be protected, never sold, "
              "and never shared without explicit permission. The platform's privacy and consent practices are set "
              "out in the accompanying Policies document."),
        ("h2", "The right to equitable access"),
        ("p", "Health technology too often reaches only those who can already afford care. Built from low-cost, "
              "open hardware, BreatheBetter is designed to put a basic awareness tool within reach of students who "
              "might otherwise have none (SDG 4: Quality Education; SDG 10: Reduced Inequalities)."),
        ("h2", "The right to non-discrimination and dignity"),
        ("p", "Every user is treated with equal respect regardless of their result. A measurement is never a "
              "judgement of a person's worth, and the platform is designed to inform and reassure rather than to "
              "label or exclude."),
    ]),
]

# ════════════════════════════════════════════════════════════
#  DOCUMENT 2 — POLICIES
# ════════════════════════════════════════════════════════════
policies_sections = [
    ("Privacy Policy", [
        ("p", "This Privacy Policy explains what information BreatheBetter collects, why, and how it is handled. "
              "BreatheBetter is a student awareness project and is not a commercial medical service."),
        ("h2", "Information we collect"),
        ("ul", [
            "<b>Account information:</b> the email address you use to sign in.",
            "<b>Measurement data:</b> your FEV1, FVC and FEV1/FVC results, the raw timestamped sensor readings "
            "from each test, the calibration factor, and the time of each test.",
            "<b>Local preferences:</b> theme (light/dark), language and calibration settings stored in your "
            "browser.",
        ]),
        ("h2", "How we use it"),
        ("p", "Your data is used only to display your results, build your personal history and flow-volume curves, "
              "and let you track changes over time. We do not sell your data, show advertising, or share your "
              "information with third parties for marketing."),
        ("h2", "Storage and security"),
        ("p", "Account and measurement data are stored in a secured cloud database protected by access rules so "
              "that each user can read and write only their own records. Sign-in is handled by an established "
              "authentication provider; we never see or store your raw password."),
        ("h2", "Your rights"),
        ("ul", [
            "Access and export your complete result history at any time.",
            "Delete individual results or request removal of your data.",
            "Withdraw consent by discontinuing use and deleting your records.",
        ]),
        ("h2", "Children and students"),
        ("p", "This project is operated in a school context. Students should use it with the awareness of a "
              "parent, guardian or teacher where required by their school."),
    ]),
    ("Terms of Service", [
        ("p", "By creating an account or using BreatheBetter, you agree to these Terms. If you do not agree, "
              "please do not use the platform."),
        ("h2", "Purpose and eligibility"),
        ("p", "BreatheBetter is provided for educational and awareness purposes only. It is intended for use by "
              "students and individuals in a supervised, non-clinical setting."),
        ("h2", "Acceptable use"),
        ("ul", [
            "Use the platform honestly and only for its intended awareness purpose.",
            "Do not attempt to misuse, attack, reverse-engineer for harm, or disrupt the service.",
            "Do not rely on the platform for diagnosis, treatment, or emergency decisions.",
        ]),
        ("h2", "No warranty"),
        ("p", "The platform is provided \"as is\", without warranty of any kind. Measurements are approximate and "
              "depend on hardware, calibration and technique. Accuracy is not guaranteed."),
        ("h2", "Limitation of liability"),
        ("p", "To the maximum extent permitted by law, the author is not liable for any decision made, or harm "
              "arising, from use of or reliance on the platform. Always consult a qualified professional for "
              "medical concerns."),
        ("h2", "Changes"),
        ("p", "These Terms may be updated as the project evolves. Continued use after changes constitutes "
              "acceptance of the revised Terms."),
    ]),
    ("Medical Disclaimer", [
        ("p", "<b>BreatheBetter is not a medical device and does not provide medical advice, diagnosis or "
              "treatment.</b> It is an educational awareness tool only."),
        ("ul", [
            "Results are estimates produced by low-cost hardware and may differ significantly from clinical "
            "spirometry performed by a healthcare professional.",
            "A \"Normal\" result does not rule out illness; a \"Low\" or \"Borderline\" result does not confirm any "
            "condition.",
            "Never start, stop or change any treatment based on a BreatheBetter result.",
            "Always seek the advice of a physician or qualified health provider with any questions about a medical "
            "condition.",
        ]),
        ("p", "Reliance on any information provided by BreatheBetter is solely at your own risk."),
    ]),
    ("Cookie Policy", [
        ("p", "BreatheBetter does not use advertising or third-party tracking cookies."),
        ("h2", "What we store on your device"),
        ("ul", [
            "<b>Essential local storage:</b> your sign-in session, selected theme, chosen language and calibration "
            "factor are saved in your browser's local storage so the app remembers your preferences.",
            "<b>No tracking:</b> we do not profile you, follow you across other sites, or share browsing data.",
        ]),
        ("h2", "Managing local data"),
        ("p", "You can clear this information at any time by signing out or clearing your browser's site data. "
              "Doing so will reset your preferences but will not delete results already saved to your account."),
    ]),
    ("Health Data Consent Notice", [
        ("p", "Breathing measurements are health-related information and are treated with particular care. By "
              "running a test and saving the result, you provide explicit, informed consent to the following."),
        ("ul", [
            "You consent to the collection of your breathing measurements (FEV1, FVC, ratio and raw readings) and "
            "their storage in your personal account.",
            "You understand the data is used only to show your own results and history.",
            "You understand participation is voluntary and you may withdraw at any time by deleting your data.",
            "You understand this data is collected for awareness, not for clinical diagnosis.",
        ]),
        ("p", "Consent is specific to this purpose. We will seek fresh consent before using your health data for "
              "any new or different purpose."),
    ]),
    ("Emergency Notice", [
        ("p", "<b>BreatheBetter must never be used in a medical emergency.</b> It is not monitored, is not a "
              "diagnostic device, and cannot summon help."),
        ("h2", "If you are experiencing a medical emergency"),
        ("p", "If you or someone near you has severe difficulty breathing, chest pain, bluish lips or face, "
              "confusion, fainting, or any other sign of a serious medical emergency, stop using this app and "
              "contact emergency services immediately."),
        ("ul", [
            "<b>India — all emergencies:</b> 112",
            "<b>India — ambulance:</b> 102 or 108",
            "<b>Your local emergency number</b> if you are outside India.",
            "Contact a doctor, hospital, or a trusted adult without delay.",
        ]),
        ("p", "Do not wait for or rely on any reading from this platform before seeking help in an emergency."),
    ]),
]

if __name__ == "__main__":
    build("Safe-Use-BreatheBetter.pdf",
          "Safe & Ethical Use Charter",
          "Responsible, rights-respecting use of the BreatheBetter platform",
          safe_use_sections,
          preamble="This charter sets out the ethical commitments behind BreatheBetter across three areas: "
                   "the responsible use of automated systems, respect for personal autonomy, and the health "
                   "rights of every individual. It accompanies, and should be read alongside, the BreatheBetter "
                   "Policies document.")
    build("BreatheBetter-Policies.pdf",
          "Platform Policies",
          "Privacy, terms, disclaimers and consent for the BreatheBetter platform",
          policies_sections,
          preamble="The following policies govern your use of BreatheBetter. They are written in plain language "
                   "for a student awareness project and do not constitute legal or medical advice.")
    print("Done.")
