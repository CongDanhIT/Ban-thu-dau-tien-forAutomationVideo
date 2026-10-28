# 🎨 DANH MỤC CÁC GÓI PHONG CÁCH ĐỒ HỌA (PACKS DIRECTORY)
*(H2 2D Studio — Multi-Theme Visual & Narrative Packs)*

Thư mục `packs/` là **Tầng 3** trong kiến trúc của Studio, chịu trách nhiệm định nghĩa toàn bộ **ngôn ngữ thị giác, bối cảnh, đạo cụ, nhân vật và phong cách kể chuyện** cho từng kênh hoặc chủ đề nội dung cụ thể. 

Các pack hoạt động hoàn toàn độc lập với nhau nhưng dùng chung động cơ kết xuất (`engine/`) và công cụ điều phối tự động (`tools/produce.py`).

---

## 🧭 BẢNG SO SÁNH TỔNG QUAN

| Gói Phong Cách (`pack`) | Ngôn Ngữ Hình Ảnh & Công Nghệ | Chủ Đề & Ngách Nội Dung Mục Tiêu | Cơ Chế Kể Chuyện | Âm Thanh & Nhạc |
| :--- | :--- | :--- | :--- | :--- |
| **`dem`** *(Self-Improvement)* | 2D Canvas vector nét mảnh, nền tối sâu (`#08080c`), nhân vật kem sáng, quỷ cám dỗ viền neon phát sáng. | Kỷ luật, cai nghiện điện thoại, vượt cám dỗ, thức dậy 5h sáng, tâm lý tuổi trẻ, bắt đầu lại từ đầu. | **Không lời đọc (Non-verbal)**. Kể bằng phụ đề chữ trắng, chữ cám dỗ viết tay và bộ đếm `DAY N`. | Dynamic synth, ambient piano u sầu, tiếng tim đập, chuông báo thức, kính vỡ. |
| **`doodle`** *(Whiteboard / Sketch)* | 2D Canvas nét vẽ tay mộc mạc (Hand-drawn ink), nền bảng trắng hoặc giấy sáng, sơ đồ tư duy, icon giải thích. | Giải thích kiến thức, khoa học thường thức, cơ thể người, kinh tế học vi mô, tóm tắt sách, What-If. | **Có lời đọc thuyết minh (Voiceover)** hoặc chữ xuất hiện theo nhịp vẽ tay. | Nhạc lo-fi nhẹ nhàng, acoustic vui tươi, tiếng bút sột soạt trên bảng, tiếng pop/ding. |
| **`reconstruct`** *(3D Clay & Doc UI)* | 3D WebGL Three.js vật thể đất sét trắng, mannequin 23 tư thế, xe cộ, máy bay, thẻ báo chí `doc_ui`. | Tai nạn hàng không, đại án tài chính công nghệ, hồ sơ tội phạm (True Crime), thảm họa công trình, lịch sử. | **Có lời đọc phóng sự điều tra chuyên nghiệp (Voiceover)**, phụ đề footnote trích nguồn tài liệu. | Nhạc phim điều tra kịch tính (tension strings, drone bass), SFX va chạm cơ khí, còi hú, bộ đàm. |
| **`stick`** *(Cinematic 2.5D Stick Figure)* | 2D Canvas người que đen viền sáng điện ảnh (rim light), 28 tư thế IK, giọt nước đóng băng thời gian, đồ thị số liệu `dataCard`, sơ đồ `blueprint`. | Kịch bản What-If ("Điều gì xảy ra nếu..."), tâm lý học hành vi, thí nghiệm khoa học giả định, nghịch lý thời gian, giải thích cơ chế cơ thể/vật lý. | **Có lời đọc (Voiceover)** kết hợp thẻ chữ lớn phát sáng (`titleCard`), số liệu đo đạc `readout` và huy hiệu góc `badge`. | Nhạc nền điện ảnh đa cảm xúc (dusk piano, golden orchestral, midnight synth), SFX tiếng gió giọt nước đóng băng, tiếng sấm sét, tiếng tim đập. |

---

## 1. 🌑 PACK `dem`: PHIM NGẮN HOẠT HÌNH TÂM LÝ & TỰ HOÀN THIỆN
*(An Animated Short Film — Self-Improvement & Discipline Niche)*

