import axios from 'axios'
import { useState } from 'react'
import loadingGif from './resources/loading.gif'

// Transcription API; override with REACT_APP_API_URL in a .env file for local development.
const API_URL = process.env.REACT_APP_API_URL || 'https://server-dot-donald-transcription.uk.r.appspot.com'

const Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [transcript, setTranscript] = useState(null)
    const [error, setError] = useState(null)

    const handleSubmission = async (e) => {
        e.preventDefault()
        if (!selectedFile) {
            setError('Choose an audio or video file first.')
            return
        }
        setError(null)
        setTranscript(null)
        setLoading(true)
        const formData = new FormData()
        formData.append('File', selectedFile)
        try {
            const response = await axios.post(`${API_URL}/transcribe`, formData)
            setTranscript(response.data)
        } catch (err) {
            setError('Transcription failed. Please try again.')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const downloadTxtFile = () => {
        const element = document.createElement('a')
        element.href = URL.createObjectURL(new Blob([transcript], { type: 'text/plain' }))
        const base = selectedFile ? selectedFile.name.replace(/\.[^.]+$/, '') : 'transcript'
        element.download = `${base}.txt`
        document.body.appendChild(element)
        element.click()
        element.remove()
    }

    return (
        <div>
            <h1>Audio Transcriber</h1>
            <p>Upload an audio or video file and get a text transcript you can download.</p>

            {loading &&
                <div>
                    <img src={loadingGif} alt="loading..." />
                    <p>Transcribing… a 15-minute recording can take up to 5 minutes.</p>
                </div>}

            {error && <p role="alert">{error}</p>}

            {transcript && !loading &&
                <div>
                    <p>Done! Your transcript is ready.</p>
                    <button onClick={downloadTxtFile}>Download .txt</button>
                    <p>You can also transcribe another file.</p>
                </div>}

            <form onSubmit={handleSubmission}>
                <input type="file" name="file" accept="audio/*,video/*"
                       onChange={(e) => setSelectedFile(e.target.files[0])} />
                <div>
                    <button type="submit" disabled={loading}>Transcribe</button>
                </div>
            </form>
        </div>
    )
}

export default Upload
