#!/bin/zsh
# Transcribe a voice with word timestamps for align.py: whisper large-v3-turbo, Chinese. Conditioning on the
# previous text is off and the temperature fixed at 0: with them on, whisper falls into loops (one line repeated
# for minutes) and times that run backwards.
#   tools/video/transcribe.sh out/video/<slug>/voice.mp3 ["a hint: names and terms in the script"]
# writes voice.json next to the audio (about 1.3× the audio's length on this Mac).
set -e
audio=${1:?usage: transcribe.sh <audio> [initial prompt]}
dir=${audio:h}
WHISPER=${WHISPER:-/opt/homebrew/bin/whisper}
hint=(); [[ -n $2 ]] && hint=(--initial_prompt "$2")
"$WHISPER" "$audio" --model large-v3-turbo --language zh --word_timestamps True \
  --condition_on_previous_text False --temperature 0 --output_format json --output_dir "$dir" "${hint[@]}"
ls -la "${audio:r}.json"