- **Đường dẫn mã nguồn:** `packs/dem/`
- **Khởi tạo dự án:** `py tools/produce.py --project projects/<slug> --pack dem --phim input/01-PHIM-<slug>.txt`

### 1.1. Chủ đề & Kịch bản phù hợp nhất
- **Kỷ luật & Thói quen:** Thức dậy lúc 5:00 AM, tập gym kiên trì, đọc sách thay vì lướt mạng, cai nghiện mạng xã hội và dopamine ngắn hạn (Dopamine Detox / Phone Addiction).
- **Đấu tranh tâm lý giới trẻ:** Cám dỗ sắc dục (Lust vs Love), nỗi sợ thất bại, cảm giác cô độc giữa thành phố, trầm cảm tuổi 20, làm lại cuộc đời sau cú ngã.
- **Quy luật chuỗi ngày (The Streak):** Bộ đếm thời gian biểu thị sự bền bỉ: `DAY 1` -> `DAY 30`, khoảnh khắc sa ngã gạch số về `0` (`DAY 412 -> 0`), và hành trình đứng dậy.

### 1.2. Đặc trưng Thị giác (Visual Signature)
- **Tông màu:** Nền đen than chì đậm (`#08080c`) có hạt bụi trôi nhẹ trong không khí (`dust`), tạo cảm giác đêm khuya tĩnh mịch và sâu lắng.
- **Nhân vật Hero V2:** Đầu tròn màu kem (`#ece6d6`), viền mảnh thanh thoát, mặc áo hoodie xám có túi kangaroo. Biểu cảm phong phú: thức đêm mắt đỏ hoe (`bloodshot`), buồn bã, mệt mỏi, co ro trong chăn, ánh mắt kiên định bừng tỉnh.
- **Bóng đen Cám dỗ ("The Voice"):** Nhân vật quỷ bóng đen khổng lồ trùm sau lưng, phát sáng viền neon theo màu nhấn (`accent: red | pink | amber | teal`), lơ lửng thì thầm những lời dụ dỗ ngọt ngào.
- **Chữ kể chuyện (Non-verbal Typography):**
  * `> narr`: Chữ kể chuyện màu trắng thanh lịch, xuất hiện ở trên đỉnh hoặc chân khung hình.
  * `~ tempt`: Chữ cám dỗ font viết tay mềm mại (*Caveat*), uốn lượn cạnh bóng đen theo màu nhấn.
  * `! big`: Câu chốt hạ gián đoạn, chữ to in đậm giữa màn hình.
  * `@`: Giao diện tin nhắn điện thoại chat qua lại giữa đêm.

### 1.3. Bối cảnh có sẵn trong Pack (`sets`)
- `bedroom`: Phòng ngủ đêm có đồng hồ LED báo thức và lịch tháng tô ngày kỷ luật.
- `street`: Phố đêm mưa rơi cô đơn, trạm xe buýt, cửa hàng biển hiệu neon.
- `city`: Đường phố thành phố lúc tảng sáng bình minh, đàn chim bay, hiệu ứng chạy bộ cuộn nền.
- `gym`: Phòng tập thể hình, bao cát đấm bốc lắc lư, tạ đòn.
- `stairs`: Cầu thang dài vô tận biểu thị bậc thang thăng tiến hoặc vực sâu.
- `void`: Không gian tối vô định có ánh đèn rọi spotlight từ trên đỉnh đầu.

---

## 2. ✏️ PACK `doodle`: PHÁC THẢO BẢNG TRẮNG & GIẢI THÍCH KIẾN THỨC
*(Whiteboard Animation & Hand-Drawn Explainer Niche)*

- **Đường dẫn mã nguồn:** `packs/doodle/`
- **Khởi tạo dự án:** `py tools/produce.py --project projects/<slug> --pack doodle --voice input/voice.wav`

