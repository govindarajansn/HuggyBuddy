import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { headerParameters } from './InitObjects';
import Loading from './Loading';
import Error from './Error';
import '../css/tasks.css';

const Segmentation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [result, setResult] = useState(<span className='fill-mask'>Results</span>);
    const [image, setImage] = useState('');
    const [imageURL, setImageUrl] = useState('');

    useEffect(() => {
        const imageUrl2 = async() => {
            try{
                let imgUrl = 'https://images.unsplash.com/photo-1586943353950-95bdbe3207a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2218&q=80';
                const imgResponse = await fetch(imgUrl);
                setImageUrl(imgUrl);
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
        let imgUrl = prompt('Please paste the image URL here')
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
            setError(true);
            setErrorText("Unable to extract picture from this link. Download this picture and upload it using Upload File button");
            return;
        }
    }

    const displayResult = (content) => {
        let result = 
            <div style={{display: 'flex', flexDirection: 'row', height: '100%', width: '100%'}}>
            {
                content.map((ans, key) => {
                    return(
                        <img id="imgSource" src={'data:image/png;base64,' + ans.mask} alt= '' style={{width:'40%', height: '80%', margin: 'auto', marginLeft:'3rem', borderRadius: '2rem', boxShadow: '0 4px 8px 0 rgba(223, 223, 177, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}} key={key}/>
                    )
                })
            }
            </div>
        setResult(result);
    }

    const segmentation = async(event) => {
        event.preventDefault();
        setLoading(true)
        if(image === ''){
            setLoading(false);
            setError(true);
            setErrorText("Upload a picture before doing segmentation.");
            return;
        }
        const endpointUrl = new URL("https://api-inference.huggingface.co/models/facebook/detr-resnet-50-panoptic");

        const options = {
            method: "POST",
            headers: headerParameters,
            body: image,
            options: {
                wait_for_model: true
            }
        };

        const response = await fetch(endpointUrl, options);
        const content = await response.json();
        if(content.hasOwnProperty('error')){
            setLoading(false);
            setError(true);
            setErrorText(content.error.charAt(0).toUpperCase() + content.error.slice(1));
        }
        else{
            displayResult(content);
            setLoading(false)
        }
    }
    return (
        <>
        <div className='home' style={{flexDirection: 'column'}}>
            <span className='title'>Segmentation</span>
            <form className='input-box' onSubmit={segmentation}>
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
                        {imageURL === '' ? <span className='img-display'/> : <span id='imgSource2' className='img-display' style={{backgroundImage: `url(${imageURL})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}/>}
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', height: '11%', position: 'relative'}}>
                    <button className='button t' onClick={clear} type="reset" style={{left: '0', width: '15rem'}}>Remove Image</button>
                    <button className='button' value="Submit" type='submit'>Segment</button>
                </div>
            </form>
            <div className='input-box' style={{overflowX: 'auto'}}>
                {result}
            </div>
        </div>
        <Loading open={loading}/>
        <Error open={error} displayText={errorText} onClose={() => setError(false)}/>
        </>
    )
}

export default Segmentation
