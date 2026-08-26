# Shared geometry for the Paras Production invoice form.
import os

HERE      = os.path.dirname(os.path.abspath(__file__))
OUT_DIR   = os.path.dirname(HERE)
FONT_PATH = os.path.join(OUT_DIR, "fonts", "PlayfairDisplay-Black.ttf")

# Units: "source units" == pixels of the original 864 x 1152 scan.
# The A4 page is 864 x 1221.89 source units; artwork is offset by PAD_Y.

W          = 864.0                 # page width in source units  (== 210 mm)
H          = 864.0 * 297.0 / 210.0 # page height                 (== 297 mm) = 1221.8857
PAD_Y      = (H - 1152.0) / 2.0    # centre the original 1152-tall artwork
MM_PER_U   = 210.0 / 864.0
PT_PER_U   = 595.2756 / 864.0

# --- letterhead ---------------------------------------------------------
CENTER      = 433.0
TITLE_Y     = 67.0
TITLE_SIZE  = 53.0
TITLE_LEN   = 538.0
RULE_X0, RULE_X1 = 165.0, 700.0
RULE1_Y, RULE2_Y = 72.0, 122.0
TAG_Y       = (92.5, 115.5)
TAG_SIZE    = 19.0
TAG_LEN     = (520.0, 347.0)
CON_Y       = (141.5, 160.5)
CON_SIZE    = 17.0
CON_LEN     = (384.0, 294.0)

# --- meta fields --------------------------------------------------------
META = [
    # label, label_x, baseline, rule_x0, rule_x1, rule_y, field_x
    ("Ms./M/s.",  57.0, 198.5, 172.0, 623.0, 200.5, 180.0),
    ("Invoice #",632.0, 198.5, 705.0, 813.0, 200.5, 712.0),
    ("Address",   56.0, 233.5, 130.0, 623.0, 235.0, 138.0),
    ("Inv. Date",632.0, 233.5, 703.0, 812.0, 235.0, 710.0),
]
META_SIZE = 18.0

# --- table --------------------------------------------------------------
COLS   = [56.0, 108.5, 212.0, 592.0, 678.5, 814.5]
T_TOP  = 242.0
T_HDR  = 284.0
T_BOT  = 973.5
N_ROWS = 16                       # 15 item rows + 1 TOTAL row
ROW_H  = (T_BOT - T_HDR) / N_ROWS
HDR_BASE  = 269.5
HDR_SIZE  = 18.0
HEADINGS  = ["QTY.", "DATE", "DESCRIPTION", "RATE", "AMOUNT"]
CELL_PAD  = 10.0
FILL_SIZE = 17.0

def row_top(i):    return T_HDR + i * ROW_H          # i = 0..N_ROWS-1
def row_base(i):   return row_top(i) + 27.5

# --- signatures ---------------------------------------------------------
SIG = [
    ("Receiver's Signature",  51.0, 285.0),
    ("Authorised Signature", 588.0, 817.0),
]
SIG_Y      = 1073.5
SIG_BASE   = 1095.0
SIG_SIZE   = 19.5
