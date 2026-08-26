import base64, os, sys
from geom import *

OUT = os.path.join(OUT_DIR, "paras-production-invoice.svg")
embed = "--embed" in sys.argv

def n(v):
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return s if s not in ("", "-0") else "0"

L = []
a = L.append

fontface = ""
if embed:
    b64 = base64.b64encode(open(FONT_PATH,"rb").read()).decode()
    fontface = ("\n    @font-face{font-family:'Playfair Display';font-style:normal;"
                "font-weight:900;src:url(data:font/ttf;base64,%s) format('truetype');}" % b64)

a(f'''<?xml version="1.0" encoding="UTF-8"?>
<!--
  PARAS PRODUCTION - invoice / bill form
  Fully editable vector artwork. Every rule is a <line>, every word is live
  <text>. Page is A4 (210 x 297 mm); the drawing grid is 864 units wide, so
  1 unit = 0.2431 mm.

  Blank spots you type into are empty <text> elements carrying class="fill"
  and ids such as  f-r03-desc  (row 3, description).  Put your text between
  the tags:   <text id="f-r03-desc" ...></text>  ->  <text ...>LED Wall 10x8</text>
-->
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="210mm" height="297mm" viewBox="0 0 {n(W)} {n(H)}"
     role="img" aria-label="Paras Production invoice form">
  <title>Paras Production - Invoice</title>

  <defs>
    <style type="text/css"><![CDATA[{fontface}
      text {{ fill:#000; }}
      .brand   {{ font-family:'Algerian','Engravers MT','Playfair Display','Bodoni MT Black','Liberation Serif',serif;
                 font-weight:900; font-size:{n(TITLE_SIZE)}px; }}
      .sans    {{ font-family:Arial,'Liberation Sans',Helvetica,sans-serif; font-weight:bold; }}
      .tag     {{ font-size:{n(TAG_SIZE)}px; }}
      .contact {{ font-size:{n(CON_SIZE)}px; }}
      .label   {{ font-size:{n(META_SIZE)}px; }}
      .head    {{ font-size:{n(HDR_SIZE)}px; }}
      .spread  {{ letter-spacing:1.8px; }}
      .sig     {{ font-size:{n(SIG_SIZE)}px; }}
      .total   {{ font-size:19px; }}
      /* --- what you fill in --------------------------------------- */
      .fill    {{ font-family:Arial,'Liberation Sans',Helvetica,sans-serif;
                 font-weight:normal; font-size:{n(FILL_SIZE)}px; fill:#111; }}
      .rule, .grid {{ stroke:#000; stroke-linecap:butt; }}
      .rule    {{ stroke-width:2; }}
      .grid    {{ stroke-width:2; }}
      .rule-hd {{ stroke:#000; stroke-width:3; }}
      .rule-sig{{ stroke:#000; stroke-width:2.5; }}
    ]]></style>

    <!-- the engraved hair-line inside the logo letters -->
    <clipPath id="clip-brand">
      <use href="#brand-title" xlink:href="#brand-title"/>
    </clipPath>
  </defs>

  <rect id="page" x="0" y="0" width="{n(W)}" height="{n(H)}" fill="#ffffff"/>

  <g id="artwork" transform="translate(0 {n(PAD_Y)})">''')

# ---------------- letterhead ----------------
a('\n    <g id="letterhead">')
a(f'      <text id="brand-title" class="brand" y="{n(TITLE_Y)}">'
  f'<tspan x="164" textLength="191" lengthAdjust="spacing">PARAS</tspan>'
  f'<tspan x="371" textLength="331" lengthAdjust="spacing">PRODUCTION</tspan></text>')
a('      <!-- decorative inline; delete this group for a plain solid logo -->')
a(f'      <g id="brand-inline" clip-path="url(#clip-brand)" aria-hidden="true">')
a(f'        <use href="#brand-title" xlink:href="#brand-title" fill="none" stroke="#ffffff" '
  f'stroke-width="2.6" transform="translate(-2.4 -2.4)"/>')
a('      </g>')
a(f'      <line id="rule-top" class="rule-hd" x1="{n(RULE_X0)}" y1="{n(RULE1_Y)}" x2="{n(RULE_X1)}" y2="{n(RULE1_Y)}"/>')
a(f'      <text id="services-1" class="sans tag" x="{n(CENTER)}" y="{n(TAG_Y[0])}" text-anchor="middle" '
  f'textLength="{n(TAG_LEN[0])}" lengthAdjust="spacing">LED &amp; SMD Wall, LED Dance Floor, Follow &amp; Stage Lighting,</text>')
a(f'      <text id="services-2" class="sans tag" x="{n(CENTER)}" y="{n(TAG_Y[1])}" text-anchor="middle" '
  f'textLength="{n(TAG_LEN[1])}" lengthAdjust="spacing">Multimedia, Plasma TV &amp; Sound System</text>')
