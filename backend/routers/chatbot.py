# backend/routers/chatbot.py

from fastapi import APIRouter, File, Form, UploadFile
from pydantic import BaseModel
import os, requests, base64, tempfile, pyttsx3, time, pathlib

router = APIRouter()

# Environment variables
ASSEMBLY_API_KEY = os.getenv("ASSEMBLY_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

class ChatRequest(BaseModel):
    text: str

def format_prompt(user_prompt: str) -> str:
    return f"""You are a legal advisor for Indian women. Answer the following question for Indian citizens(women) using simple language.The answers need to be from Indian Penal Code and Indian Laws.

Respond with:
- Short introductory paragraph (if necessary)
- Then clearly formatted numbered points (1., 2., 3.) for each key detail.
- Avoid using asterisks(*).
- Keep it concise, helpful, and factually accurate.

Question: {user_prompt}

Make sure the answer is correct and easy to understand."""



def call_openrouter(prompt: str) -> str:
    try:
        formatted_prompt = format_prompt(prompt)
        print("📡 Sending request to OpenRouter...")

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "mistralai/mistral-7b-instruct",  # ✅ free model
                "messages": [{"role": "user", "content": formatted_prompt}],
                "max_tokens": 512,
                "temperature": 0.7
            }
        )
        response.raise_for_status()
        data = response.json()
        if "choices" not in data:
            print("⚠️ OpenRouter response missing 'choices':", data)
            raise Exception("No choices returned")

        print("✅ OpenRouter response received")
        return data["choices"][0]["message"]["content"]

    except Exception as e:
        print(f"OpenRouter failed: {e}")
        print("🔁 Switching to local TinyLlama fallback...")
        return call_tinyllama(prompt)


def call_tinyllama(prompt: str) -> str:
    try:
        formatted_prompt = format_prompt(prompt)
        print("🤖 Querying local TinyLlama via Ollama...")

        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "tinyllama",
                "prompt": formatted_prompt,
                "stream": False,
                "num_predict": 2048
            }
        )
        response.raise_for_status()
        print("✅ TinyLlama responded")
        return response.json().get("response", "TinyLlama gave no response.")
    except Exception as e:
        print(f"TinyLlama fallback failed: {e}")
        return "Sorry, the AI service is currently unavailable."

def transcribe_audio(file: UploadFile) -> str:
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp:
            temp.write(file.file.read())
            wav_path = temp.name

        headers = {
            "authorization": ASSEMBLY_API_KEY,
            "content-type": "application/octet-stream"
        }

        with open(wav_path, 'rb') as audio_file:
            upload_response = requests.post(
                "https://api.assemblyai.com/v2/upload",
                headers=headers,
                data=audio_file
            )

        upload_url = upload_response.json().get("upload_url")
        if not upload_url:
            raise Exception("Upload URL not received")

        transcript_response = requests.post(
            "https://api.assemblyai.com/v2/transcript",
            headers={"authorization": ASSEMBLY_API_KEY},
            json={"audio_url": upload_url}
        )
        transcript_response.raise_for_status()
        transcript_id = transcript_response.json()["id"]

        polling_url = f"https://api.assemblyai.com/v2/transcript/{transcript_id}"
        while True:
            polling_res = requests.get(polling_url, headers={"authorization": ASSEMBLY_API_KEY})
            polling_data = polling_res.json()
            if polling_data["status"] == "completed":
                return polling_data.get("text", "")
            elif polling_data["status"] == "error":
                raise Exception(f"Transcription error: {polling_data.get('error')}")
            time.sleep(1)
    except Exception as e:
        print(f"Transcription failed: {e}")
        return ""

def generate_audio(text: str) -> tuple[str, str]:
    audio_base64 = ""
    try:
        tts_payload = {
            "text": text,
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        }
        tts_headers = {
            "xi-api-key": ELEVENLABS_API_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg"
        }

        tts_res = requests.post(
            f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}",
            headers=tts_headers,
            json=tts_payload
        )

        if tts_res.status_code == 200 and tts_res.content:
            print("🔊 ElevenLabs TTS success")
            audio_base64 = base64.b64encode(tts_res.content).decode("utf-8")
            return audio_base64, "audio/mpeg"
        else:
            print("⚠️ ElevenLabs TTS failed:", tts_res.status_code, tts_res.text)

    except Exception as tts_err:
        print("⚠️ ElevenLabs Exception:", tts_err)

    return fallback_tts(text)

def fallback_tts(text: str) -> tuple[str, str]:
    try:
        print("🎙️ Using pyttsx3 TTS fallback...")
        engine = pyttsx3.init()
        voices = engine.getProperty('voices')
        zira_voice = next((v for v in voices if "zira" in v.name.lower()), None)
        if zira_voice:
            engine.setProperty('voice', zira_voice.id)

        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tf:
            temp_path = pathlib.Path(tf.name)
            temp_filename = str(temp_path)

        engine.save_to_file(text, temp_filename)
        engine.runAndWait()

        time.sleep(0.5)
        if not temp_path.exists() or temp_path.stat().st_size == 0:
            raise Exception("Fallback TTS file was empty")

        with open(temp_filename, "rb") as f:
            fallback_audio = f.read()
            if not fallback_audio:
                raise Exception("Read empty fallback audio file")
            audio_base64 = base64.b64encode(fallback_audio).decode("utf-8")

        print("✅ Fallback TTS used. Audio length:", len(audio_base64))
        temp_path.unlink()

        return audio_base64, "audio/wav"

    except Exception as fallback_err:
        print("❌ Fallback TTS failed:", fallback_err)
        return "", ""

@router.post("/chat")
async def chat_endpoint(file: UploadFile = File(None), text: str = Form(None)):
    user_text = text or transcribe_audio(file)
    if not user_text.strip():
        return {"error": "Empty input"}

    ai_text = call_openrouter(user_text)
    ai_text = "Certainly. " + ai_text.strip()
    audio_base64, audio_mime = generate_audio(ai_text)

    return {
        "user_text": user_text,
        "ai_text": ai_text,
        "audio_base64": audio_base64,
        "audio_mime": audio_mime
    }