### 2.1. Chủ đề & Kịch bản phù hợp nhất
- **Giải thích khoa học & Cơ thể người:** *"Điều gì xảy ra với não bộ khi bạn thức trắng 72 giờ?"*, *"Cơ chế gây nghiện của đường và đồ ăn nhanh"*, *"Tại sao chúng ta lại nằm mơ?"*.
- **Kinh tế học, Kinh doanh & Tư duy:** Tóm tắt sách kinh điển (*Atomic Habits*, *Tâm lý học về tiền*), các nghịch lý kinh tế vi mô, quy luật 80/20.
- **What-If (Giả định thú vị):** *"Nếu Trái Đất đột ngột ngừng quay 5 giây?"*, *"Nếu tất cả con người trên Trái Đất biến mất?"*.

### 2.2. Đặc trưng Thị giác (Visual Signature)
- **Tông màu:** Nền giấy phác thảo sáng tự nhiên (`#f6f5f0`) hoặc bảng trắng học đường, tạo cảm giác thân thiện, dễ tiếp thu và kích thích trí tò mò.
- **Nét vẽ tay (Hand-Drawn Vector Ink):** Nét mực gợn nhẹ có độ rung tự nhiên (Wobble lines) như được vẽ bằng bút dạ hoặc bút chì kim.
- **Biểu tượng & Sơ đồ tư duy:** Mũi tên chỉ dẫn, hộp đóng khung highlight, sơ đồ nhánh, đồ thị hình cột/đường tăng giảm đơn giản.
- **Hình tượng người que tối giản:** Nhân vật người que ngộ nghĩnh với các biểu cảm phóng đại hài hước (bối rối gãi đầu, bóng đèn ý tưởng lóe sáng trên đỉnh đầu, vấp ngã).

### 2.3. Âm thanh Đặc trưng
- Nhạc nền acoustic guitar, ukulele hoặc marimba nhẹ nhàng, vui tươi, mang tính khám phá (`curious`, `wonder`).
- SFX: Tiếng bút dạ vẽ sột soạt trên bảng, tiếng lật trang sổ, tiếng `pop`, `ding`, `chime` khi giải thích xong một luận điểm.

---

## 3. ✈️ PACK `reconstruct`: TÁI HIỆN HIỆN TRƯỜNG & PHÓNG SỰ ĐIỀU TRA
*(3D Simulation & Forensic Documentary — "What Really Happened" Niche)*

- **Đường dẫn mã nguồn:** `packs/reconstruct/`
- **Khởi tạo dự án:** `py tools/produce.py --project projects/<slug> --pack reconstruct --voice input/voice.wav`

### 3.1. Chủ đề & Kịch bản phù hợp nhất
- **Hàng không & Giao thông:** Tái hiện sự cố tai nạn máy bay rơi, mất áp suất buồng lái, máy bay mất tích bí ẩn, tàu hỏa trật bánh, đâm va giao thông liên hoàn.
- **Đại án Kinh tế, Tài chính & Tội phạm Công nghệ:** Vụ sụp đổ của sàn tiền ảo FTX, gian lận công nghệ y tế Theranos, bê bối Enron, lừa đảo đa cấp nghìn tỷ.
- **Hồ sơ Vụ án & Tội phạm có thật (True Crime / Heist):** Vụ cướp ngân hàng thế kỷ, giải mã sơ đồ hiện trường, hành trình tẩu thoát theo định vị GPS, phân tích camera an ninh.
- **Thảm họa Cơ khí & Công trình Xây dựng:** Sập cầu dây văng, đứt cáp tàu lượn siêu tốc công viên giải trí, thảm họa hạt nhân Chernobyl, nổ giàn khoan dầu ngoài khơi.
- **Lịch sử Quân sự & Địa chính trị:** Tái hiện các chiến dịch không kích, khủng hoảng tên lửa, hành trình tàu ngầm hạt nhân.

### 3.2. Đặc trưng Thị giác (Visual Signature)
- **Đồ họa 3D Đất sét Trắng (White Clay WebGL):** Mô hình không gian 3 chiều dựng bằng Three.js với bề mặt đất sét trắng tối giản, bóng mềm chân thực, loại bỏ chi tiết rườm rà để người xem tập trung 100% vào cơ chế chuyển động và sự cố.
- **Phương tiện & Máy bay 3D:**
  * `cockpit`: Buồng lái Boeing với bảng đồng hồ điều khiển và cần lái.
  * `cabin`: Khoang hành khách có thể cắt lớp trần (`cutaway`).
  * `airliner`: Ngoại cảnh máy bay dân dụng bay qua mây trời.
  * `sedan`, `suv`, `truck`, `trainCar`: Xe hơi, xe tải và toa tàu hỏa.
