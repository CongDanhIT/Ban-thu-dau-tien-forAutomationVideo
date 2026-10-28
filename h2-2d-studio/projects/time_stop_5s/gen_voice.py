import subprocess, os, json
import soundfile as sf
import numpy as np

proj = 'd:/project workspace/ContentYTBapp/h2-2d-studio/projects/time_stop_5s'
tl_dir = os.path.join(proj, 'timeline')
os.makedirs(tl_dir, exist_ok=True)

script = [
    ('s001', 'What if time completely froze for exactly five seconds?'),
    ('s002', 'Instantly, every moving object locks in place. Raindrops hang in mid air like glass crystals.'),
    ('s003', 'Photons stop traveling, while air molecules freeze into impenetrable walls.'),
    ('s004', 'Your consciousness continues, but outside, absolute zero and total silence take over.'),
    ('s005', 'Then reality snaps back with a violent shockwave. What would you do in those five seconds?')
]

tmp_wavs = []
for i, (sid, text) in enumerate(script):
    out_wav = f'{tl_dir}/part_{i}.wav'
    cmd = ['powershell', '-ExecutionPolicy', 'Bypass', '-File', 'd:/project workspace/ContentYTBapp/h2-2d-studio/tools/tts.ps1', '-text', text, '-out', out_wav]
    subprocess.run(cmd, check=True)
    tmp_wavs.append(out_wav)

target_sr = 44100
final_audio = np.zeros(int(30.0 * target_sr), dtype=np.float32)

lines_json = []
words_json = []
cue_points = [0.5, 5.2, 11.5, 17.5, 23.5]

for i, (sid, text) in enumerate(script):
    data, sr = sf.read(tmp_wavs[i])
    if len(data.shape) > 1:
        data = data.mean(axis=1)
    
    if sr != target_sr:
        from scipy.signal import resample
        num_samples = int(len(data) * target_sr / sr)
        data = resample(data, num_samples)
    
    dur = len(data) / target_sr
    start_time = cue_points[i]
    end_time = start_time + dur
    
    start_sample = int(start_time * target_sr)
    end_sample = min(start_sample + len(data), len(final_audio))
    actual_len = end_sample - start_sample
    final_audio[start_sample:end_sample] += data[:actual_len] * 0.95
    
    lines_json.append({
        'id': sid,
        'start': round(start_time, 2),
        'end': round(end_time, 2),
        'text': text
    })
    
    tokens = text.split()
    token_dur = dur / len(tokens)
    for j, tok in enumerate(tokens):
        w_start = start_time + j * token_dur
        w_end = w_start + token_dur * 0.9
        words_json.append({
            'word': tok.strip('.,?'),
            'start': round(w_start, 2),
            'end': round(w_end, 2)
        })
    
    if os.path.exists(tmp_wavs[i]):
        os.remove(tmp_wavs[i])

voice_path = os.path.join(tl_dir, 'voice.wav')
sf.write(voice_path, final_audio, target_sr)

with open(os.path.join(tl_dir, 'lines.json'), 'w', encoding='utf-8') as f:
    json.dump(lines_json, f, indent=2)

with open(os.path.join(tl_dir, 'words.json'), 'w', encoding='utf-8') as f:
    json.dump(words_json, f, indent=2)

print('Voice and timeline generated successfully! Total duration: 30.0s')
for line in lines_json:
    print(line['id'], ':', line['start'], '->', line['end'], '|', line['text'])
