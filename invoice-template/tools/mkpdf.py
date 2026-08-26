"""Build the print PDF and the fillable AcroForm PDF (same artwork as the SVG)."""
import os, sys
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import black, white, Color
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from geom import *

PW, PH = A4                                   # 595.2756 x 841.8898 pt
K = PT_PER_U
FILLABLE = "--fillable" in sys.argv
OUT = os.path.join(OUT_DIR, "paras-production-invoice-fillable.pdf"
                        if FILLABLE else "paras-production-invoice.pdf")

pdfmetrics.registerFont(TTFont("PlayfairBlack", FONT_PATH))
DISPLAY, SANS, BODY = "PlayfairBlack", "Helvetica-Bold", "Helvetica"

X  = lambda u: u * K
Y  = lambda u: PH - (u + PAD_Y) * K
S  = lambda u: u * K

c = canvas.Canvas(OUT, pagesize=A4)
c.setTitle("Paras Production - Invoice")
c.setAuthor("Paras Production")
c.setSubject("Invoice / bill form")

def line(x0, y0, x1, y1, w):
    c.setLineWidth(S(w)); c.setStrokeColor(black); c.setLineCap(0)
    c.line(X(x0), Y(y0), X(x1), Y(y1))

def tracked_width(s, font, size, cs):
    return pdfmetrics.stringWidth(s, font, size) + cs * len(s)

def draw(s, font, size_u, base_u, *, x=None, cx=None, target=None, cs=0.0):
    """Draw a string; `target` (source units) stretches letter-spacing to that width."""
    size = S(size_u)
    if target is not None:
        nat = pdfmetrics.stringWidth(s, font, size)
        cs = (S(target) - nat) / len(s)
    w = tracked_width(s, font, size, cs) - cs          # ignore trailing spacing
    px = X(x) if x is not None else X(cx) - w / 2.0
    t = c.beginText(px, Y(base_u))
    t.setFont(font, size); t.setFillColor(black); t.setCharSpace(cs); t.textOut(s)
    c.drawText(t)

# ---------------------------------------------------------------- letterhead
def title():
    for word, x0, tgt in (("PARAS", 164.0, 191.0), ("PRODUCTION", 371.0, 331.0)):
        size = S(TITLE_SIZE)
        cs = (S(tgt) - pdfmetrics.stringWidth(word, DISPLAY, size)) / len(word)
        # 1) solid letters, which also become the clipping path
        c.saveState()
        t = c.beginText(X(x0), Y(TITLE_Y)); t.setTextRenderMode(4)   # fill + clip
        t.setFont(DISPLAY, size); t.setFillColor(black); t.setCharSpace(cs); t.textOut(word)
        c.drawText(t)
        # 2) engraved hair-line: an offset white stroke, kept inside the glyphs
        c.setStrokeColor(white); c.setLineWidth(S(2.6))
        t = c.beginText(X(x0 - 2.4), Y(TITLE_Y - 2.4)); t.setTextRenderMode(1)
        t.setFont(DISPLAY, size); t.setCharSpace(cs); t.textOut(word)
        c.drawText(t)
        c.restoreState()

title()
line(RULE_X0, RULE1_Y, RULE_X1, RULE1_Y, 3)
draw("LED & SMD Wall, LED Dance Floor, Follow & Stage Lighting,",
     SANS, TAG_SIZE, TAG_Y[0], cx=CENTER, target=TAG_LEN[0])
draw("Multimedia, Plasma TV & Sound System",
     SANS, TAG_SIZE, TAG_Y[1], cx=CENTER, target=TAG_LEN[1])
line(RULE_X0, RULE2_Y, RULE_X1, RULE2_Y, 3)
draw("Cell: 0333-2197207, 0334-3144631, 0314-2977741",
     SANS, CON_SIZE, CON_Y[0], cx=CENTER, target=CON_LEN[0])
draw("E-mail: danishsiddiqui@hotmail.com",
     SANS, CON_SIZE, CON_Y[1], cx=CENTER, target=CON_LEN[1])

# ---------------------------------------------------------------- form fields
form = c.acroForm
FIELD_FONT_SIZE = S(FILL_SIZE)

ALIGN = {}                       # field name -> /Q value, applied after the build
_Q = {"left": 0, "center": 1, "right": 2}

def field(name, tip, x0, x1, base_u, align="left", h=21.0):
    if not FILLABLE:
        return
    ALIGN[name] = _Q[align]
    form.textfield(name=name, tooltip=tip,
                   x=X(x0), y=Y(base_u + 5.0), width=X(x1) - X(x0), height=S(h),
                   fontName=BODY, fontSize=FIELD_FONT_SIZE,
                   textColor=black, fillColor=None, borderColor=None,
                   borderWidth=0, forceBorder=False, maxlen=200)

# ---------------------------------------------------------------- meta block
names = ["billed_to", "invoice_no", "address", "invoice_date"]
tips  = ["Customer name", "Invoice number", "Customer address", "Invoice date"]
for (lab, lx, base, rx0, rx1, ry, fx), nm, tip in zip(META, names, tips):
    draw(lab, SANS, META_SIZE, base, x=lx)
    line(rx0, ry, rx1, ry, 2)
    field(nm, tip, fx, rx1 - 3, ry - 3)

# ---------------------------------------------------------------- table
for x in COLS:
    line(x, T_TOP, x, T_BOT, 2)
line(COLS[0], T_TOP, COLS[-1], T_TOP, 2)
line(COLS[0], T_HDR, COLS[-1], T_HDR, 2)
for i in range(1, N_ROWS + 1):
    y = T_HDR + i * ROW_H
    line(COLS[0], y, COLS[-1], y, 2)

for j, head in enumerate(HEADINGS):
    cx = (COLS[j] + COLS[j + 1]) / 2.0
    if head == "DESCRIPTION":
        draw(head, SANS, HDR_SIZE, HDR_BASE, cx=cx, cs=S(1.8))
    else:
        draw(head, SANS, HDR_SIZE, HDR_BASE, cx=cx)

keys  = ["qty", "date", "desc", "rate", "amount"]
align = ["center", "center", "left", "right", "right"]
for i in range(N_ROWS - 1):
    for j, k in enumerate(keys):
        field(f"row{i+1:02d}_{k}", f"Row {i+1} - {k}",
              COLS[j] + 3, COLS[j + 1] - 3, row_base(i), align[j])

ti = N_ROWS - 1
draw("TOTAL", SANS, 19.0, row_base(ti) - 1, cx=(COLS[3] + COLS[4]) / 2.0)
field("total", "Total amount", COLS[4] + 3, COLS[5] - 3, row_base(ti), "right")

# ---------------------------------------------------------------- signatures
for cap, x0, x1 in SIG:
    line(x0, SIG_Y, x1, SIG_Y, 2.5)
    draw(cap, SANS, SIG_SIZE, SIG_BASE, cx=(x0 + x1) / 2.0)

c.showPage()
c.save()

# reportlab has no per-field alignment; set /Q directly and let the viewer
# regenerate the field appearances.
if not FILLABLE:
    print("wrote", OUT)
    raise SystemExit

from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, NumberObject, BooleanObject

w = PdfWriter(clone_from=OUT)
acro = w._root_object["/AcroForm"]
acro[NameObject("/NeedAppearances")] = BooleanObject(True)
for ref in acro["/Fields"]:
    f = ref.get_object()
    q = ALIGN.get(str(f.get("/T")))
    if q:
        f[NameObject("/Q")] = NumberObject(q)
with open(OUT, "wb") as fh:
    w.write(fh)
print("wrote", OUT)