- **Công trình & Cơ khí 3D:**
  * `rollerCoaster`: Đường ray tàu lượn siêu tốc và trụ đỡ.
  * `crane`, `tower`, `cable`: Cần cẩu, tháp kết cấu thép và dây cáp chịu tải.
- **Hình nộm Mannequin 3D:** Người mẫu đất sét 23 tư thế (phi công cầm lái, hành khách ngồi, nhân chứng chỉ tay, kỹ sư kiểm tra).
- **Bản đồ Địa lý 3D (`maps.js`):** Nạp dữ liệu bản đồ TopoJSON chiếu đường bay GPS 3D và địa hình đồi núi thực tế.
- **Bộ thẻ Đồ họa Báo chí Truyền hình (`doc_ui.js`):**
  * `article`: Thẻ bài báo có vệt quét bút dạ quang highlight bằng chứng (`highlighter sweep`).
  * `quote`: Thẻ trích dẫn lời khai nhân chứng hoặc ghi âm hộp đen buồng lái (CVR).
  * `stat`: Thẻ số liệu đo đạc nhảy đếm số tức thì (`stat count-up` độ cao, vận tốc, số tiền thiệt hại).
  * `compare`: Thẻ so sánh đối chiếu trước và sau sự cố.

### 3.3. Đa dạng Bộ lọc Màu sắc (`looks.js`)
- `clay`: Đất sét trắng studio tối giản (mặc định).
- `day`: Ánh sáng ban ngày tự nhiên, mây trời và sương mù.
- `dusk`: Hoàng hôn u buồn, nắng xiên vàng cam đổ bóng dài.
- `night`: Đêm tối spotlight rọi vào hiện trường.
- `blueprint`: Bản vẽ kỹ thuật CAD (nền xanh navy, nét line phát sáng cyan).
- `radar`: Màn hình radar kiểm soát không lưu (quét xanh lá).
- `thermal`: Giả lập ảnh nhiệt FLIR quân sự.

### 3.4. Âm thanh Đặc trưng
- Nhạc nền điều tra kịch tính (Tension strings, drone bass dồn dập, ambient u tối).
- SFX sóng âm vật lý: Tiếng va đập nổ bom (`impact`), tiếng rít căng thẳng trước cú cắt (`riser`), còi hú cảnh báo buồng lái (`alarm_beep`), tiếng bộ đàm phi công (`radio_click`).

---

## 4. 🏃 PACK `stick`: HOẠT HÌNH NGƯỜI QUE 2.5D ĐIỆN ẢNH & WHAT-IF KHOA HỌC
*(Cinematic Stick Figure & Scientific Explainer Studio — "What-If" Niche)*

- **Đường dẫn mã nguồn:** `packs/stick/`
- **Khởi tạo dự án:** `py tools/produce.py --project projects/<slug> --pack stick --voice input/voice.wav`

### 4.1. Chủ đề & Kịch bản phù hợp nhất
- **What-If (Giả định quy mô thế giới & con người):** *"Điều gì xảy ra nếu thời gian ngừng trôi 1 ngày?"*, *"Nếu phản xạ con người nhanh gấp 10 lần?"*, *"Nếu trọng lực Trái Đất đột ngột biến mất?"*, *"Nếu con người chỉ ngủ 1 tiếng mỗi đêm?"*.
- **Tâm lý học hành vi & Khoa học não bộ:** Cơ chế hoạt động của Dopamine, hiện tượng Dejavu, phản xạ chiến-hay-biến (Fight-or-Flight), cơ chế ghi nhớ của bán cầu não.
- **Thí nghiệm Vật lý & Giới hạn sinh học:** Vận tốc ánh sáng, áp suất đáy biển, sức chịu đựng của cơ bắp khi nâng vật nặng quá tải.

