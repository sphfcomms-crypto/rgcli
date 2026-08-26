# Paras Production — invoice / bill form

A vector rebuild of the printed Paras Production invoice pad. Same layout,
same proportions, but every rule is a real line and every word is real text,
so it can be edited, re-branded and re-printed without loss of quality.

![preview](preview.png)

## Files

| File | What it is |
| --- | --- |
| `paras-production-invoice.svg` | The editable master. Live text, named ids, self-contained (the display font is embedded). |
| `paras-production-invoice.pdf` | Flat print version, A4, fully vector with embedded fonts. |
| `paras-production-invoice-fillable.pdf` | Same page plus 80 AcroForm fields you can type into in Acrobat / Preview / any PDF reader, then print or e-mail. |
| `fonts/` | The display face used for the logotype, with its licence. |
| `tools/` | The scripts that generate all three files. |

Page size is A4 (210 × 297 mm). The drawing grid is 864 units wide, so one
unit is 0.2431 mm.

## Editing the SVG

Open it in Illustrator, Inkscape, Affinity, Figma or any text editor.
The blanks you fill in are empty `<text>` elements with `class="fill"` and
predictable ids — type between the tags:

```xml
<text class="fill" id="f-r03-desc" x="222" y="397.69" text-anchor="start"></text>
<text class="fill" id="f-r03-desc" x="222" y="397.69" text-anchor="start">LED Dance Floor 16 x 16</text>
```

| Id | Field |
| --- | --- |
| `f-billed-to`, `f-address` | customer name and address |
| `f-invoice-no`, `f-invoice-date` | invoice number and date |
| `f-rNN-qty` \| `-date` \| `-desc` \| `-rate` \| `-amount` | row `NN`, `01`–`15` |
| `f-total` | total amount |

Other useful handles: `#letterhead`, `#brand-title`, `#services-1/2`,
`#phones`, `#email`, `#table-grid`, `#table-head`, `#signatures`.

## Notes on fidelity

* **The logotype.** The original is set in a decorative engraved face
  (Algerian-family). `font-family` asks for `Algerian` and `Engravers MT`
  first, so a machine that has the real font will use it; everything else
  falls back to Playfair Display Black, which is embedded in the SVG and in
  both PDFs. The engraved hair-line inside the letters is drawn by clipping a
  white offset stroke to the glyphs — delete the `#brand-inline` group for a
  plain solid logo. The two words carry a `textLength` so they keep the
  original's width; remove that attribute if you rename the business.
* **Row heights** were averaged to an exact 43.09 units. The scan drifts
  between 42 and 45.5 units per row; the even grid is within ~2 units of the
  original everywhere and prints cleanly.
* **`AMOUNT`** is centred in its column. In the scan it sits about 12 units
  left of centre, which looks like drift in the original artwork rather than
  intent.
* Body text is Arial/Helvetica Bold, matching the original.

## Rebuilding

```sh
pip install reportlab pypdf
cd tools
python3 mksvg.py --embed     # -> ../paras-production-invoice.svg
python3 mkpdf.py             # -> ../paras-production-invoice.pdf
python3 mkpdf.py --fillable  # -> ../paras-production-invoice-fillable.pdf
```

`tools/geom.py` holds every coordinate in one place, so moving a column or
changing the row count only takes an edit there followed by a rebuild.

Playfair Display is licensed under the SIL Open Font License 1.1 —
see `fonts/OFL.txt`.
