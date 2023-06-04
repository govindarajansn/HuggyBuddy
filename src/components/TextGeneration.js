import React, { useEffect, useState } from 'react';
import { headerParameters } from './InitObjects';
import Loading from './Loading';
import Error from './Error';
import Options from './Options';
import '../css/tasks.css';

const TextGeneration = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [options, setOptions] = useState(false);
    const [param, setParam] = useState(
        {
            top_k: 1,
            top_p: 1,
            temperature: 100,
            max_words: 500
        }
    )
    const [errorText, setErrorText] = useState('');
    const [result, setResult] = useState('');

    useEffect(() => {
        document.getElementById('sentence').value="Generative Pre-trained Transformer 3 (GPT-3) is an autoregressive language model that uses deep learning to produce human-like text.";
    }, [])

    const clear = () => {
        document.getElementById('sentence').value='';
        document.getElementById('sentence-1').value='';
        setResult('');
    }

    const copyText = () => {
        navigator.clipboard.writeText(result)
    }

    const optionsOnClose = (param) => {
        setParam(param);
        setOptions(false);
    }

    const textGeneration = async(event) => {
        event.preventDefault();
        setLoading(true);
        if(event.target[0].value === ''){
            setLoading(false);
            setError(true);
            setErrorText("Please write text before doing text generation.");
            return;
        }
        const endpointUrl = new URL("https://api-inference.huggingface.co/models/gpt2");

        const bodyParameters = JSON.stringify({
            inputs: event.target[0].value,
            parameters: {
                return_full_text: true,
                top_k: parseInt(param.top_k),
                top_p: parseFloat(param.top_p),
                temperature: parseFloat(param.temperature),
                max_length: parseInt(param.max_words)
            }, 
            options: {
                wait_for_model: true
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
            let err = ''
            if(typeof content.error !== 'object'){
                err = content.error.charAt(0).toUpperCase() + content.error.slice(1) + '\n';
            }
            else{
                for(let i=0; i < content.error.length; i++){
                    err += content.error[i].charAt(0).toUpperCase() + content.error[i].slice(1) + '\n';
                }
            }

            if(content.hasOwnProperty('warnings')){
                if(typeof content.warnings !== 'object'){
                    err += content.warnings.charAt(0).toUpperCase() + content.warnings.slice(1) + '\n';
                }
                else{
                    for(let i=0; i < content.warnings.length; i++){
                        err += content.warnings[i].charAt(0).toUpperCase() + content.warnings[i].slice(1) + '\n';
                    }
                }
            }
            setErrorText(err);
            setError(true);
            return;
        }
        setResult(content[0].generated_text);
        setLoading(false)
    }
    return (
        <>
        <div className='home' style={{flexDirection: 'column'}}>
            <span className='title'>Text Generation</span>
            <form className='input-box summary' onSubmit={textGeneration}>
                <textarea id="sentence" className='input-area' placeholder='Enter text for text generation'/>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '11%'}}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', position: 'relative', margin: '0 0.5rem'}}>
                        <button className='btn1 t' onClick={clear} type="reset" style={{left: '0'}}>Clear</button>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <i className="fa fa-cog" aria-hidden="true" style={{color: 'var(--title-clr)', fontSize: '3rem', marginRight: '2rem', marginTop: '1.7rem', cursor: 'pointer'}} onClick={() => setOptions(true)}/>
                            <button className='btn1' value="Submit" type='submit'>Generate Text</button>
                        </div>
                    </div>
                </div>
            </form>
            <div className='input-box'>
                <textarea id="sentence-1" className='input-area' style={{marginBottom: '1rem', height: '85%'}} placeholder='Result' value={result} readOnly/>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', height: '11%', position: 'relative'}}>
                    <button className='button copy' onClick={copyText}>Copy To Clipboard</button>
                </div>
            </div>
        </div>
        <Loading open={loading}/>
        <Error open={error} displayText={errorText} onClose={() => setError(false)}/>
        <Options open={options} maxLength={500} onClose={(param) => optionsOnClose(param)}/>
        </>
    )
}

export default TextGeneration