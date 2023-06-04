import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { headerParameters } from './InitObjects';
import Loading from './Loading';
import Error from './Error';
import '../css/tasks.css';

const ObjectDetection = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [result, setResult] = useState(<span className='fill-mask'>Result</span>);
    const [image, setImage] = useState('');
    const [imageURL, setImageUrl] = useState('');
    const [canv, setCanv] = useState('none');

    useEffect(() => {
        const imageUrl2 = async() => {
            try{
                let imgUrl = 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80';
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
        setResult(<span className='fill-mask'>Result</span>);
        setImage('');
        setImageUrl('');
        setCanv('none')
    }

    const setPic = async(event) => {
        clear()
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
        clear()
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

    const objectDetection = async(event) => {
        event.preventDefault();
        setLoading(true)
        if(image === ''){
            setLoading(false);
            setError(true);
            setErrorText("Upload a picture before doing object detection.");
            return;
        }
        const endpointUrl = new URL("https://api-inference.huggingface.co/models/facebook/detr-resnet-50");

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
            return;
        }
        if(content.length === 0){
            setResult(<span className='fill-mask'>No Objects Detected</span>);
        }
        else{
            let canvas = document.getElementById("res-canvas");
            let ctx = canvas.getContext("2d");
            let img = document.getElementById("imgSource");
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'medium';
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            setResult(
                    <div style={{display: 'flex', flexDirection: 'column', width: '100%', height: '100%', marginBottom:'2rem'}}>
                    {
                        content.map((ans, key) => {
                            let widthDiff = (img.width/canvas.width);
                            let heightDiff = (img.height/canvas.height);
                            let rectX = (ans.box.xmin/widthDiff);
                            let rectY = (ans.box.ymin/heightDiff);
                            let rectWidth = ((ans.box.xmax - ans.box.xmin)/widthDiff);
                            let rectLength = ((ans.box.ymax - ans.box.ymin)/heightDiff);

                            ctx.beginPath();
                            ctx.lineWidth = "1";
                            ctx.strokeStyle = "#"+((1<<24)*Math.random()|0).toString(16);
                            ctx.rect(rectX, rectY, rectWidth, rectLength);
                            ctx.stroke();

                            return(
                                <div className='input-box classify' style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', margin: '2rem 0rem 0rem 2rem', width: '95%'}} key={key}>
                                    <input id="sentence-1" className='input-area fill-mask' style={{width: '70%'}} placeholder='Label' value={ans.label} readOnly/>
                                    <div className='btn1 copy img' style={{width: '25%'}}>Score : {(ans.score*100).toFixed(2)}</div>
                                </div>
                            )
                        })
                    }
                    </div>
                )
                setCanv('flex');
        }
        setLoading(false);
    }

    return (
        <>
        <div className='home' style={{flexDirection: 'column'}}>
            <span className='title'>Object Detection</span>
            <form className='input-box' onSubmit={objectDetection}>
                <div style={{display: 'flex', flexDirection: 'row', height: '88%', padding: '1.1rem'}}>
                    <div style={{width: '50%', height: '100%', display: 'flex', justifyContent: 'center'}}>
                        <div className='ib'>
                            <button className='btn1 upload' type='button' onClick={() => {document.getElementById('getFile').click()}}>Upload File</button>
                            <input type='file' id="getFile" accept="image/*" style={{display:'none'}} onChange={setPic}/>
                            <img id="imgSource" src={imageURL} alt= '' style={{display:'none'}} />
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
                    <button className='button' value="Submit" type='submit'>Detect</button>
                </div>
            </form>
            <div className='input-box' style={{overflowY: 'scroll', paddingBottom: '2rem'}}>
                <div style={{display: 'flex', flexDirection: 'row', width: '100%', height: '100%'}}>
                    <div style={{width: '100%', height: '100%', overflowY: 'scroll'}}>
                        {result}
                    </div>
                    <div id='canvas-div' style={{flexDirection: 'column', width: '100%', height: '100%', display: canv }}>
                        <canvas id='res-canvas' className='img-display' style={{background: 'white'}}/>
                    </div>
                </div>
            </div>
        </div>
        <Loading open={loading}/>
        <Error open={error} displayText={errorText} onClose={() => setError(false)}/>
        </>
    )
}

export default ObjectDetection