a(f'      <line id="rule-mid" class="rule-hd" x1="{n(RULE_X0)}" y1="{n(RULE2_Y)}" x2="{n(RULE_X1)}" y2="{n(RULE2_Y)}"/>')
a(f'      <text id="phones" class="sans contact" x="{n(CENTER)}" y="{n(CON_Y[0])}" text-anchor="middle" '
  f'textLength="{n(CON_LEN[0])}" lengthAdjust="spacing">Cell: 0333-2197207, 0334-3144631, 0314-2977741</text>')
a(f'      <text id="email" class="sans contact" x="{n(CENTER)}" y="{n(CON_Y[1])}" text-anchor="middle" '
  f'textLength="{n(CON_LEN[1])}" lengthAdjust="spacing">E-mail: danishsiddiqui@hotmail.com</text>')
a('    </g>')

# ---------------- meta fields ----------------
ids = ["billed-to", "invoice-no", "address", "invoice-date"]
a('\n    <g id="meta">')
for (lab, lx, base, rx0, rx1, ry, fx), fid in zip(META, ids):
    a(f'      <text class="sans label" x="{n(lx)}" y="{n(base)}">{lab.replace("&","&amp;")}</text>')
    a(f'      <line class="rule" x1="{n(rx0)}" y1="{n(ry)}" x2="{n(rx1)}" y2="{n(ry)}"/>')
    a(f'      <text class="fill" id="f-{fid}" x="{n(fx)}" y="{n(ry-3)}"></text>')
a('    </g>')

# ---------------- table ----------------
a('\n    <g id="table">')
a('      <g id="table-grid" class="grid" fill="none">')
for x in COLS:
    a(f'        <line x1="{n(x)}" y1="{n(T_TOP)}" x2="{n(x)}" y2="{n(T_BOT)}"/>')
a(f'        <line x1="{n(COLS[0])}" y1="{n(T_TOP)}" x2="{n(COLS[-1])}" y2="{n(T_TOP)}"/>')
a(f'        <line x1="{n(COLS[0])}" y1="{n(T_HDR)}" x2="{n(COLS[-1])}" y2="{n(T_HDR)}"/>')
for i in range(1, N_ROWS + 1):
    y = T_HDR + i * ROW_H
    a(f'        <line x1="{n(COLS[0])}" y1="{n(y)}" x2="{n(COLS[-1])}" y2="{n(y)}"/>')
a('      </g>')

a('      <g id="table-head">')
for j, head in enumerate(HEADINGS):
    cx = (COLS[j] + COLS[j + 1]) / 2.0
    cls = "sans head spread" if head == "DESCRIPTION" else "sans head"
    extra = ' dx="0.9"' if head == "DESCRIPTION" else ''   # offset half a tracking step
    a(f'        <text class="{cls}" x="{n(cx)}" y="{n(HDR_BASE)}" text-anchor="middle"{extra}>{head}</text>')
a('      </g>')

# fillable cells
keys   = ["qty", "date", "desc", "rate", "amount"]
anchor = ["middle", "middle", "start", "end", "end"]
a('      <g id="table-body">')
for i in range(N_ROWS - 1):                       # 15 item rows
    a(f'        <!-- row {i+1} -->')
    for j, k in enumerate(keys):
        if anchor[j] == "middle":
            x = (COLS[j] + COLS[j + 1]) / 2.0
        elif anchor[j] == "start":
            x = COLS[j] + CELL_PAD
        else:
            x = COLS[j + 1] - CELL_PAD
        a(f'        <text class="fill" id="f-r{i+1:02d}-{k}" x="{n(x)}" y="{n(row_base(i))}" '
          f'text-anchor="{anchor[j]}"></text>')
a('      </g>')

# total row
ti = N_ROWS - 1
a('      <g id="table-total">')
a(f'        <text class="sans total" x="{n((COLS[3]+COLS[4])/2)}" y="{n(row_base(ti)-1)}" text-anchor="middle">TOTAL</text>')
a(f'        <text class="fill" id="f-total" x="{n(COLS[5]-CELL_PAD)}" y="{n(row_base(ti))}" text-anchor="end"></text>')
a('      </g>')
a('    </g>')

# ---------------- signatures ----------------
a('\n    <g id="signatures">')
for cap, x0, x1 in SIG:
    a(f'      <line class="rule-sig" x1="{n(x0)}" y1="{n(SIG_Y)}" x2="{n(x1)}" y2="{n(SIG_Y)}"/>')
    a(f'      <text class="sans sig" x="{n((x0+x1)/2)}" y="{n(SIG_BASE)}" text-anchor="middle">{cap}</text>')
a('    </g>')

a('  </g>\n</svg>')

open(OUT, "w").write("\n".join(L) + "\n")
print("wrote", OUT)
