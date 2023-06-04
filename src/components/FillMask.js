import React, { useEffect, useState } from 'react';
import { headerParameters } from './InitObjects';
import Loading from './Loading';
import Error from './Error';
import '../css/tasks.css';

const FillMask = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [result, setResult] = useState(<span className='fill-mask'>Results</span>);

    useEffect(() => {
        document.getElementById('sentence').value = 'DNA is the [MASK] of life.'
    }, [])
    const clear = () => {
        document.getElementById('sentence').value = '';
        setResult(<span className='fill-mask'>Results</span>);
    }

    const copyText = (text) => {
        navigator.clipboard.writeText(text)
    }

    const fillMask = async (event) => {
        event.preventDefault();
        setLoading(true);
        if (event.target[0].value === '') {
            setLoading(false);
            setError(true);
            setErrorText("Please write text before filling mask.");
            return;
        }
        const endpointUrl = new URL("https://api-inference.huggingface.co/models/bert-base-uncased");

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
        if (content.hasOwnProperty('error')) {
            setLoading(false);
            setError(true);
            setErrorText(content.error.charAt(0).toUpperCase() + content.error.slice(1));
            return;
        }
        setResult(
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                {
                    content.map((ans, key) => {
                        return (
                            <div className='input-box fillmask' style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }} key={key}>
                                <input id="sentence-1" className='input-area fill-mask' placeholder='Result' value={ans.sequence} readOnly />
                                <button className='btn1 copy' style={{ marginRight: '0.5rem', color: `#fff`, backgroundColor: `var(--nav-clr)` }}>Score : {(ans.score * 100).toFixed(2)}</button>
                                <button className='btn1 copy' style={{ marginRight: '1rem' }} onClick={() => copyText(ans.sequence)}>Copy To Clipboard</button>
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
            <div className='home' style={{ flexDirection: 'column' }}>
                <span className='title'>Fill Mask</span>
                <form className='input-box summary' onSubmit={fillMask}>
                    <textarea id="sentence" className='input-area' placeholder='Enter text for fill mask task. Example: DNA is the [MASK] of life.' />
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', height: '11%', position: 'relative' }}>
                        <button className='button t' onClick={clear} type="reset" style={{ left: '0' }}>Clear</button>
                        <button className='button' value="Submit" type='submit'>Fill Mask</button>
                    </div>
                </form>
                <div className='input-box' style={{ overflowY: 'scroll', paddingBottom: '2rem' }}>
                    {result}
                </div>
            </div>
            <Loading open={loading} />
            <Error open={error} displayText={errorText} onClose={() => setError(false)} />
        </>
    )
}

export default FillMask