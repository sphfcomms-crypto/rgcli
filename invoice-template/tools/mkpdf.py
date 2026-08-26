"""Build the print PDF and the fillable AcroForm PDF (same artwork as the SVG)."""
import os, sys
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import black, white
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

X = lambda u: u * K
Y = lambda u: PH - (u + PAD_Y) * K
S = lambda u: u * K

c = canvas.Canvas(OUT, pagesize=A4)
c.setTitle("Paras Production - Invoice")
c.setAuthor("Paras Production")
c.setSubject("Invoice / bill form")

def line(x0, y0, x1, y1, w):
    c.setLineWidth(S(w)); c.setStrokeColor(black); c.setLineCap(0)
    c.line(X(x0), Y(y0), X(x1), Y(y1))

def draw(s, font, size_u, base_u, *, x=None, cx=None, target=None, cs=0.0):
    """Draw a string; `target` (source units) stretches letter-spacing to that width."""
    size = S(size_u)
    if target is not None:
        cs = (S(target) - pdfmetrics.stringWidth(s, font, size)) / len(s)
    w = pdfmetrics.stringWidth(s, font, size) + cs * (len(s) - 1)
    px = X(x) if x is not None else X(cx) - w / 2.0
    t = c.beginText(px, Y(base_u))
    t.setFont(font, size); t.setFillColor(black); t.setCharSpace(cs); t.textOut(s)
    c.drawText(t)

# ---------------------------------------------------------------- letterhead
for word, x0, tgt in TITLE_WORDS:
    size = S(TITLE_SIZE)
    cs = (S(tgt) - pdfmetrics.stringWidth(word, DISPLAY, size)) / len(word)
    # 1) solid letters, which also become the clipping path
    c.saveState()
    t = c.beginText(X(x0), Y(TITLE_Y)); t.setTextRenderMode(4)      # fill + clip
    t.setFont(DISPLAY, size); t.setFillColor(black); t.setCharSpace(cs); t.textOut(word)
    c.drawText(t)
    # 2) engraved hair-line: an offset white stroke, kept inside the glyphs
    c.setStrokeColor(white); c.setLineWidth(S(2.6))
    t = c.beginText(X(x0 - 2.4), Y(TITLE_Y - 2.4)); t.setTextRenderMode(1)
    t.setFont(DISPLAY, size); t.setCharSpace(cs); t.textOut(word)
    c.drawText(t)
    c.restoreState()

line(RULE_X0, RULE1_Y, RULE_X1, RULE1_Y, 3)
draw("LED & SMD Wall, LED Dance Floor, Follow & Stage Lighting,",
     SANS, TAG_SIZE, TAG_Y[0], cx=CENTER, target=TAG_LEN[0])
draw("Multimedia, Plasma TV & Sound System",
     SANS, TAG_SIZE, TAG_Y[1], cx=CENTER, target=TAG_LEN[1])
line(RULE_X0, RULE2_Y, RULE_X1, RULE2_Y, 3)
for txt, base, tlen in CONTACT:
    draw(txt, SANS, CON_SIZE, base, cx=CENTER, target=tlen)

# ---------------------------------------------------------------- form fields
ALIGN = {}                       # field name -> /Q value, applied after the build
_Q = {"left": 0, "center": 1, "right": 2}

def field(name, tip, x0, x1, base_u, align="left", h=21.0):
    if not FILLABLE:
        return
    ALIGN[name] = _Q[align]
    c.acroForm.textfield(name=name, tooltip=tip,
                         x=X(x0), y=Y(base_u + 5.0), width=X(x1) - X(x0), height=S(h),
                         fontName=BODY, fontSize=S(FILL_SIZE),
                         textColor=black, fillColor=None, borderColor=None,
                         borderWidth=0, forceBorder=False, maxlen=200)

# ---------------------------------------------------------------- meta block
names = ["billed_to", "invoice_no", "address", "invoice_date"]
tips  = ["Customer name", "Invoice number", "Customer address", "Invoice date"]
for (lab, lx, base, rx0, rx1, ry, fx), nm, tip in zip(META, names, tips):
    draw(lab, SANS, META_SIZE, base, x=lx)
    line(rx0, ry, rx1, ry, 2)
    field(nm, tip, fx, rx1 - 3, ry - 4)

# ---------------------------------------------------------------- table
for x in COLS:
    line(x, T_TOP, x, T_BOT, 2.5)
for y in (T_TOP, T_HDR, T_BOT):
    line(COLS[0], y, COLS[-1], y, 2.5)
line(COLS[2], TOTAL_Y, COLS[3], TOTAL_Y, 2.5)      # amount column only

for head, cx, tlen in HEADINGS:
    draw(head, SANS, HDR_SIZE, HDR_BASE, cx=cx, target=tlen)

keys  = ["qty", "desc", "amount"]
align = ["center", "left", "right"]
for i in range(N_ROWS):
    for j, k in enumerate(keys):
        field(f"row{i+1:02d}_{k}", f"Row {i+1} - {k}",
              COLS[j] + 3, COLS[j + 1] - 3, row_base(i), align[j])

draw("TOTAL", SANS, TOTAL_SIZE, TOTAL_BASE, cx=TOTAL_CX, target=TOTAL_LEN)
field("total", "Total amount", COLS[2] + 3, COLS[3] - 6, TOTAL_BASE, "right")

# ---------------------------------------------------------------- signatures
for cap, x0, x1, cx, tlen in SIG:
    line(x0, SIG_Y, x1, SIG_Y, 3)
    draw(cap, SANS, SIG_SIZE, SIG_BASE, cx=cx, target=tlen)

c.showPage()
c.save()

if not FILLABLE:
    print("wrote", OUT)
    raise SystemExit

# reportlab has no per-field alignment; set /Q directly and let the viewer
# regenerate the field appearances.
from pypdf import PdfWriter
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
