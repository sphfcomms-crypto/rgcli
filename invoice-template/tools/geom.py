# Shared geometry for the Paras Production invoice form (approved 3-column layout).
# Units: "source units" == pixels of the original 864 x 1152 scan.
# The A4 page is 864 x 1221.89 source units; artwork is offset by PAD_Y.
import os

HERE      = os.path.dirname(os.path.abspath(__file__))
OUT_DIR   = os.path.dirname(HERE)
FONT_PATH = os.path.join(OUT_DIR, "fonts", "PlayfairDisplay-Black.ttf")

W          = 864.0                 # page width in source units  (== 210 mm)
H          = 864.0 * 297.0 / 210.0 # page height                 (== 297 mm)
PAD_Y      = (H - 1152.0) / 2.0    # centre the original 1152-tall artwork
MM_PER_U   = 210.0 / 864.0
PT_PER_U   = 595.2756 / 864.0

# --- letterhead ---------------------------------------------------------
CENTER      = 434.0
TITLE_Y     = 64.5
TITLE_SIZE  = 54.5
TITLE_WORDS = [("PARAS", 163.0, 192.0), ("PRODUCTION", 372.0, 332.0)]
RULE_X0, RULE_X1 = 163.0, 702.0
RULE1_Y, RULE2_Y = 69.0, 119.5
TAG_Y       = (90.5, 114.0)
TAG_SIZE    = 19.5
TAG_LEN     = (524.0, 350.0)
CONTACT     = [                    # text, baseline, target width
    ("Cell: 0333-2197207, 0334-3144631, 0314-2977741", 140.5, 387.0),
    ("E-mail: danishsiddiqui@hotmail.com",             160.0, 298.0),
    ("NTN No. 7809586-7",                              182.5, 156.0),
]
CON_SIZE    = 18.0

# --- meta fields --------------------------------------------------------
META = [
    # label, label_x, baseline, rule_x0, rule_x1, rule_y, field_x
    ("Ms./M/s.",  54.5, 215.5, 128.0, 624.0, 216.5, 136.0),
    ("Invoice #",634.0, 215.5, 708.0, 816.0, 216.5, 716.0),
    ("Address",   54.5, 253.5, 128.0, 623.0, 254.5, 136.0),
    ("Inv. Date",634.0, 253.5, 705.0, 816.0, 254.5, 713.0),
]
META_SIZE = 18.5

# --- table --------------------------------------------------------------
# Three columns and an open description box: the printed form has no row
# rules, so the item rows below are an invisible grid the fields snap to.
COLS      = [53.0, 128.5, 606.5, 817.0]
T_TOP     = 280.5
T_HDR     = 323.5
T_BOT     = 1037.5
TOTAL_Y   = 992.5                  # divider above TOTAL, amount column only
HDR_BASE  = 309.5
HDR_SIZE  = 19.0
# heading, centre, target width - centres are the scan's own, which are not
# always the exact column centre
HEADINGS  = [("QTY.", 89.5, 39.0), ("DESCRIPTION", 377.0, 146.0), ("AMOUNT", 712.5, 81.0)]
N_ROWS    = 15
ROW_H     = (TOTAL_Y - T_HDR) / N_ROWS
CELL_PAD  = 10.0
FILL_SIZE = 17.0
TOTAL_BASE = 1022.0
TOTAL_SIZE = 20.0
TOTAL_CX   = 708.5
TOTAL_LEN  = 61.0

def row_top(i):  return T_HDR + i * ROW_H       # i = 0..N_ROWS-1
def row_base(i): return row_top(i) + 29.0

# --- signatures ---------------------------------------------------------
SIG = [                            # caption, rule x0, rule x1, centre, target width
    ("Receiver's Signature",  48.0, 284.0, 164.0, 174.0),
    ("Authorised Signature", 589.0, 819.0, 705.5, 177.0),
]
SIG_Y    = 1083.0
SIG_BASE = 1106.0
SIG_SIZE = 19.5
