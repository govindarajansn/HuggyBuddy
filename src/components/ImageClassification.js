import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { headerParameters } from './InitObjects';
import Loading from './Loading';
import Error from './Error';
import '../css/tasks.css';

const ImageClassification = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [result, setResult] = useState(<span className='fill-mask'>Results</span>);
    const [image, setImage] = useState('');
    const [imageURL, setImageUrl] = useState('');

    useEffect(() => {
        const imageUrl2 = async() => {
            try{
                let imgUrl = 'https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1768&q=80';
                const imgResponse = await fetch(imgUrl);
                setImageUrl(imgUrl)
                const imgBuffer = await imgResponse.arrayBuffer();
                const buffer = Buffer.from(imgBuffer);
                setImage(buffer);
            }
            catch(err){
                setImageUrl('');
                setImage('');
            }
        }
        imageUrl2()
    }, [])
    const clear = () => {
        setResult(<span className='fill-mask'>Results</span>);
        setImage('');
        setImageUrl('');
    }

    const setPic = async(event) => {
        const [file] = event.target.files;
        if (file) {
            setLoading(true);
            setImageUrl('');
            setImage('');
            setImageUrl(URL.createObjectURL(file));
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = () => {
                const buffer = Buffer.from(reader.result);
                setImage(buffer);
                setLoading(false);
            }
        }
    }

    const imageUrl = async() => {
        let imgUrl = prompt('Please paste the image URL here');
        try{
            const imgResponse = await fetch(imgUrl);
            const imgResponse2 = imgResponse.clone();
            const imgResponse3 = imgResponse.clone();

            const imgBuffer = await imgResponse3.arrayBuffer();
            const buffer = Buffer.from(imgBuffer);
            setImage(buffer);
            
            const imgBlob = await imgResponse2.blob();
            setImageUrl(URL.createObjectURL(imgBlob));
        }
        catch(err){
            setImageUrl('');
            setImage('');
            setError(true);
            setErrorText("Unable to extract picture from this link. Download this picture and upload it using Upload File button");
            return;
        }
    }

    const imageClassification = async(event) => {
        event.preventDefault();
        setLoading(true)
        if(image === ''){
            setLoading(false);
            setError(true);
            setErrorText("Upload a picture before doing image classification.");
            return;
        }
        const endpointUrl = new URL("https://api-inference.huggingface.co/models/google/vit-base-patch16-224");

        const options = {
            method: "POST",
            headers: headerParameters,
            body: image
        };
        
        const response = await fetch(endpointUrl, options);
        const content = await response.json();
        if(content.hasOwnProperty('error')){
            setLoading(false);
            setError(true);
            setErrorText(content.error.charAt(0).toUpperCase() + content.error.slice(1));
        }
        setResult(
            <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%'}}>
                {
                    content.map((ans, key) => {
                        return(
                            <div className='input-box fillmask' style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center'}} key={key}>
                                <input id="sentence-1" className='input-area fill-mask' style={{color: 'var(--title-clr)'}} placeholder='Label' value={ans.label} readOnly/>
                                <div className='btn1 copy img'>Score : {(ans.score*100).toFixed(2)}</div>
                            </div>
                        )
                    })
                }
            </div>
        )
        setLoading(false)
    }
    return (
        <>
        <div className='home' style={{flexDirection: 'column'}}>
            <span className='title'>Image Classification</span>
            <form className='input-box' onSubmit={imageClassification}>
                <div style={{display: 'flex', flexDirection: 'row', height: '88%', padding: '1.1rem'}}>
                    <div style={{width: '50%', height: '100%', display: 'flex', justifyContent: 'center'}}>
                        <div className='ib'>
                            <button className='btn1 upload' type='button' onClick={() => {document.getElementById('getFile').click()}}>Upload File</button>
                            <input type='file' id="getFile" accept="image/*" style={{display:'none'}} onChange={setPic}/>
                            <span style={{fontSize: '2rem', textAlign: 'center', color: 'var(--title-clr)', marginTop: '1rem'}}>or</span>
                            <span style={{fontSize: '2rem', textAlign: 'center', color: 'var(--title-clr)', fontWeight: 'bold', marginTop: '1rem'}}>Paste an <span style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={imageUrl}>Image URL</span></span>
                        </div>
                    </div>
                    <div style={{width: '50%', height: '100%', display: 'flex', justifyContent: 'center'}}>
                        {imageURL === '' ? <span className='img-display'/> : <span className='img-display' style={{backgroundImage: `url(${imageURL})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}/>}
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', height: '11%', position: 'relative'}}>
                    <button className='button t' onClick={clear} type="reset" style={{left: '0', width: '15rem'}}>Remove Image</button>
                    <button className='button' value="Submit" type='submit'>Classify</button>
                </div>
            </form>
            <div className='input-box summary' style={{overflowY: 'scroll', paddingBottom: '2rem'}}>
                {result}
            </div>
        </div>
        <Loading open={loading}/>
        <Error open={error} displayText={errorText} onClose={() => setError(false)}/>
        </>
    )
}

export default ImageClassification
