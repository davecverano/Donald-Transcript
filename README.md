# Audio Transcriber

A web app that turns audio and video recordings into downloadable text transcripts using [OpenAI Whisper](https://github.com/openai/whisper). Upload a file, wait while the server transcribes it, then download the transcript as a `.txt` file.

## How it works

```
React frontend (App Engine standard) ──POST /transcribe──▶ FastAPI + Whisper (App Engine flex, Docker)
                                                              │  ffmpeg decodes the upload
                                                              └─ Whisper "base" model returns the text
```

- The Whisper model is loaded once when the server starts, so each request only pays for transcription.
- A 15-minute recording takes up to ~5 minutes on a single CPU, so the server runs with a 30-minute request timeout.

## Project layout

```
src/            React app (upload form, progress state, transcript download)
server/
  main.py       FastAPI app with the /transcribe endpoint
  Dockerfile    Python 3.10 + ffmpeg image
  app.yaml      App Engine flexible config (6 GB RAM for the model)
app.yaml        App Engine standard config for the static frontend
```

## Running locally

### Backend

Requires Python 3.9+ and [ffmpeg](https://ffmpeg.org/download.html) on your PATH.

```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Set `WHISPER_MODEL` to use a different model size (`tiny`, `small`, `medium`…) and `ALLOWED_ORIGINS` to a comma-separated list of frontend URLs.

### Frontend

```bash
npm install
echo REACT_APP_API_URL=http://localhost:8000 > .env.local
npm start
```

### Tests

```bash
npm test
```

## Deployment

```bash
npm run build && gcloud app deploy          # frontend
cd server && gcloud app deploy              # API (custom runtime, flex)
```

## Tech stack

React 18 · Axios · FastAPI · OpenAI Whisper · ffmpeg · Docker · Google App Engine
