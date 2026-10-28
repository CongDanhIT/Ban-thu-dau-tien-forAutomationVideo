"""asset_registry.py — He thong quan ly, tu dien bi danh va kiem toan tai nguyen (Asset & SFX Registry).
Chong de asset rac, ho tro Fuzzy Matching (sai lech ky tu) va Semantic Aliasing (tu dong nghia).
Ho tro vong doi tai nguyen: Them moi, Xoa bo (kem kiem tra tac dong - Impact Analysis), Kiem tra su dung.
"""
import argparse
import difflib
import glob
import json
import os
import re
import sys
import unicodedata

REGISTRY_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "asset_registry.json")
STUDIO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# ==========================================
# 1. NAP VA LUU REGISTRY (JSON BACKED)
# ==========================================

def load_registry() -> dict:
    if os.path.exists(REGISTRY_FILE):
        try:
            with open(REGISTRY_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                # Chuyen canonical thanh set de tra cuu nhanh
                for cat in data:
                    data[cat]["canonical"] = set(data[cat].get("canonical", []))
                    data[cat]["aliases"] = data[cat].get("aliases", {})
                return data
        except Exception as e:
            print(f"[!] Canh bao khi doc asset_registry.json: {e}")
    return {}


def save_registry(registry_data: dict):
    out = {}
    for cat, val in registry_data.items():
        out[cat] = {
            "canonical": sorted(list(val["canonical"])),
            "aliases": val["aliases"]
        }
    with open(REGISTRY_FILE, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)


REGISTRY = load_registry()


# ==========================================
# 2. HAM CHUAN HOA & SO KHOP (MATCHING ENGINE)
# ==========================================

def normalize_text(text: str) -> str:
    """Chuyen tieng Viet thanh khong dau, chu thuong, xoa ky tu dac biet."""
    if not text:
        return ""
    s = unicodedata.normalize("NFD", text.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    s = s.replace("đ", "d").replace("Đ", "d")
    s = re.sub(r"[_\-\.\:\,\;]+", " ", s)
    return " ".join(s.split())


def resolve_asset(category: str, query: str, cutoff: float = 0.75) -> dict:
    """So khop va quy ve asset chuan:
    1. Exact Match trong canonical
    2. Exact Match trong Aliases
    3. Fuzzy Match trong Aliases / Canonical (chong lech 1-2 ky tu, typo)
    4. Missing -> Bao thieu kem huong dan tao moi.
    """
    cat = REGISTRY.get(category)
    if not cat:
        return {"status": "error", "message": f"Category '{category}' khong ton tai", "resolved": query}

    canonical = cat["canonical"]
    aliases = cat["aliases"]

    q_raw = query.strip()
    q_norm = normalize_text(q_raw)
    q_slug = q_norm.replace(" ", "_")

    # 1. Exact Match trong Canonical
    if q_raw in canonical or q_slug in canonical:
        target = q_raw if q_raw in canonical else q_slug
        return {"status": "exact", "resolved": target, "original": query, "confidence": 1.0}

    # 2. Exact Match trong Aliases
    if q_norm in aliases:
        return {"status": "alias", "resolved": aliases[q_norm], "original": query, "confidence": 1.0}

    # 3. Fuzzy Match tren Canonical danh sach
    matches_canon = difflib.get_close_matches(q_slug, list(canonical), n=1, cutoff=cutoff)
    if matches_canon:
        sim = difflib.SequenceMatcher(None, q_slug, matches_canon[0]).ratio()
        return {"status": "fuzzy", "resolved": matches_canon[0], "original": query, "confidence": round(sim, 2)}

    # 4. Fuzzy Match tren danh sach Alias keys
    matches_alias = difflib.get_close_matches(q_norm, list(aliases.keys()), n=1, cutoff=cutoff)
    if matches_alias:
        target = aliases[matches_alias[0]]
        sim = difflib.SequenceMatcher(None, q_norm, matches_alias[0]).ratio()
        return {"status": "fuzzy", "resolved": target, "original": query, "confidence": round(sim, 2)}

    suggestion = ""
    if category == "props":
        suggestion = f"Them asset voi ten TIENG ANH chuan: py tools/asset_registry.py --add props --name <english_name> --aliases '{query}'"
    elif category == "sfx":
        suggestion = f"Them SFX voi ten TIENG ANH chuan: py tools/asset_registry.py --add sfx --name <english_name> --aliases '{query}', roi nap file audio/sfx/<english_name>.wav (48kHz)"
    elif category == "sets":
        suggestion = f"Them boi canh TIENG ANH: py tools/asset_registry.py --add sets --name <english_name> --aliases '{query}'"

    return {
        "status": "missing",
        "resolved": q_slug,
        "original": query,
        "confidence": 0.0,
        "suggestion": suggestion
    }


# ==========================================
# 3. KIEM TRA TAC DONG & VONG DOI (LIFECYCLE)
# ==========================================

def check_asset_usage(asset_name: str) -> list:
    """Kiem tra xem asset co dang duoc su dung boi cac video cu trong projects/ khong.
    Chong loi day chuyen (Impact Analysis & Regression Check - Rule 9).
    """
    usages = []
    projects_dir = os.path.join(STUDIO_ROOT, "projects")
    if not os.path.exists(projects_dir):
        return usages

    shots_files = glob.glob(os.path.join(projects_dir, "*", "story", "shots.json"))
    target = asset_name.strip()

    for sf in shots_files:
        proj_name = os.path.basename(os.path.dirname(os.path.dirname(sf)))
        try:
            with open(sf, "r", encoding="utf-8") as f:
                data = json.load(f)
                for shot in data.get("shots", []):
                    shot_id = shot.get("id", "unknown")
                    args = shot.get("args", {})
                    # Kiem tra set
                    if args.get("set") == target:
                        usages.append({"project": proj_name, "shot": shot_id, "field": "set"})
                    # Kiem tra sfx
                    for s in shot.get("sfx", []):
                        if s.get("name") == target:
                            usages.append({"project": proj_name, "shot": shot_id, "field": "sfx"})
                    # Kiem tra actors (pose, face, who, hold)
                    for a in args.get("actors", []):
                        if a.get("pose") == target or a.get("face") == target or a.get("hold") == target:
                            usages.append({"project": proj_name, "shot": shot_id, "field": "actor"})
        except Exception:
            continue
    return usages


def add_asset(category: str, name: str, aliases: list = None) -> dict:
    """Them mot asset moi vao he thong va cap nhat file asset_registry.json."""
    cat = REGISTRY.get(category)
    if not cat:
        return {"success": False, "error": f"Category '{category}' khong hop le. (Hop le: sets, props, poses, faces, sfx)"}

    name_clean = name.strip()
    if not re.match(r'^[a-zA-Z0-9_]+$', name_clean):
        return {"success": False, "error": f"QUY TAC: Ten dinh danh asset '{name_clean}' bat buoc phai la TIENG ANH (a-z, 0-9, gach duoi, vd: 'steering_wheel'). Vui long dua tu tieng Viet vao --aliases."}

    slug = name_clean.lower()
    cat["canonical"].add(slug)

    added_aliases = []
    if aliases:
        for al in aliases:
            al_norm = normalize_text(al)
            if al_norm:
                cat["aliases"][al_norm] = slug
                added_aliases.append(al_norm)

    save_registry(REGISTRY)
    return {
        "success": True,
        "name": slug,
        "category": category,
        "aliases": added_aliases,
        "message": f"Da them '{slug}' vao danh muc {category} voi {len(added_aliases)} bi danh."
    }


def remove_asset(category: str, name: str, force: bool = False) -> dict:
    """Xoa asset khoi he thong.
    Bat buoc kiem tra xem co project nao dang phu thuoc vao asset nay khong.
    """
    cat = REGISTRY.get(category)
    if not cat:
        return {"success": False, "error": f"Category '{category}' khong hop le."}

    slug = normalize_text(name).replace(" ", "_")

    # Kiem tra tac dong truoc khi xoa (Impact Analysis - Rule 9)
    usages = check_asset_usage(slug)
    if usages and not force:
        usage_str = ", ".join([f"{u['project']}:{u['shot']}" for u in usages[:5]])
        return {
            "success": False,
            "error": f"Asset '{slug}' dang duoc su dung boi cac du an: [{usage_str}]. Them --force neu van muon xoa.",
            "usages": usages
        }

    # Xoa khoi canonical
    removed = False
    if slug in cat["canonical"]:
        cat["canonical"].remove(slug)
        removed = True

    # Xoa khoi cac aliases tro ve no
    alias_removed = 0
    keys_to_del = [k for k, v in cat["aliases"].items() if v == slug]
    for k in keys_to_del:
        del cat["aliases"][k]
        alias_removed += 1

    save_registry(REGISTRY)

    cleanup_note = []
    if category == "props":
        cleanup_note.append(f"Kiem tra va xoa ham ve vector lien quan trong packs/dem/props.js")
    elif category == "sfx":
        cleanup_note.append(f"Xoa file audio/sfx/{slug}.wav hoac ham trong packs/dem/audio.py neu co")
    elif category == "sets":
        cleanup_note.append(f"Kiem tra packs/dem/sets.js")

    return {
        "success": True,
        "name": slug,
        "category": category,
        "aliases_removed": alias_removed,
        "usages_affected": len(usages),
        "cleanup_steps": cleanup_note,
        "message": f"Da xoa '{slug}' khoi registry ({alias_removed} bi danh da don dep)."
    }


# ==========================================
# 4. GIAO DIEN DONG LENH (CLI)
# ==========================================

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Quan ly vong doi Asset & SFX trong Studio (Them, Xoa, Kiem toan, Kiem tra tac dong).")
    parser.add_argument("--list", nargs="?", const="all", help="Liet ke danh muc: sets, props, poses, faces, sfx hoac all")
    parser.add_argument("--add", help="Them asset moi vao category (vd: --add props)")
    parser.add_argument("--remove", help="Xoa asset khoi category (vd: --remove props)")
    parser.add_argument("--name", help="Ten asset can them hoac xoa")
    parser.add_argument("--aliases", help="Danh sach bi danh phan cach boi dau phay (vd: 'vo lang, tay lai')")
    parser.add_argument("--check", help="Kiem tra xem 1 asset co dang duoc su dung boi du an nao khong (Impact Check)")
    parser.add_argument("--force", action="store_true", help="Cuong che xoa ke ca khi co du an dang su dung")

    args = parser.parse_args()

    if args.list:
        cats = [args.list] if args.list in REGISTRY else list(REGISTRY.keys())
        print("========== DANH MUC TAI NGUYEN (REGISTRY) ==========")
        for c in cats:
            can = sorted(list(REGISTRY[c]["canonical"]))
            print(f"\n[{c.upper()}] ({len(can)} tai nguyen, {len(REGISTRY[c]['aliases'])} bi danh):")
            print("  " + ", ".join(can[:30]))
            if len(can) > 30:
                print(f"  ... va {len(can) - 30} tai nguyen khac.")
        print("====================================================")

    elif args.check:
        print(f"[*] Dang kiem tra pham vi anh huong cua asset '{args.check}'...")
        us = check_asset_usage(args.check)
        if us:
            print(f"[!] Canh bao: Asset nay dang duoc dung o {len(us)} vi tri:")
            for u in us:
                print(f"    - Du an '{u['project']}' -> Canh [{u['shot']}] (truong: {u['field']})")
        else:
            print(f"[v] Asset '{args.check}' khong duoc dung o du an nao. An toan de chinh sua/xoa.")

    elif args.add:
        if not args.name:
            sys.exit("Loi: Vui long cung cap --name <ten_asset>")
        als = [x.strip() for x in args.aliases.split(",")] if args.aliases else []
        res = add_asset(args.add, args.name, als)
        if res["success"]:
            print(f"[v] THÀNH CÔNG: {res['message']}")
        else:
            print(f"[x] THẤT BẠI: {res['error']}")

    elif args.remove:
        if not args.name:
            sys.exit("Loi: Vui long cung cap --name <ten_asset>")
        res = remove_asset(args.remove, args.name, force=args.force)
        if res["success"]:
            print(f"[v] THÀNH CÔNG: {res['message']}")
            if res.get("usages_affected"):
                print(f"    [!] Luu y: Co {res['usages_affected']} canh trong cac du an cu co the bi anh huong.")
            if res.get("cleanup_steps"):
                print("    [*] Cac buoc don dep file vat ly de xuat:")
                for step in res["cleanup_steps"]:
                    print(f"        - {step}")
        else:
            print(f"[x] THẤT BẠI: {res['error']}")
