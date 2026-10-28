# MASTER SOP: QUY TRÌNH CHUẨN SẢN XUẤT VIDEO ĐA PHONG CÁCH
*(Single Source of Truth - Bộ Quy Chuẩn Vận Hành Độc Tôn Cho H2-2D-Studio)*

> **Phiên bản:** 2.1 (Hệ thống Hỗ trợ Đa Phong Cách: 2D Dark Glow, 2D Whiteboard Doodle, 3D White Clay Reconstruction, 2.5D Cinematic Stick Figure)  
> **Áp dụng cho:** Tất cả các AI Agent, Developer và Content Creator khi thao tác sản xuất video trên kho tài nguyên `h2-2d-studio`.

---

## 1. NGUYÊN TẮC BẤT BIẾN (CORE LAWS)

1. **Một Nguồn Chân Lý (Single Source of Truth):**
   - Mọi quy trình, thông số kỹ thuật, cách phân loại chủ đề và lệnh chạy PHẢI TUÂN THỦ tài liệu này. 
   - Không dựa vào trí nhớ tạm thời hay các snippet hướng dẫn cũ bị phân tán.

2. **Code as Policy (Quy trình được bảo vệ bằng Code):**
   - Không thực thi chuỗi lệnh sản xuất bằng cách gõ tay từng bước rời rạc dễ gây thiếu sót.
   - Toàn bộ pipeline bắt buộc được điều phối tập trung qua script tổng lực: `tools/produce.py`.

3. **Chốt chặn Kiểm định (Strict Quality Gate):**
   - Video KHÔNG BAO GIỜ được coi là hoàn thành nếu chưa vượt qua bước kiểm định tự động bằng `tools/qc_video.py`.
   - Các tiêu chuẩn bắt buộc: Âm lượng tích hợp chuẩn **-14 LUFS** (sai số $\le \pm 1.5$ LU), không có black frame rác ($>0.6s$), không freezing bất thường ($>3s$), và sinh đầy đủ contact sheet `build/qc_sheet.jpg`.

4. **Kỷ luật Tài nguyên & Tích lũy Vĩnh viễn (Asset Compounding & Reusability Law):**
   - Mọi nhân vật, bối cảnh (`sets`), đạo cụ (`props`), tư thế (`poses`), khí tài 3D (`vehicles`) sử dụng trong cảnh quay phải tồn tại và được định danh chuẩn mực trong `tools/asset_registry.json`.
   - Tên định danh (Canonical Name) 100% bằng tiếng Anh `snake_case`.
   - **Quy tắc "Tạo một lần, Dùng mãi mãi" (Create Once, Reuse Forever):**
     * Tuyệt đối KHÔNG viết code asset tạm bợ kiểu "dùng một lần rồi vứt" (disposable) giấu trong riêng một shot nào đó.
     * Mọi asset mới sinh ra bắt buộc phải được đóng gói thành hàm chuẩn và commit vào thư viện dùng chung của Pack tương ứng (`packs/<pack>/props.js`, `sets.js`, `vehicles.js`...).
     * Mỗi video được sản xuất phải làm cho kho tài nguyên của Studio phong phú hơn (Hiệu ứng Tuyết Lăn - Snowball Effect). Các video sau này khi gặp kịch bản tương tự sẽ tự động tái sử dụng ngay lập tức mà không tốn công tạo lại.

---

## 2. BẢNG PHÂN LUỒNG PHONG CÁCH (STYLE & PACK ROUTING MATRIX)

Hệ thống hiện tại hỗ trợ 4 phong cách lớn. Khi bắt đầu dự án, AI/User phải xác định rõ Pack mục tiêu:

