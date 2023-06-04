import React, { useEffect, useState } from 'react';
import { headerParameters } from './InitObjects';
import Loading from './Loading';
import Error from './Error';
import '../css/tasks.css';

const SentenceSimilarity = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const[box1, setBox1] = useState('');
    const[score1, setScore1] = useState(0);

    useEffect(() => {
        document.getElementById('sentence').value="What's up with the weather?";
        document.getElementById('sentence-1').value="Global warming's effects are getting serious.";
    }, [])

    const clear = () => {
        document.getElementById('sentence').value='';
        document.getElementById('sentence-1').value='';
        setScore1(0);
        setBox1('');
    }

    const sentenceSimilarity = async(event) => {
        event.preventDefault();
        setLoading(true);
        if(event.target[0].value === ''){
            setLoading(false);
            setError(true);
            setErrorText("Please write text before checking sentence similarity.");
            return;
        }
        if(event.target[1].value === ''){
            setLoading(false);
            setError(true);
            setErrorText("Please write sample sentence before checking sentence similarity.");
            return;
        }
        const endpointUrl = new URL("https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2");

        const bodyParameters = JSON.stringify({
            inputs: {
                source_sentence: event.target[0].value,
                sentences: [event.target[1].value]
            }
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
        setScore1((content[0]*100).toFixed(0));
        setBox1('1');
        setLoading(false)
    }
    return (
        <>
        <div className='home' style={{flexDirection: 'column'}}>
            <span className='title'>Sentence Similarity</span>
            <form className='input-box' onSubmit={sentenceSimilarity}>
                <div style={{display: 'flex', height: '88%', flexDirection: 'column'}}>
                    <div className='input-box similarity'>
                        <textarea id="sentence" className='input-area similarity' placeholder='Enter text to check similarity'/>
                    </div>
                    <div className='input-box similarity'>
                        <textarea id="sentence-1" className='input-area similarity' placeholder='Enter sample sentence'/>
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '97%', height: '11%', margin: 'auto'}}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <button className='btn1 t' onClick={clear} type="reset" style={{left: '0'}}>Clear</button>
                        <button className='btn1' value="Submit" type='submit'>Check Similarity</button>
                    </div>
                </div>
            </form>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', height: '15%', marginTop: '2rem'}}>
                <span className='score-box-text' style={{opacity:`${box1}`}}>Similarity Score: </span>
                <span className='score-box' style={{opacity:`${box1}`}}>{score1}</span>
            </div>
        </div>
        <Loading open={loading}/>
        <Error open={error} displayText={errorText} onClose={() => setError(false)}/>
        </>
    )
}

export default SentenceSimilarity
