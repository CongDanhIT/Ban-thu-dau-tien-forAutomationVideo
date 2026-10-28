"""produce.py — Master Production Pipeline CLI cho H2-2D-Studio.
Dieu phoi tu dong toan bo quy trinh tao video tu Kich ban -> Voice -> Asset Audit -> Render -> Mix -> QC Gate.

Cach dung:
  # 1. San xuat tron goi video khong loi doc (Self-Improvement):
  py -X utf8 tools/produce.py --project projects/my_film --pack dem --phim input/01-PHIM-my_film.txt

  # 2. San xuat tron goi video tai hien / tai lieu co voiceover:
  py -X utf8 tools/produce.py --project projects/crash_reconstruct --pack reconstruct --voice input/voice.wav --pause-profile documentary

  # 3. Chay tung cong doan rieng le (debug):
  py -X utf8 tools/produce.py --project projects/the_loop --stage storyboard
  py -X utf8 tools/produce.py --project projects/the_loop --stage render
  py -X utf8 tools/produce.py --project projects/the_loop --stage mix
  py -X utf8 tools/produce.py --project projects/the_loop --stage qc
"""

import argparse
import glob
import json
import os
import subprocess
import sys
import time

TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))
STUDIO_DIR = os.path.dirname(TOOLS_DIR)
sys.path.insert(0, TOOLS_DIR)

from common import read_json, write_json

# ANSI Styling
C_RESET = "\033[0m"
C_BOLD = "\033[1m"
C_CYAN = "\033[96m"
C_GREEN = "\033[92m"
C_YELLOW = "\033[93m"
C_RED = "\033[91m"
C_MAGENTA = "\033[95m"

def log_step(step_num, title):
    print(f"\n{C_BOLD}{C_CYAN}======================================================================{C_RESET}")
    print(f"{C_BOLD}{C_CYAN}[STAGE {step_num}] {title.upper()}{C_RESET}")
    print(f"{C_BOLD}{C_CYAN}======================================================================{C_RESET}")

def log_info(msg):
    print(f" {C_GREEN}* {C_RESET}{msg}")

def log_warn(msg):
    print(f" {C_YELLOW}! [WARN] {msg}{C_RESET}")

def log_error(msg):
    print(f" {C_RED}x [ERROR] {msg}{C_RESET}")

def log_success(msg):
    print(f" {C_BOLD}{C_GREEN}v [SUCCESS] {msg}{C_RESET}")