| Thể Loại / Đề Tài | Pack Tương Ứng | Đặc Trưng Hình Ảnh & Engine | Cơ Chế Kể Chuyện | Âm Thanh / Nhạc |
| :--- | :--- | :--- | :--- | :--- |
| **Tự hoàn thiện, kỷ luật, cám dỗ, tâm lý giới trẻ** (Self-Improvement) | `dem` *(hoặc `default`)* | 2D Canvas, nền đen sâu (`#08080c`), viền sáng neon, nhân vật đầu tròn màu kem, bóng đen cám dỗ phát sáng. | Không lời đọc (Non-verbal), kể bằng chữ trên màn hình (`> narr`, `~ tempt`, `! big`, HUD `DAY N`). | Dynamic synth, ambient piano, SFX click/whoosh/glitch theo beat. |
| **Giải thích kiến thức, tư duy, kinh tế học vi mô** (Explainer) | `doodle` | 2D Whiteboard / Sketch, nét vẽ vector tay đen/xám trên nền sáng giấy mộc, icon infographic, sơ đồ tư duy. | Có lời đọc (Voiceover) hoặc không lời, chữ viết tay xuất hiện theo nhịp vẽ. | Nhạc nền acoustic/lo-fi nhẹ nhàng, tiếng bút sột soạt, SFX pop/ding. |
| **Tái hiện sự cố, tai nạn máy bay, tội phạm công nghệ, tài liệu điều tra** (Documentary / Reconstruction) | `reconstruct` | 3D White Clay (Three.js WebGL procedural clay materials, bóng mềm DirectionalLight + Ambient), thẻ tài liệu truyền hình (`doc_ui.js`: Article sweep, quote card, stat count-up, topo map, vehicle simulation). | Có lời đọc phóng sự (Voiceover chuyên nghiệp), phụ đề footnote trích nguồn tài liệu/hồ sơ điều tra. | Nhạc phim điều tra kịch tính (tension strings, drone bass), SFX cơ khí/radar/radio intercom. |
| **Kịch bản What-If, thí nghiệm khoa học giả định, nghịch lý thời gian, tâm lý sinh học** (Cinematic Stick Figure) | `stick` | 2D Canvas người que đen viền sáng điện ảnh (rim light), 28 tư thế IK, giọt nước đóng băng thời gian, đồ thị số liệu `dataCard`, sơ đồ `blueprint`. | Có lời đọc (Voiceover), tiêu đề lớn phát sáng `titleCard`, thẻ đo đạc `readout`, huy hiệu góc `badge`. | Nhạc nền điện ảnh đa cảm xúc (dusk piano, golden orchestral, midnight synth), SFX tiếng gió giọt nước đóng băng, sấm sét. |

---

## 3. QUY TRÌNH 5 GIAI ĐOẠN CHUẨN (THE 5-PHASE PIPELINE)

Mọi video đều phải đi qua 5 giai đoạn khép kín sau:

```
[ Giai đoạn 1: Khởi tạo ] ──> [ Giai đoạn 2: Phân cảnh & Audit ] ──> [ Giai đoạn 3: Âm thanh ] ──> [ Giai đoạn 4: Render ] ──> [ Giai đoạn 5: Mastering & QC ]
  (new_project.py)               (phim.py / draft_shots.py)            (pauses.py)             (render.mjs)            (mix.py & qc_video.py)
                                 (asset_registry.py --audit)
```

### Giai đoạn 1: Khởi tạo Dự án (Ingestion & Setup)
- Tạo cấu trúc thư mục chuẩn trong `projects/<slug>/`:
  * `input/`: Chứa file thô (voice thô, bài báo, tài liệu, kịch bản gốc).
  * `story/`: Chứa kịch bản đã biên dịch (`shots.json`).
  * `scenes/`: Chứa mã nguồn JS tùy biến shot (nếu có).
  * `timeline/`: Chứa mốc thời gian lời nói (`lines.json`, `words.json`).
  * `build/`: Nơi chứa video không tiếng, file tạm, contact sheet.
  * `out/`: Nơi xuất video hoàn thiện cuối cùng.
- Tạo `config.json` mang đầy đủ thông số: tỷ lệ khung hình (`16:9` hoặc `9:16`), độ phân giải (`1080p`), FPS (`24`), pack mục tiêu (`dem`, `doodle`, `reconstruct`, `stick`), và âm lượng mục tiêu (`loudness: -14`).

### Giai đoạn 2: Phân cảnh & Kiểm toán Tài nguyên (Storyboard & Asset Audit)
- **Nếu là video không lời (Self-Improvement):**
  * Soạn thảo kịch bản chuẩn cú pháp `01-PHIM-<slug>.txt`.
  * Biên dịch sang `story/shots.json` bằng lệnh:
    ```bash
    py -X utf8 tools/phim.py --project projects/<slug> --phim input/01-PHIM-<slug>.txt --force
    ```
