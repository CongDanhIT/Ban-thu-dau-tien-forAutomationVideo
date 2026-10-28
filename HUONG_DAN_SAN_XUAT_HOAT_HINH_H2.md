# HƯỚNG DẪN QUY TRÌNH SẢN XUẤT HOẠT HÌNH 2D (H2 STUDIO)

> [!IMPORTANT]
> **QUY CHUẨN VẬN HÀNH DUY NHẤT (SINGLE SOURCE OF TRUTH):**  
> Vui lòng tham chiếu [MASTER_SOP.md](file:///d:/project%20workspace/ContentYTBapp/MASTER_SOP.md) để biết quy trình chuẩn mực 5 giai đoạn cho mọi thể loại/pack (`dem`, `doodle`, `reconstruct`) và sử dụng bộ điều phối tự động:  
> `py -X utf8 tools/produce.py --project projects/<slug> [--pack dem|doodle|reconstruct]`

Tài liệu này ghi lại toàn bộ quy trình sản xuất phim hoạt hình ngắn không lời đọc (thể loại *"An Animated Short Film"* về kỷ luật, cai nghiện điện thoại, vượt qua cám dỗ) sử dụng **H2 2D Studio Engine** được vẽ và diễn hoạt 100% bằng code.

---

## 1. Nguyên lý vận hành cốt lõi

1. **Không tốn phí (0đ / 0 Credit AI):** Toàn bộ nhân vật, biểu cảm, cử động, bối cảnh phòng ngủ, đường phố, thành phố, chim bay, bóng đen cám dỗ... đều được vẽ bằng mã hình học vector Canvas 2D.
2. **Không bản quyền âm nhạc (Copyright-Free):** Toàn bộ nhạc nền (Sad Piano, Heartbeat Drone, Rise Beat) và 47 âm thanh hiệu ứng (SFX) đều được tổng hợp bằng công thức sóng âm vật lý (Python `numpy` + `scipy`).
3. **Chuẩn phát sóng YouTube:** Âm thanh tự động chuẩn hóa **-14 LUFS**. Tỉ lệ khung hình điện ảnh 16:9 kèm dải đen 2.39:1 (`bars: scope`).
4. **Tốc độ cao:** Kết xuất bằng CPU đa luồng qua Headless Chromium và FFmpeg (phim 15 giây mất ~35 giây, phim 2-3 phút mất ~3-5 phút).

---

## 2. Nhân vật chính (Hero V2)

Nhân vật của kênh được tích hợp trực tiếp vào file `h2-2d-studio/packs/dem/bean.js`:
- **Preset:** `"hero_v2"`
- **Đặc điểm nhận diện:** 
  - Da kem sáng `#ece6d6`, nét viền thanh mảnh `#7f7a6f`.
  - Mái tóc xoăn đen đặc trưng trên đỉnh đầu.
  - Áo hoodie xám có mũ trùm sau gáy và túi kangaroo.
- **Biểu cảm linh hoạt:** `tired`, `sleepy`, `sad`, `cry`, `worried`, `scared`, `determined`, `effort`, `smile`, `bloodshot` (mắt đỏ hoe thức đêm),...
- **Cử động sống động:** 
  - Tự động thở (`breathe`), tự động chớp mắt (`blink`), liếc mắt (`look`).
  - Đi bộ / Chạy bộ với chu kỳ nhịp nhàng (`gait()`), vung tay, co gối, nghiêng người và nhún nhảy theo bước chân.

---

## 3. Quy chuẩn Đặt tên Asset (100% Tiếng Anh)

Nhằm đảm bảo tính đồng bộ hệ thống, hạn chế tối đa sai sót khi render và tối ưu khả năng tái sử dụng:
1. **Tên Định danh (Canonical Name):** BẮT BUỘC **100% TIẾNG ANH** (dùng chữ thường, `snake_case` hoặc `camelCase`).
   - *Quy ước:* `alarm_beep` (không đặt `tieng_bao_thuc`), `steering_wheel` (không đặt `vo_lang`), `deskLamp` (không đặt `den_ban`).
   - Toàn bộ tên file vector trong `packs/dem/props.js`, file âm thanh `audio/sfx/<name>.wav`, file ảnh `anh/<name>.png` và dữ liệu trường trong `shots.json` đều lưu bằng tên Tiếng Anh này.
2. **Từ điển Tìm kiếm (Aliases):** Lưu trữ các từ khóa tiếng Việt (có dấu, không dấu) và từ đồng nghĩa:
   - Khi viết kịch bản, AI và người dùng có thể gõ tự nhiên bằng tiếng Việt (ví dụ: `"chuông báo thức"`, `"vô lăng"`, `"thức đêm"`).
   - Hệ thống `asset_registry.py` sẽ tự động đối chiếu ngữ nghĩa (Fuzzy Matching) để chuyển đổi về mã Tiếng Anh chuẩn xác.

---

## 4. Quy trình sản xuất một tập phim mới (Chuẩn MASTER_SOP)

Theo [MASTER_SOP.md](file:///d:/project%20workspace/ContentYTBapp/MASTER_SOP.md), toàn bộ quy trình từ kịch bản đến video thành phẩm được thực hiện tự động qua Master CLI:

```bash
# Lệnh trọn gói duy nhất (Tự động biên dịch kịch bản, render, mix -14 LUFS và QC):
py -X utf8 tools/produce.py --project projects/<ten_du_an> --pack dem --phim input/01-PHIM-<ten_du_an>.txt
```

*(Nếu cần gỡ lỗi hoặc thao tác thủ công từng công đoạn: xem chi tiết tại [MASTER_SOP.md](file:///d:/project%20workspace/ContentYTBapp/MASTER_SOP.md) với cờ `--stage storyboard`, `--stage render`, `--stage mix`, `--stage qc`).*

---

## 5. Các bối cảnh có sẵn trong Studio

| Mã bối cảnh (`set`) | Mô tả | Tham số tùy biến chính |
| :--- | :--- | :--- |
| `bedroom` | Phòng ngủ | Giờ đồng hồ (`clock: "03:45"`), chuông reo (`ring: true`), lịch tháng (`calendar`), đèn bàn (`lamp`), bầu trời đêm/trăng/bình minh (`sky: "night"/"moon"/"dawn"`). |
| `city` | Đường phố thành phố | Thời gian (`time: "dawn"/"night"/"dusk"`), cột đèn đường, chim bay (`birds: true`), đường trôi khi chạy (`scroll: true`). |
| `street` | Phố đêm cô đơn | Trạm xe buýt (`busstop`), cửa hàng neon phát sáng (`neonDoor`), mưa rơi (`rain`). |
| `court` | Sân bóng rổ ngoài trời | Cột rổ (`hoopX`), ghế băng dài (`benchX`). |
| `gym` | Phòng tập thể hình | Bao cát đấm bốc (`bagX`, `swing`), tạ đòn (`barbell`). |
| `stairs` | Cầu thang dài | Từng bậc thang (`step:0` ... `step:8`), ánh sáng đỉnh thang (`topColor`). |
| `hill` | Đỉnh đồi ngắm bình minh | Đỉnh đồi (`top`), mây trôi. |
| `void` / `black` | Không gian tối điện ảnh | Đèn rọi spotlight (`spot`), dành cho khoảnh khắc cô độc và lời tự sự chốt hạ. |

---

## 6. Danh sách thư viện âm thanh (SFX & Music)

- **Nhạc nền:** `sad` (piano u sầu), `dark` (drone nhịp tim rùng rợn), `rise` (trống dồn và piano vươn lên), `resolve` (hợp âm ấm áp kết phim), `hope` (bình minh hy vọng).
- **Hiệu ứng SFX:** `clock_tick` (đồng hồ tích tắc), `alarm_beep` (chuông báo thức), `tempt_whisper` (tiếng quỷ thì thầm), `tempt_swell` (âm u đe dọa), `flash_hit` (chớp sáng giác ngộ), `glass_shatter` (kính vỡ khi quỷ tan biến), `footsteps` (tiếng bước chân), `whoosh_fast` (tiếng gió lướt), `heartbeat` (tiếng tim đập dồn dập)...

---

## 7. Bộ công cụ Đạo diễn & Quản lý Tài nguyên Nâng cao

Nhằm tối ưu hóa chất lượng điện ảnh và năng lực mở rộng của Studio:

### 6.1. Quản lý Vòng đời Tài nguyên (`tools/asset_registry.py`)
- **Tra cứu:** `py tools/asset_registry.py --list all`
- **Thêm mới (Bắt buộc tiếng Anh):** `py tools/asset_registry.py --add props --name steering_wheel --aliases "vô lăng, tay lái"`
- **Xóa an toàn (Có kiểm tra tác động):** `py tools/asset_registry.py --remove props --name <ten_asset>`
- **Kiểm tra xem asset đang được video nào dùng:** `py tools/asset_registry.py --check <ten_asset>`

### 6.2. Môi trường AI với Điểm neo Thông minh (`tools/anchor_tool.py`)
- **Khởi tạo mốc tọa độ:** `py tools/anchor_tool.py --init <file_anh> --preset bedroom`
- **Xem tọa độ hiện tại:** `py tools/anchor_tool.py --image <file_anh> --view`
- **Chỉnh sửa điểm neo:** `py tools/anchor_tool.py --image <file_anh> --key bed.sit --x 0.35 --y 0.76`
- **Xem quy chuẩn Prompt ảnh nền AI Minimalist:** `py tools/anchor_tool.py --rules`

### 6.3. Đạo diễn Phân cảnh Tự động (`tools/phim.py`)
- Tự động gán góc máy điện ảnh (`cam`: Creep-in khi cám dỗ, Pull-out khi bừng tỉnh, Breathing push chống tĩnh hình).
- Tự động rung máy (`shake`) khi có chấn động tâm lý (tiếng chuông reo, chuỗi ngày sụp đổ).
- Tự động áp dụng bố cục 1/3 (dạt nhân vật sang trái, chừa khoảng tối mênh mông biểu thị sự cô độc).
- Tương phản kích thước: Quỷ cám dỗ (`voice`) cao lớn trùm lên nhân vật bé nhỏ co ro.
- Ghi chú ý đồ nghệ thuật (`notes`) chi tiết vào từng phân cảnh trong `shots.json`.
