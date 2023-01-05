import axios from 'axios'
import { useState, useRef } from 'react'
import loading_Gif from './resources/loading.gif'

const Upload = () => {

    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [loading,setLoading] = useState(false)
	const [download, setDownload] = useState(null)
    

    const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

	const handleSubmission = async (e) => {
		e.preventDefault()
        setLoading(true) 
		const formData = new FormData();
		formData.append('File', selectedFile);

		await axios.post('http://localhost:8000/transcribe', formData)
			.then((response) => setDownload(response.data))
        setLoading(false)
	};

	const downloadTxtFile = () => {
		const element = document.createElement("a");
		const file = new Blob([download], {type: 'text/plain'});
		element.href = URL.createObjectURL(file);
		element.download = "myFile.txt";
		document.body.appendChild(element); 
		element.click();
	  }

    
    return ( 
        <div>
            <h1>Donald's Personal Website by Dave!</h1>
            <p>Upload a file and I will transcribe the audio file for you. You can then download the file.</p>
            {
                loading ? 
                <div>
                    <img src={loading_Gif} alt="loading..." />
                    <p>It is transcribing. It may take up to 5 minutes for 15 minute long audio files.</p>
                </div>
                : null
            }

			{
                download && !loading ? 
                <div>
					<p>I finished transcribing. You can download the file now.</p>
					<button onClick={downloadTxtFile}>Download txt</button>
					<p>You can also trascribe something else.</p>
      			</div>
                : null
            }

        <div>
			<input type="file" name="file" onChange={changeHandler} />
			<div>
				<button onClick={handleSubmission}>Submit</button>
			</div>
		</div>

        </div>
     );
}
 
export default Upload;