- **Nếu là video có lời đọc (Documentary / Explainer):**
  * Tách từ và câu qua Whisper vào `timeline/lines.json` và `timeline/words.json` bằng `tools/prep_voice.py`.
  * Tạo khung phân cảnh nhịp thở bằng `tools/draft_shots.py`.
- **Kiểm toán & Sản sinh Tài nguyên Tương thích (Asset Synthesis Gate - BẮT BUỘC):**
  * **Trích xuất Thực thể (Entity Extraction):** Khi đọc script kịch bản hoặc phân tích audio/voiceover, hệ thống tự động bóc tách danh sách toàn bộ các nhân vật (`actors`), đạo cụ (`props`), bối cảnh (`sets`), và hiệu ứng (`fx`) mà nội dung nhắc tới.
  * **Đối chiếu Thư viện (Compatibility Check):** Quét đối chiếu danh sách thực thể với từ điển `tools/asset_registry.json` và các mẫu cảnh có sẵn của Pack tương ứng.
  * **Cơ chế Tạo Asset Thiếu Trước Khi Dựng (Just-In-Time Asset Synthesis):**
    + Nếu phát hiện kịch bản yêu cầu các vật thể / bối cảnh **CHƯA CÓ ASSET TƯƠNG THÍCH TRONG THƯ VIỆN**: Tuyệt đối KHÔNG gượng ép dùng asset sai lệch và KHÔNG nhảy ngay vào render.
    + **BẮT BUỘC TẠO MỚI ASSET ĐÓ TRƯỚC:**
      - *Nếu là 2D Canvas:* Viết hàm vẽ vector mới vào `props.js`, `sets.js` hoặc file shot tương ứng.
      - *Nếu là 3D WebGL (Three.js):* Tạo hàm procedural mesh đất sét mới vào `packs/reconstruct/` (như xe cộ, khí tài, địa hình mới).
      - *Nếu là Ảnh minh họa AI:* Khởi tạo ảnh AI chất lượng cao lưu vào thư mục `anh/` của dự án, kèm file metadata `<id>.meta.json`.
    + Đăng ký tên định danh (Canonical Name) vào `tools/asset_registry.json`.
  * **Ráp Cảnh & Tiến Hành Dựng (Scene Assembly):** Chỉ khi 100% assets cần thiết đã được tạo xong và kiểm tra tương thích, mới đưa vào `story/shots.json` để chuyển sang Giai đoạn 3 và 4.

### Giai đoạn 3: Tinh chỉnh Âm thanh & Cắt khoảng lặng (Audio Polish)
- Với video có lời thoại (Voiceover):
  * Tuyệt đối không dùng file voice thô còn nhiều tiếng thở dài hoặc ngập ngừng.
  * Áp dụng bộ lọc khoảng lặng tự động `tools/pauses.py` với profile phù hợp:
    + `--profile tight`: Dành cho video ngắn (Shorts/TikTok), gọt sạch khoảng lặng $>0.35s$.
    + `--profile documentary`: Dành cho phim tài liệu, giữ khoảng ngắt nhịp kịch tính tự nhiên ($0.5s - 0.9s$).
    + `--profile gentle`: Dành cho giọng đọc thiền/tâm sự chậm rãi.

### Giai đoạn 4: Render Đồ họa (Headless Chromium Frame Capture)
- Hệ thống khởi động trình duyệt Chromium thông qua Playwright (`render.mjs`).
- Render từng khung hình chính xác đến từng micro-giây dựa trên đồng hồ thời gian nội bộ (`player.js`), không bị drop frame hay lệch sync âm thanh như phương pháp quay màn hình (Screen Recording).
- Đầu ra giai đoạn này: `build/video_silent.mp4`.