### 4.2. Đặc trưng Thị giác (Visual Signature)
- **Tỉ lệ khung hình điện ảnh 2:1 (`bars: 'cinematic'`):** Dải đen letterbox trên dưới chuẩn phim chiếu rạp kết hợp hạt phim hữu cơ (`grain`) và độ mờ góc tối (`vignette`).
- **Khung xương Người Que 28 Tư Thế (`rig2d.js`):**
  * Động học nghịch **IK (Inverse Kinematics)** tự động tính toán góc gập cùi chỏ và khớp gối, chuyển động tự nhiên không bị gãy khúc.
  * Chu kỳ bước đi/chạy bộ `walkPose()` nhịp nhàng theo tần số bước chân và độ lắc hông.
  * Hơi thở nhấp nhô `breathe()` giữ cho nhân vật luôn sống động ngay cả khi đứng yên.
  * 18 biểu cảm khuôn mặt phong phú (`neutral`, `shocked`, `worried`, `thinking`, `happy`, `angry`, `cry` với giọt nước mắt lăn dài...).
  * Hệ thống trang phục đa vai trò: Áo hoodie có nón, áo thun thể thao, áo blouse trắng nhà khoa học (`labcoat`), com-lê thám tử (`suit`), kính cận (`glasses`), mũ len (`beanie`), mũ lưỡi trai (`cap`).
- **Khoảnh khắc Đóng băng Thời gian (Time-Stop FX):**
  * Hàng trăm giọt nước lơ lửng giữa không trung (`FX.drops`), hạt bụi phát sáng chuyển động siêu chậm (`FX.dust`), tạo hiệu ứng ngưng đọng thời gian cực kỳ choáng ngợp.
- **Đồ họa Kỹ thuật & Thẻ Dữ liệu (`ui2d.js`):**
  * `titleCard`: Tiêu đề lớn 2 dòng phát sáng viền cam/vàng trên nền trời hoàng hôn.
  * `dataCard`: Thẻ chỉ số khoa học nhảy số counter kèm đường cong đồ thị vẽ trực tiếp.
  * `compareBars`: Thanh so sánh 2 chỉ số thực tế vs giả định.
  * `blueprint`: Bản vẽ sơ đồ giải phẫu nguyên lý nền xanh kỹ thuật.
  * `dimension`: Thước đo khoảng cách với mũi tên chỉ điểm chính xác.

### 4.3. Đa dạng Mood Màu sắc (`styles.js`)
- `dusk`: Hoàng hôn tím hoa cà huyền bí, nắng vàng cam amber đổ nghiêng (mặc định).
- `midnight`: Đêm xanh thẳm, viền sáng trắng xanh sắc lạnh, đèn đường cam sodium.
- `golden`: Giờ vàng rực rỡ, ánh nắng chói chang, ấm áp giàu năng lượng.
- `neon`: Đêm cyberpunk neon tím - xanh ngọc tương phản cao, vệt sáng rực rỡ.
- `storybook`: Tông màu phấn pastel nhẹ nhàng, dịu mắt, ấm áp gia đình.

---

---

## 5. ⚡ BỘ QUY TẮC TƯƠNG PHẢN CAO & KIỂM SOÁT THỊ GIÁC (HIGH CONTRAST & VISUAL INTEGRITY)
*(Áp dụng bắt buộc cho toàn bộ các Pack và Dự án video từ 2026 trở đi)*

Mục tiêu: Đảm bảo mọi cảnh quay khi hiển thị trên màn hình điện thoại thu nhỏ, màn hình OLED độ sáng thấp, hoặc lướt nhanh trên YouTube Shorts/Feed đều **rõ nét 100%, không bị chìm hình, mất đầu, lem màu hoặc chữ bé lí tí**.

### 5.1. Quy tắc Tách Nhân vật Khỏi Phông nền (Character Separation & Anti-Invisible Head)
1. **Tuyệt đối chống "Mất đầu trên nền tối" (No Dark Head on Dark Backdrop):**
   - Người que / Nhân vật có đầu màu mực tối (`ink`: `#0c0a10` / `#0e0b12`) khi đứng trên nền tối (Night, Blueprint, Void, Storm) **bắt buộc phải có viền sáng Rim Light toàn diện (`rim: { color, w: 4.5..6.0 }`)** hoặc quầng sáng Spotlight phía sau.
   - Khi nhân vật mặc trang phục sáng màu (như áo labcoat trắng, suit xám), đầu trần màu đen dễ bị ảo giác "mất đầu / áo bay". **Bắt buộc định hình vùng đầu** bằng tóc sáng (`head: 'curly'`, `headColor: '#f1f5f9'`), mũ sáng, kính nổi bật hoặc viền rim dày bọc quanh đầu.