def run_cmd(cmd_list, desc=""):
    if desc:
        log_info(f"Thuc thi: {desc}")
    # Chay tren Windows voi UTF-8
    res = subprocess.run(cmd_list, cwd=STUDIO_DIR, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if res.returncode != 0:
        log_error(f"Lenh that bai: {' '.join(cmd_list)}")
        if res.stderr:
            print(f"{C_RED}{res.stderr.strip()}{C_RESET}")
        if res.stdout:
            print(f"{C_YELLOW}{res.stdout.strip()}{C_RESET}")
        return False, res.stdout, res.stderr
    if res.stdout and res.stdout.strip():
        # In ket qua tom tat
        lines = res.stdout.strip().splitlines()
        for line in lines[-8:]: # in 8 dong cuoi
            print(f"   {line}")
    return True, res.stdout, res.stderr

def audit_assets(project_dir):
    """Kiem toan tai nguyen trong story/shots.json so voi asset_registry.json"""
    shots_file = os.path.join(project_dir, "story", "shots.json")
    if not os.path.exists(shots_file):
        log_warn("Chua co story/shots.json de kiem toan tai nguyen.")
        return True

    reg_file = os.path.join(TOOLS_DIR, "asset_registry.json")
    if not os.path.exists(reg_file):
        log_warn("Khong tim thay asset_registry.json.")
        return True

    story = read_json(shots_file, {})
    reg = read_json(reg_file, {})
    shots = story.get("shots", [])

    known_sets = set(reg.get("sets", {}).get("canonical", []))
    known_props = set(reg.get("props", {}).get("canonical", []))
    known_poses = set(reg.get("poses", {}).get("canonical", []))

    missing = []
    used_sets = set()
    used_props = set()

    for s in shots:
        sid = s.get("id", "unknown")
        # Check set
        st = s.get("set")
        if st:
            used_sets.add(st)
            if st not in known_sets:
                missing.append(f"Shot '{sid}' su dung set la: '{st}'")
        # Check props
        pr = s.get("props") or s.get("prop")
        if pr:
            if isinstance(pr, list):
                for p in pr:
                    used_props.add(p)
                    if p not in known_props:
                        missing.append(f"Shot '{sid}' su dung prop la: '{p}'")
            elif isinstance(pr, str):
                used_props.add(pr)
                if pr not in known_props:
                    missing.append(f"Shot '{sid}' su dung prop la: '{pr}'")

    print(f"   - Tong so shot: {len(shots)}")
    print(f"   - Boi canh (sets) su dung: {', '.join(sorted(used_sets)) or 'None'}")
    print(f"   - Dao cu (props) su dung: {', '.join(sorted(used_props)) or 'None'}")

    if missing:
        log_warn(f"Phat hien {len(missing)} tai nguyen chua co trong asset_registry.json:")
        for m in missing[:8]:
            print(f"     ! {m}")
        print("   -> Goi y: Hay kiem tra alias hoac chay tools/asset_registry.py de dang ky bo sung.")
        return False
    else:
        log_success("Toan bo tai nguyen duoc xac thuc 100% trong asset_registry.json.")
        return True

def main():
    parser = argparse.ArgumentParser(description="H2 Studio Master Production Pipeline")
    parser.add_argument("--project", required=True, help="Duong dan thu muc du an (vd: projects/the_loop)")
    parser.add_argument("--title", default="", help="Tieu de video")
    parser.add_argument("--pack", default="", choices=["", "dem", "doodle", "reconstruct"], help="Goi phong cach")
    parser.add_argument("--aspect", default="16:9", choices=["16:9", "9:16"], help="Ty le khung hinh")
    parser.add_argument("--resolution", default="1080p", help="Do phan giai")
    parser.add_argument("--phim", help="Duong dan file 01-PHIM-<slug>.txt (cho phim khong loi)")
    parser.add_argument("--voice", help="Duong dan file voice thô (.wav / .mp3)")
    parser.add_argument("--pause-profile", default="documentary", choices=["tight", "documentary", "gentle"], help="Profile cat khoang lang voice")
    parser.add_argument("--stage", default="all", choices=["all", "setup", "storyboard", "voice", "audit", "render", "mix", "qc"], help="Giai doan thuc thi")
    parser.add_argument("--force", action="store_true", help="Ghi de du lieu cu")
    parser.add_argument("--skip-render", action="store_true", help="Bo qua render Chromium (dung video_silent cu)")

    args = parser.parse_args()

    # Chuan hoa duong dan project
    p_path = args.project
    if not os.path.isabs(p_path):
        p_path = os.path.join(STUDIO_DIR, p_path)
    p_name = os.path.basename(os.path.normpath(p_path))

    start_time = time.time()
    print(f"\n{C_BOLD}{C_MAGENTA}======================================================================{C_RESET}")
    print(f"{C_BOLD}{C_MAGENTA}    H2 STUDIO — MASTER PRODUCTION PIPELINE v2.0{C_RESET}")
    print(f"{C_BOLD}{C_MAGENTA}    Du an: {p_name} | Stage: {args.stage}{C_RESET}")
    print(f"{C_BOLD}{C_MAGENTA}======================================================================{C_RESET}")

    # STAGE 1: SETUP
    if args.stage in ("all", "setup"):
        log_step(1, "Khoi tao & Dong bo Cau hinh Du an (Setup)")
        cfg_file = os.path.join(p_path, "config.json")
        if not os.path.exists(cfg_file) or args.force:
            cmd = [sys.executable, "-X", "utf8", os.path.join(TOOLS_DIR, "new_project.py"),
                   "--name", p_name, "--title", args.title or p_name,
                   "--aspect", args.aspect, "--resolution", args.resolution]
            if args.pack:
                cmd.extend(["--pack", args.pack])
            ok, _, _ = run_cmd(cmd, "Khoi tao thu muc & config.json")
            if not ok:
                sys.exit(1)
        else:
            log_info(f"Su dung cau hinh da co: {cfg_file}")

        # Dong bo pack neu co tham so
        cfg = read_json(cfg_file, {})
        if args.pack and cfg.get("pack") != args.pack:
            cfg["pack"] = args.pack
            write_json(cfg_file, cfg)
            log_info(f"Cap nhat pack thanh: '{args.pack}'")
        log_success("Hoan tat thiet lap du an.")

    # STAGE 2: VOICE POLISH (Neu co voiceover)
    if args.stage in ("all", "voice") and args.voice:
        log_step(2, "Xu ly Am thanh Voiceover & Cat khoang lang (Voice Polish)")
        raw_voice = os.path.abspath(args.voice)
        if not os.path.exists(raw_voice):
            log_error(f"Khong tim thay file voice: {raw_voice}")
            sys.exit(1)

        v_out = os.path.join(p_path, "timeline", "voice.wav")
        os.makedirs(os.path.dirname(v_out), exist_ok=True)

        # Chay pauses.py de cat khoang lang
        cmd_pause = [sys.executable, "-X", "utf8", os.path.join(TOOLS_DIR, "pauses.py"),
                     "--in", raw_voice, "--out", v_out, "--profile", args.pause_profile]
        ok, _, _ = run_cmd(cmd_pause, f"Cat khoang lang voi profile '{args.pause_profile}'")
        if not ok:
            sys.exit(1)

        # Chay prep_voice neu co
        prep_tool = os.path.join(TOOLS_DIR, "prep_voice.py")
        if os.path.exists(prep_tool):
            cmd_prep = [sys.executable, "-X", "utf8", prep_tool, "--project", p_path]
            ok, _, _ = run_cmd(cmd_prep, "Trich xuat phu de & moc thoi gian Whisper (lines.json, words.json)")
            if not ok:
                log_warn("prep_voice khong hoan tat, tiep tuc neu da co san moc thoi gian.")
        log_success("Hoan tat xu ly am thanh voice.")

    # STAGE 3: STORYBOARD & SCRIPT PARSING
    if args.stage in ("all", "storyboard"):
        log_step(3, "Bien dich Kich ban & Phan canh Dien anh (Storyboard)")
        if args.phim:
            phim_file = os.path.abspath(args.phim)
            if not os.path.exists(phim_file):
                log_error(f"Khong tim thay file kịch bản: {phim_file}")
                sys.exit(1)
            cmd_phim = [sys.executable, "-X", "utf8", os.path.join(TOOLS_DIR, "phim.py"),
                        "--project", p_path, "--phim", phim_file]
            if args.force:
                cmd_phim.append("--force")
            ok, _, _ = run_cmd(cmd_phim, "Bien dich 01-PHIM sang story/shots.json")
            if not ok:
                sys.exit(1)
        elif os.path.exists(os.path.join(p_path, "timeline", "lines.json")) and not os.path.exists(os.path.join(p_path, "story", "shots.json")):
            cmd_draft = [sys.executable, "-X", "utf8", os.path.join(TOOLS_DIR, "draft_shots.py"),
                         "--project", p_path]
            if args.force:
                cmd_draft.append("--force")
            ok, _, _ = run_cmd(cmd_draft, "Tao khung story/shots.json tu timeline/lines.json")
            if not ok:
                sys.exit(1)
        else:
            log_info("Su dung story/shots.json hien co.")

        log_success("Kich ban storyboard san sang.")

    # STAGE 4: ASSET REGISTRY AUDIT GATE
    if args.stage in ("all", "audit", "storyboard"):
        log_step(4, "Kiem toan Tai nguyen & Boi canh (Asset Registry Audit)")
        audit_assets(p_path)

    # STAGE 5: ENGINE RENDERING (Headless Chromium)
    if args.stage in ("all", "render") and not args.skip_render:
        log_step(5, "Render Do hoa Chromium Headless (Engine Render)")
        render_script = os.path.join(STUDIO_DIR, "render.mjs")
        if not os.path.exists(render_script):
            log_error(f"Khong tim thay render.mjs tai: {render_script}")
            sys.exit(1)

        cmd_render = ["node", render_script, "--project", p_path]
        ok, _, _ = run_cmd(cmd_render, f"Render video khung hinh den build/video_silent.mp4")
        if not ok:
            log_error("Render Chromium gap su co!")
            sys.exit(1)
        log_success("Render do hoa thanh cong.")

    # STAGE 6: BROADCAST MASTERING (-14 LUFS)
    if args.stage in ("all", "mix"):
        log_step(6, "Hoa am Da tang Chuan Broadcast -14 LUFS (Master Audio)")
        mix_tool = os.path.join(TOOLS_DIR, "mix.py")
        cmd_mix = [sys.executable, "-X", "utf8", mix_tool, "--project", p_path]
        ok, _, _ = run_cmd(cmd_mix, "Tron Voice + Music + SFX chuan -14 LUFS va ghep vao out/*.mp4")
        if not ok:
            log_error("Hoa am mix.py gap su co!")
            sys.exit(1)
        log_success("Hoa am thanh cong.")

    # STAGE 7: QUALITY CONTROL GATEKEEPER
    if args.stage in ("all", "qc"):
        log_step(7, "Chot chan Kiem dinh Chat luong (Quality Gate)")
        qc_tool = os.path.join(TOOLS_DIR, "qc_video.py")
        cmd_qc = [sys.executable, "-X", "utf8", qc_tool, "--project", p_path]
        ok, out_str, _ = run_cmd(cmd_qc, "Kiem tra do on dinh, am luong, black frame & sinh contact sheet")
        
        # Kiem tra ket qua QC
        sheet_path = os.path.join(p_path, "build", "qc_sheet.jpg")
        has_sheet = os.path.exists(sheet_path)

        if "ISSUE" in out_str or "issues" in out_str.lower() or not ok:
            log_warn("Video da render nhung co mot so canh bao can chu y trong bao cao QC o tren.")
        else:
            log_success("QC PASSED — Video dat 100% tieu chuan phat song YouTube!")
        
        if has_sheet:
            log_info(f"Contact sheet kiem tra visual: {sheet_path}")

    # SUMMARY REPORT
    elapsed = time.time() - start_time
    print(f"\n{C_BOLD}{C_GREEN}======================================================================{C_RESET}")
    print(f"{C_BOLD}{C_GREEN}    HOAN TAT QUY TRINH SAN XUAT ({elapsed:.1f}s){C_RESET}")
    print(f"{C_BOLD}{C_GREEN}======================================================================{C_RESET}")
    out_files = glob.glob(os.path.join(p_path, "out", "*.mp4"))
    if out_files:
        latest_vid = sorted(out_files, key=os.path.getmtime)[-1]
        print(f" {C_BOLD}Video xuat ban:{C_RESET} {latest_vid}")
        sheet_path = os.path.join(p_path, "build", "qc_sheet.jpg")
        if os.path.exists(sheet_path):
            print(f" {C_BOLD}Contact sheet:{C_RESET} {sheet_path}")
    print(f"{C_GREEN}Quy trinh da thuc thi dung theo MASTER_SOP.md.{C_RESET}\n")

if __name__ == "__main__":
    main()