### Giai đoạn 5: Hòa âm Chuẩn Broadcast & Kiểm định Chất lượng (Mastering & QC Gate)
- **Hòa âm chuẩn Broadcast EBU R128 (`tools/mix.py`):**
  * Tự động hòa trộn đa tầng: Kênh Voice (nếu có), Kênh Music (Dynamic Synth / Ambient), Kênh SFX (âm thanh tương tác).
  * Auto-ducking: Tự động hạ âm lượng nhạc nền khi có lời đọc hoặc câu chữ quan trọng.
  * Xuất video có tiếng vào `out/<Title>.mp4` với mức âm lượng chuẩn YouTube: **-14 LUFS** và True Peak $\le -1.0$ dBFS.
- **Chốt chặn Kiểm định (`tools/qc_video.py`):**
  * Kiểm tra toàn diện file `out/<Title>.mp4`:
    1. Đo lường chính xác LUFS và True Peak.
    2. Quét phát hiện đoạn đen (Black Stretches $>0.6s$).
    3. Quét phát hiện đứng hình (Frozen Stretches $>3s$).
    4. Đo thời lượng trung bình mỗi cảnh (Median Shot Length) để đảm bảo giữ chân người xem.
    5. Kiểm tra footnote trích dẫn tài liệu với các cảnh điều tra/3D.
    6. Tạo ảnh tổng quan Contact Sheet `build/qc_sheet.jpg` (1 khung hình / 10 giây).
  * **Nếu có lỗi (Issues $>0$):** Báo cáo chi tiết và yêu cầu khắc phục trước khi giao file cho người dùng.

---

## 4. CÔNG CỤ ĐIỀU PHỐI DUY NHẤT: `tools/produce.py`

Để đảm bảo không bỏ sót bước nào trong 5 giai đoạn trên, toàn bộ quy trình được thực hiện thông qua Master CLI:

### 1. Sản xuất Trọn gói Tự động (One-Click Production):
```bash
# Cho video không lời (Self-Improvement):
py -X utf8 tools/produce.py --project projects/<slug> --pack dem --phim input/01-PHIM-<slug>.txt

# Cho video phóng sự tài liệu có voiceover (3D Reconstruction):
py -X utf8 tools/produce.py --project projects/<slug> --pack reconstruct --voice input/voice.wav --pause-profile documentary

# Cho video giải thích Whiteboard (Doodle):
py -X utf8 tools/produce.py --project projects/<slug> --pack doodle --voice input/voice.wav
```

### 2. Thực hiện Từng Giai đoạn Cụ thể (Khi Debug hoặc Tinh chỉnh):
```bash
# Chỉ biên dịch kịch bản & kiểm toán tài nguyên:
py -X utf8 tools/produce.py --project projects/<slug> --stage storyboard

# Chỉ render lại đồ họa:
py -X utf8 tools/produce.py --project projects/<slug> --stage render

# Chỉ hòa âm lại:
py -X utf8 tools/produce.py --project projects/<slug> --stage mix

# Chỉ chạy kiểm định chất lượng QC:
py -X utf8 tools/produce.py --project projects/<slug> --stage qc
```

---

## 5. BẢNG KIỂM TRA CHẤT LƯỢNG TRƯỚC KHI BÀN GIAO (PRE-DELIVERY CHECKLIST)

Trước khi gửi kết quả hoàn tất cho người dùng, AI bắt buộc phải tự tích chọn đủ các tiêu chí:

- [ ] **1. Pack Hợp Chuẩn:** Đã chọn đúng pack (`dem`, `doodle` hoặc `reconstruct`) phù hợp với nội dung kịch bản.
- [ ] **2. Asset Được Khai Báo:** Toàn bộ nhân vật, bối cảnh 3D/2D đã đăng ký trong `asset_registry.json`.
- [ ] **3. Nhịp Cắt (Pacing):** Thời lượng cảnh trung bình nằm trong khoảng $2.5s - 5.0s$ (không có cảnh đứng yên $>6s$ nếu không có hiệu ứng camera zoom/pan).
- [ ] **4. Âm Thanh -14 LUFS:** Video cuối cùng đạt chuẩn âm lượng YouTube ($-14 \pm 1.5$ LUFS).
- [ ] **5. Contact Sheet:** File `build/qc_sheet.jpg` đã được tạo ra và không có khung hình nào bị đen hoặc lỗi đồ họa.
- [ ] **6. QC Passed:** Lệnh `qc_video.py` trả về `0 issue(s)`.
