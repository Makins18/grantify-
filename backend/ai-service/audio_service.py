import os
import time
from gtts import gTTS
from mutagen.mp3 import MP3
import json
import logging
import uuid

logger = logging.getLogger("AudioService")

class AudioService:
    def __init__(self, output_dir="public/audio"):
        self.output_dir = output_dir
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)

    def generate_audio_and_lyrics(self, text: str):
        """
        Generates an MP3 file and a JSON map of word-level timestamps.
        """
        file_id = str(uuid.uuid4())
        audio_path = os.path.join(self.output_dir, f"{file_id}.mp3")
        lyrics_path = os.path.join(self.output_dir, f"{file_id}.json")

        # 1. Generate Audio
        tts = gTTS(text=text, lang='en')
        tts.save(audio_path)

        # 2. Get Audio Duration
        audio = MP3(audio_path)
        duration = audio.info.length

        # 3. Generate Heuristic Timestamps (Lyrics)
        # We distribute the total duration across all words based on their length
        words = text.split()
        total_chars = sum(len(w) for w in words)
        
        lyrics = []
        current_time = 0.0
        
        for word in words:
            word_duration = (len(word) / total_chars) * duration
            lyrics.append({
                "word": word,
                "start": round(current_time, 2),
                "end": round(current_time + word_duration, 2)
            })
            current_time += word_duration

        # 4. Save Lyrics
        with open(lyrics_path, 'w') as f:
            json.dump(lyrics, f)

        return {
            "audio_url": f"/audio/{file_id}.mp3",
            "lyrics": lyrics,
            "duration": duration
        }
