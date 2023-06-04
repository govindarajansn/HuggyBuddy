import React, { useEffect, useState } from 'react';
import { headerParameters } from './InitObjects';
import Loading from './Loading';
import Error from './Error';
import '../css/tasks.css';

const SentimentAnalysis = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const[happy, setHappy] = useState('');
    const[meh, setMeh] = useState('');
    const[frown, setFrown] = useState('');

    useEffect(() => {
        document.getElementById('sentence').value= "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen, and regulating the circulation."
    }, [])

    const clear = () => {
        document.getElementById('sentence').value='';
        setHappy('');
        setMeh('');
        setFrown('');
    }

    const analysis = async(event) => {
        event.preventDefault();
        setHappy('');
        setMeh('');
        setFrown('');
        setLoading(true);
        if(event.target[0].value === ''){
            setLoading(false);
            setError(true);
            setErrorText("Please write text before doing sentiment analysis.");
            return;
        }
        const endpointUrl = new URL("https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english");

        const bodyParameters = JSON.stringify({
            inputs: event.target[0].value
        });

        const options = {
            method: "POST",
            headers: headerParameters,
            body: bodyParameters
        };
        
        const response = await fetch(endpointUrl, options);
        const content = await response.json();
        if(content.hasOwnProperty('error')){
            setLoading(false);
            setError(true);
            setErrorText(content.error.charAt(0).toUpperCase() + content.error.slice(1));
            return;
        }
        
        let label = content[0][0].label;
        let score = content[0][0].score.toFixed(1);
        if(score === 0.5)
            setMeh(1);
        else if (label === "POSITIVE")
            setHappy(1);
        else
            setFrown(1);
        setLoading(false)
    }
    return (
        <>
        <div className='home' style={{flexDirection: 'column'}}>
            <span className='title'>Sentiment Analysis</span>
            <form className='input-box' onSubmit={analysis}>
                <textarea id="sentence" className='input-area' placeholder='Enter text for sentiment analysis' />
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '11%'}}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', position: 'relative', margin: '0 0.5rem'}}>
                        <button className='btn1 t' onClick={clear} type="reset" style={{left: '0'}}>Clear</button>
                        <button className='btn1' value="Submit" type='submit'>Analyze</button>
                    </div>
                </div>
            </form>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                <span className='emo' style={{opacity:`${happy}`}}><p>&#128516;</p></span>
                <span className='emo' style={{opacity:`${meh}`}}><p>&#128528;</p></span>
                <span className='emo' style={{opacity:`${frown}`}}><p>&#128545;</p></span>
            </div>
        </div>
        <Loading open={loading}/>
        <Error open={error} displayText={errorText} onClose={() => setError(false)}/>
        </>
    )
}

export default SentimentAnalysis
