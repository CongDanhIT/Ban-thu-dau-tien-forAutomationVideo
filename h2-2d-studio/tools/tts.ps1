param([string]$text, [string]$out)
Add-Type -AssemblyName System.Speech
$synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
$synth.SetOutputToWaveFile($out)
$synth.Speak($text)
$synth.Dispose()
