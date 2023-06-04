import React, { useEffect, useState } from 'react';
import { headerParameters } from './InitObjects';
import Loading from './Loading';
import Error from './Error';
import '../css/tasks.css';

const QuestionAnswering = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [answer, setAnswer] = useState('');
    const [score, setScore] = useState('Score: 0');

    useEffect(() => {
        document.getElementById('sentence').value="THE TIME TRAVELLER (for so it will be convenient to speak of him) was expounding a recondite matter to us. is grey eyes shone and twinkled, and his usually pale face was flushed and animated. The fire burned brightly, and the soft radiance of the incandescent lights in the lilies of silver caught the bubbles that flashed and passed in our glasses. Our chairs, being his patents, embraced and caressed us rather than submitted to be sat upon, and there was that luxurious after-dinner atmosphere when thought runs gracefully free of the trammels of precision. And he put it to us in this way—marking the points with a lean forefinger—as we sat and lazily admired his earnestness over this new paradox (as we thought it) and his fecundity.";
        document.getElementById('sentence-1').value="What was colour of time traveller eyes?";
    }, [])

    const clear = () => {
        document.getElementById('sentence').value='';
        document.getElementById('sentence-1').value='';
        document.getElementById('sentence-2').value='';
        setAnswer('');
        setScore('Score: 0');
    }

    const copyText = () => {
        navigator.clipboard.writeText(answer)
    }

    const questionAnswering = async(event) => {
        event.preventDefault();
        setLoading(true);
        if(event.target[0].value === ''){
            setLoading(false);
            setError(true);
            setErrorText("Please write context before asking for answer.");
            return;
        }
        if(event.target[2].value === ''){
            setLoading(false);
            setError(true);
            setErrorText("Please write question before asking for answer.");
            return;
        }
        const endpointUrl = new URL("https://api-inference.huggingface.co/models/deepset/roberta-base-squad2");

        const bodyParameters = JSON.stringify({
            "inputs": {
                "question": event.target[2].value,
                "context": event.target[0].value
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
        let s = (content.score * 100).toFixed(2).toString();
        console.log(s);
        setAnswer(content.answer);
        setScore('Score: ' + s);
        console.log(score);
        setLoading(false);
    }
    return (
        <>
        <div className='home' style={{flexDirection: 'column'}}>
            <span className='title'>Question Answering</span>
            <form style={{display: 'flex', flexDirection: 'row', height:'100%', width: '90%', margin: 'auto', marginTop: '2rem'}} onSubmit={questionAnswering}>
                <div className='input-box context'>
                    <textarea id="sentence" className='input-area' placeholder='Enter your context'/>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', height: '11%', position: 'relative'}}>
                        <button className='button t' onClick={clear} type="reset" style={{left: '0'}}>Clear</button>
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', width: '50%', height: '70%', justifyContent: 'space-between'}}>
                    <div className='input-box question'>
                        <textarea id="sentence-1" className='input-area question' placeholder='Enter your question'/>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', height: '20%', position: 'relative'}}>
                            <button className='button' value="Submit" type='submit' >Ask</button>
                        </div>
                    </div>
                    <div className='input-box answer'>
                        <textarea id="sentence-2" className='input-area question' defaultValue={answer} placeholder='Answer' readOnly/>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', height: '20%', position: 'relative'}}>
                            <input className='score' type='text' value={score} style={{left: '0'}} readOnly />
                            <button className='button copy' type='button' onClick={copyText}>Copy To Clipboard</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <Loading open={loading}/>
        <Error open={error} displayText={errorText} onClose={() => setError(false)}/>
        </>
    )
}

export default QuestionAnswering
