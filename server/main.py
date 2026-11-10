"""Transcription API: accepts an audio/video upload and returns the text, using OpenAI Whisper."""
import os
import tempfile

import whisper
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

MODEL_NAME = os.getenv("WHISPER_MODEL", "base")
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "https://donald-transcription.uk.r.appspot.com,http://localhost:3000"
).split(",")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Loading the model takes several seconds, so do it once at startup rather than per request.
model = whisper.load_model(MODEL_NAME)


@app.post("/transcribe")
async def transcribe(request: Request):
    form = await request.form()
    uploads = form.getlist("File")
    if not uploads:
        raise HTTPException(status_code=400, detail="No file uploaded (expected form field 'File')")
    upload = uploads[0]

    suffix = os.path.splitext(upload.filename or "")[1]
    fd, path = tempfile.mkstemp(suffix=suffix)
    try:
        with os.fdopen(fd, "wb") as fp:
            fp.write(await upload.read())
        return model.transcribe(path)["text"]
    finally:
        os.unlink(path)