2. **Khuôn mặt & Biểu cảm (Eyes & Mouth):**
   - Mắt và miệng phải luôn sử dụng màu sáng có độ tương phản cao (`#ffffff`, `#fff1dc`, hoặc vàng neon), không bao giờ để rỗng hoặc thừa hưởng màu tối của nền hoặc màu áo.
3. **Tư thế tự nhiên & Động học IK:**
   - Khi thể hiện trạng thái đóng băng hoặc đứng yên, không dùng các tư thế co gập dị dạng (`POSES.ready`). Luôn dùng tư thế có chân trụ vững chãi (`walkPose` dở dang, `POSES.stand`, `POSES.think`, `POSES.shocked`).

### 5.2. Quy tắc Chữ & Giao diện Đồ họa (Typography & UI Contrast)
1. **Tiêu đề chính (Title Cards & Big Lines):**
   - Tuyệt đối không dùng màu xanh lam tối hay xám chìm vào nền.
   - Bắt buộc dùng màu trắng sáng `#ffffff` hoặc vàng ánh kim `#ffc83d`, luôn kèm hiệu ứng phát sáng neon (`glow: 20-30`, `glowColor`) để nổi bật ngay cả khi video xem ở chế độ thu nhỏ.
2. **Bong bóng thoại & Câu hỏi (Speech Bubbles):**
   - **Tỷ lệ & Khoảng thở (Breathing Room):** Kích thước bong bóng phải đủ lớn (`w >= 840px`, `h >= 100px` cho câu trên 20 ký tự). Khoảng cách giữa đỉnh đầu nhân vật và bong bóng tối thiểu 120px – tuyệt đối không để đuôi nhọn đâm thẳng vào đỉnh đầu.
   - **Độ đậm & Kích thước font:** Chữ trong bong bóng phải đạt tối thiểu `size: 40px - 48px`, in hoa đậm (`font: FONTS.ui, weight: 900`), màu tối than `#140e1b` trên nền kem sáng `#fffbf2`.
3. **Huy hiệu góc & Đo đạc (Badges & Metrics):**
   - Sử dụng màu neon tương phản mạnh: Vàng chanh neon (`#ffe066`), Cyan băng tuyết (`#00e5ff`), Đỏ san hô (`#ff5c5c`), cỡ chữ tối thiểu 36px.

### 5.3. Quy tắc Cân đối Bố cục Đa khối (Layout Balance & Timing)
1. **Tránh "Lệch Khung Hình" (No Asymmetrical Blank Space):**
   - Khi thiết kế các cụm thông tin đa cột (như 3 hộp cơ chế, 2 thẻ so sánh), thời gian xuất hiện của các khối phải đồng bộ trong 0.5s - 0.8s đầu của cảnh.
   - Tuyệt đối không để một bên màn hình trống hoác trong nhiều giây trong khi nửa bên kia đã hiển thị, gây cảm giác video bị lỗi render.

---

## 6. QUY TẮC MỞ RỘNG PACK MỚI TRONG TƯƠNG LAI

Nếu bạn muốn tạo thêm một phong cách hoàn toàn mới (ví dụ `packs/anime/`, `packs/pixel/`, hoặc `packs/isometric/`):

1. **Khởi tạo thư mục:** Tạo `packs/<ten_pack_moi>/`.
2. **Khai báo tối thiểu 3 file:**
   - `pack.js`: Điểm vào chính, nạp font chữ và export hàm `init(E)`.
   - `templates.js`: Định nghĩa các mẫu cảnh (`registerTemplate`).
   - `manifest.json`: Khai báo metadata và danh mục sets/props.
3. **Đăng ký vào [MASTER_SOP.md](file:///d:/project%20workspace/ContentYTBapp/MASTER_SOP.md):** Khai báo tên pack và cập nhật cờ `--pack <ten_pack_moi>` cho Master CLI `tools/produce.py`.

