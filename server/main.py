from google.cloud import bigquery
from google.oauth2 import service_account
from fastapi import FastAPI, Request, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
import whisper
import tempfile

app = FastAPI()

origins = [
    "https://donald-transcription.uk.r.appspot.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post('/transcribe')
async def Transcribe(request: Request):

    request_forms_list = await request.form()
    form = request_forms_list.getlist('File')[0]
    file_contents = form.file

    fd, path = tempfile.mkstemp()

    with os.fdopen(fd, 'wb') as fp:
        file_contents.seek(0)
        fp.write(file_contents.read())


    model = whisper.load_model("base")
    result = model.transcribe(path)
    transcription = result["text"]

    os.unlink(path)

    return transcription



    

    
    











































