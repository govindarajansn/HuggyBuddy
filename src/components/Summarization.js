import React, { useState, useEffect } from 'react';
import { headerParameters } from './InitObjects';
import Loading from './Loading';
import Options from './Options';
import Error from './Error';
import '../css/tasks.css';

const Summarization = () => {
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState(false);
    const [param, setParam] = useState(
        {
            top_k: 1,
            top_p: 1,
            temperature: 100,
            max_words: 56
        }
    )
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [summary, setSummary] = useState('');

    useEffect(() => {
        document.getElementById('sentence').value= "Filby became pensive. “Clearly,” the Time Traveller proceeded, “any real body must have extension in four directions: it must have Length, Breadth, Thickness, and—Duration. But through a natural infirmity of the flesh, which I'll explain to you in a moment, we incline to overlook this fact. There are really four dimensions, three which we call the three planes of Space, and a fourth, Time. There is, however, a tendency to draw an unreal distinction between the former three dimensions and the latter, because it happens that our consciousness moves intermittently in one direction along the latter from the beginning to the end of our lives.”";
    }, [])

    const clear = () => {
        document.getElementById('sentence').value='';
        document.getElementById('sentence-1').value='';
        setSummary('');
    }

    const copyText = () => {
        navigator.clipboard.writeText(summary)
    }

    const optionsOnClose = (param) => {
        setParam(param);
        setOptions(false);
    }

    const summarization = async(event) => {
        event.preventDefault();
        setLoading(true);
        if(event.target[0].value === ''){
            setLoading(false);
            setError(true);
            setErrorText("Please write text before text summarization.");
            return;
        }
        const endpointUrl = new URL("https://api-inference.huggingface.co/models/facebook/bart-large-cnn");

        const bodyParameters = JSON.stringify({
            inputs: event.target[0].value,
            parameters: {
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
        console.log(content)
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
        setSummary(content[0].summary_text)
        setLoading(false)
    }
    return (
        <>
        <div className='home' style={{flexDirection: 'column'}}>
            <span className='title'>Text Summarization</span>
            <form className='input-box' onSubmit={summarization}>
                <textarea id="sentence" className='input-area' placeholder='Enter text for summarization' />
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '11%'}}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', position: 'relative', margin: '0 0.5rem'}}>
                        <button className='btn1 t' onClick={clear} type="reset" style={{left: '0'}}>Clear</button>
                        {/* <button className='btn1' value="Submit" type='submit'>Summarize</button> */}
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <i className="fa fa-cog" aria-hidden="true" style={{color: 'var(--title-clr)', fontSize: '3rem', marginRight: '2rem', marginTop: '1.7rem', cursor: 'pointer'}} onClick={() => setOptions(true)}/>
                            <button className='btn1' value="Submit" type='submit'>Summarize</button>
                        </div>
                    </div>
                </div>
            </form>
            <div className='input-box summary'>
                <textarea id="sentence-1" className='input-area' defaultValue={summary} placeholder='Summary' readOnly/>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', height: '11%', position: 'relative'}}>
                    <button className='button copy' onClick={copyText}>Copy To Clipboard</button>
                </div>
            </div>
        </div>
        <Loading open={loading}/>
        <Error open={error} displayText={errorText} onClose={() => setError(false)}/>
        <Options open={options} maxLength={56} onClose={(param) => optionsOnClose(param)}/>
        </>
    )
}

export default Summarization
