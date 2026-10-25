# HƯỚNG DẪN QUY TRÌNH SẢN XUẤT HOẠT HÌNH 2D (H2 STUDIO)

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

## 3. Quy trình sản xuất một tập phim mới

### Bước 1: Viết kịch bản
Chỉ cần đưa ra đề tài (ví dụ: *"Cai nghiện điện thoại"*, *"Kỷ luật thức dậy lúc 5 giờ sáng"*, *"Chiến thắng con quỷ lười biếng"*).  
Hệ thống sẽ tạo ra:
- File kịch bản phân cảnh chi tiết (thời lượng, bối cảnh, tư thế nhân vật, câu thoại chữ cám dỗ, nhạc nền, SFX).
- Bộ đếm ngày `DAY N`.
- Bộ 10 tiêu đề giật tít + 3 ý tưởng thumbnail.

### Bước 2: Tạo dự án & Khởi tạo cảnh
Tạo dự án mới trong studio:
```bash
py tools/new_project.py --name <ten_du_an> --title "<Tên Phim>" --pack dem --style flat --lang en
```
Kịch bản được ghi vào: `projects/<ten_du_an>/story/shots.json`.

### Bước 3: Xem trước phân cảnh (Storyboard Sheet)
Chạy lệnh xuất bảng ảnh storyboard để kiểm tra bố cục trước khi render video:
```bash
node render.mjs --project projects/<ten_du_an> --sheet --scale 0.5 --at 0.5
```
Ảnh tổng hợp lưu tại: `projects/<ten_du_an>/build/sheets/sheet_01.jpg`.

### Bước 4: Xuất video hoàn chỉnh có âm thanh
1. **Kết xuất hình ảnh (Video silent):**
   ```bash
   node render.mjs --project projects/<ten_du_an>
   ```
2. **Lồng ghép âm thanh chuẩn -14 LUFS:**
   ```bash
   py tools/mix.py --project projects/<ten_du_an>
   ```
Video xuất xưởng tại: `projects/<ten_du_an>/out/<Tên Phim>.mp4`.

---

## 4. Các bối cảnh có sẵn trong Studio

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

## 5. Danh sách thư viện âm thanh (SFX & Music)

- **Nhạc nền:** `sad` (piano u sầu), `dark` (drone nhịp tim rùng rợn), `rise` (trống dồn và piano vươn lên), `resolve` (hợp âm ấm áp kết phim), `hope` (bình minh hy vọng).
- **Hiệu ứng SFX:** `clock_tick` (đồng hồ tích tắc), `alarm_beep` (chuông báo thức), `tempt_whisper` (tiếng quỷ thì thầm), `tempt_swell` (âm u đe dọa), `flash_hit` (chớp sáng giác ngộ), `glass_shatter` (kính vỡ khi quỷ tan biến), `footsteps` (tiếng bước chân), `whoosh_fast` (tiếng gió lướt), `heartbeat` (tiếng tim đập dồn dập)...
