import React, { useEffect, useState } from 'react';
import { headerParameters } from './InitObjects';
import Loading from './Loading';
import Error from './Error';
import '../css/tasks.css';

const Translation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    const [trans, setTrans] = useState('');
    const [btnText, setBtnText] = useState('English to French');

    useEffect(() => {
        document.getElementById('sentence').value="All the variety, all the charm, all the beauty of life is made up of light and shadow.";
    }, [])

    const clear = () => {
        document.getElementById('sentence').value='';
        document.getElementById('sentence-1').value='';
        setTrans('');
    }

    const copyText = () => {
        navigator.clipboard.writeText(trans)
    }

    const translation = async(event) => {
        event.preventDefault();
        setLoading(true)
        if(event.target[0].value === ''){
            setLoading(false);
            setError(true);
            setErrorText("Please write text before doing translation.");
            return;
        }
        let model = '';
        if(btnText === 'English to French'){
            model = 'opus-mt-en-fr';
        }
        else if(btnText === 'French to English'){
            model = 'opus-mt-fr-en';
        }
        else if(btnText === 'English to German'){
            model = 'opus-mt-en-de';
        }
        else if(btnText === 'German to English'){
            model = 'opus-mt-de-en';
        }
        else if(btnText === 'English to Arabic'){
            model = 'opus-mt-en-ar';
        }
        else if(btnText === 'Arabic to English'){
            model = 'opus-mt-ar-en';
        }
        else{
            model = 'opus-mt-en-fr';
        }
        const endpointUrl = new URL(`https://api-inference.huggingface.co/models/Helsinki-NLP/${model}`);

        const bodyParameters = JSON.stringify({
            inputs: event.target[0].value,
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
            setError(true);
            setErrorText(content.error.charAt(0).toUpperCase() + content.error.slice(1));
            return;
        }
        setTrans(content[0].translation_text)
        setLoading(false)
    }
    return (
        <>
        <div className='home' style={{flexDirection: 'column'}}>
            <span className='title'>Translation</span>
            <div style={{display: 'flex', flexDirection: 'row', height:'100%', width: '95%', margin: 'auto'}}>
                <form className='input-box translation' onSubmit={translation}>
                    <textarea id="sentence" className='input-area' placeholder='Enter text for translation'/>
                    <div style={{display: 'flex', flexDirection: 'column', height: '11%', justifyContent: 'flex-end'}}>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', position: 'relative', margin: '0 0.5rem'}}>
                        <button className='btn1 t' onClick={clear} type="reset" style={{left: '0'}}>Clear</button>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                        <div className="dropdown">
                            <button className='btn1 s' style={{width: '16rem', height: '4.6rem', marginRight: '0.5rem'}} type='button'>{btnText}</button>
                            <div className="dropdown-content">
                                <span onClick={() => setBtnText('English to French')}>English to French</span>
                                <span onClick={() => setBtnText('French to English')}>French to English</span>
                                <span onClick={() => setBtnText('English to German')}>English to German</span>
                                <span onClick={() => setBtnText('German to English')}>German to English</span>
                                <span onClick={() => setBtnText('English to Arabic')}>English to Arabic</span>
                                <span onClick={() => setBtnText('Arabic to English')}>Arabic to English</span>
                            </div>
                        </div>
                        <button className='btn1' value="Submit" type='submit'>Translate</button>
                        </div>
                    </div>
                    </div>
                </form>
                <div className='input-box  translation'>
                    <textarea id="sentence-1" className='input-area' defaultValue={trans} placeholder='Translation' readOnly/>
                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', height: '11%', position: 'relative'}}>
                        <button className='button copy' onClick={copyText}>Copy To Clipboard</button>
                    </div>
                </div>
            </div>
        </div>
        <Loading open={loading}/>
        <Error open={error} displayText={errorText} onClose={() => setError(false)}/>
        </>
    )
}

export default Translation
