"""anchor_tool.py — Cong cu tao va quan ly Smart Anchors (.meta.json) cho Anh Background AI.
Giup dinh vi chuan xac mat san (ground_y), diem neo do vat (bed.sit, desk.seat, door...) tren anh AI.
Cung cap cac mau Presets co san va huong dan Prompt tao anh nen Minimalist.
"""
import argparse
import json
import os
import sys

PRESETS = {
    "bedroom": {
        "ground_y": 0.82,
        "horizon_y": 0.45,
        "dim": 0.25,
        "anchors": {
            "bed.sit": [0.32, 0.74],
            "bed.head": [0.18, 0.68],
            "bed.lie": [0.26, 0.72],
            "desk.seat": [0.78, 0.76],
            "desk.top": [0.78, 0.62],
            "door": [0.90, 0.78],
            "floor": [0.50, 0.82]
        },
        "light_source": {"x": 0.18, "y": 0.35, "color": "#ffb48a", "r": 0.35, "a": 0.25}
    },
    "street": {
        "ground_y": 0.85,
        "horizon_y": 0.50,
        "dim": 0.22,
        "anchors": {
            "bench": [0.30, 0.82],
            "streetLamp": [0.75, 0.85],
            "walk.left": [0.15, 0.85],
            "walk.right": [0.85, 0.85],
            "floor": [0.50, 0.85]
        },
        "light_source": {"x": 0.75, "y": 0.30, "color": "#ffe49e", "r": 0.40, "a": 0.30}
    },
    "cafe": {
        "ground_y": 0.82,
        "horizon_y": 0.48,
        "dim": 0.20,
        "anchors": {
            "table.left": [0.35, 0.76],
            "table.right": [0.65, 0.76],
            "counter": [0.85, 0.78],
            "door": [0.12, 0.80],
            "floor": [0.50, 0.82]
        }
    },
    "gym": {
        "ground_y": 0.85,
        "horizon_y": 0.45,
        "dim": 0.24,
        "anchors": {
            "bench": [0.35, 0.82],
            "punchBag": [0.75, 0.52],
            "barbell": [0.50, 0.85],
            "floor": [0.50, 0.85]
        }
    },
    "void": {
        "ground_y": 0.82,
        "horizon_y": 0.50,
        "dim": 0.15,
        "anchors": {
            "spot": [0.50, 0.82],
            "floor": [0.50, 0.82]
        }
    }
}

MINIMALIST_PROMPT_RULES = """
========================================================================
💡 NGUYÊN TẮC VÀNG TẠO ẢNH NỀN AI (MINIMALIST BACKGROUND PROMPT RULES)
========================================================================
1. KHÔNG GIAN SẠCH, MẶT SÀN RÕ RỆT (STRONG FLAT HORIZONTAL FLOOR):
   - Luôn yêu cầu sàn nhà phẳng, liền mạch ở nửa dưới ảnh (từ 75% -> 85% chiều cao).
   - Tuyệt đối KHÔNG có đồ đạc rác vụn vãi trên sàn gây cản trở tọa độ bước đi.

2. GÓC NHÌN PHẲNG / 1 ĐIỂM TỤ (1-POINT OR ORTHOGRAPHIC PERSPECTIVE):
   - Tránh các góc chụp chéo hiểm hóc, góc nghiêng mắt cá (fisheye/dutch angle).
   - Góc nhìn thẳng mặt (Front view) giúp nhân vật 2D không bị lệch phối cảnh.

3. KHÔNG VẼ NHÂN VẬT HOẶC KHUÔN MẶT (NO CHARACTERS / NO FACES):
   - Phải có Negative Prompt: "people, characters, human, person, face".
   - Ảnh AI chỉ đóng vai trò "Sân khấu trống" (Empty Stage).

4. BẢNG MÀU TỐI GIẢN THEO TONE CỦA KÊNH:
   - "Dark atmospheric room, minimal furniture, subtle neon/ambient light, flat 2d stylized art".
   - Giúp tôn bật nhân vật nét sáng viền kem của pack 'dem'.
========================================================================
"""

def get_meta_path(img_path: str) -> str:
    base, _ = os.path.splitext(img_path)
    return base + ".meta.json"

def init_meta(img_path: str, preset: str = "bedroom") -> str:
    if not os.path.exists(img_path):
        sys.exit(f"Loi: Khong tim thay file anh tai '{img_path}'")
    meta_path = get_meta_path(img_path)
    data = PRESETS.get(preset, PRESETS["bedroom"])
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return meta_path

def view_meta(img_path: str):
    meta_path = get_meta_path(img_path)
    if not os.path.exists(meta_path):
        print(f"[*] Anh '{os.path.basename(img_path)}' chua co file metadata ({os.path.basename(meta_path)}).")
        print(f"    Khoi tao nhanh bang: py tools/anchor_tool.py --init \"{img_path}\" --preset bedroom")
        return
    with open(meta_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    print(f"\n========== SMART ANCHORS: {os.path.basename(img_path)} ==========")
    print(f"  * Mat san (ground_y) : {data.get('ground_y', 0.8)}")
    print(f"  * Do toi (dim)       : {data.get('dim', 0.25)}")
    print("  * Danh sach diem neo (Anchors):")
    for k, v in data.get("anchors", {}).items():
        print(f"    - {k:<14} -> x={v[0]:.2f}, y={v[1]:.2f}")
    if data.get("light_source"):
        ls = data["light_source"]
        print(f"  * Nguon sang (Light) : x={ls.get('x')}, y={ls.get('y')}, color={ls.get('color')}")
    print("===============================================================\n")

def set_anchor(img_path: str, key: str, x: float, y: float):
    meta_path = get_meta_path(img_path)
    if not os.path.exists(meta_path):
        init_meta(img_path, "bedroom")
    with open(meta_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if "anchors" not in data:
        data["anchors"] = {}
    data["anchors"][key] = [round(x, 2), round(y, 2)]
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[v] Da cap nhat diem neo '{key}': [{x:.2f}, {y:.2f}] vao {os.path.basename(meta_path)}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Quan ly Smart Anchors (.meta.json) cho Background AI.")
    parser.add_argument("--image", help="Duong dan toi file anh nen (vd: projects/hero_demo/anh/bg_bedroom.png)")
    parser.add_argument("--init", action="store_true", help="Khoi tao file .meta.json cho anh")
    parser.add_argument("--preset", default="bedroom", choices=list(PRESETS.keys()), help="Preset boi canh mau")
    parser.add_argument("--view", action="store_true", help="Xem toa do cac diem neo hien tai")
    parser.add_argument("--key", help="Ten diem neo (vd: bed.sit, desk.seat, door)")
    parser.add_argument("--x", type=float, help="Toa do x (0.0 -> 1.0)")
    parser.add_argument("--y", type=float, help="Toa do y (0.0 -> 1.0)")
    parser.add_argument("--rules", action="store_true", help="Xem huong dan Prompt tao anh nen AI Minimalist")

    args = parser.parse_args()

    if args.rules:
        print(MINIMALIST_PROMPT_RULES)
    elif args.view and args.image:
        view_meta(args.image)
    elif args.init and args.image:
        p = init_meta(args.image, args.preset)
        print(f"[v] Da khoi tao thanh cong: {p} (Preset: {args.preset})")
        view_meta(args.image)
    elif args.key and args.x is not None and args.y is not None and args.image:
        set_anchor(args.image, args.key, args.x, args.y)
    else:
        parser.print_help()
