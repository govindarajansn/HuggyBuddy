import React from 'react';
import ReactDOM from 'react-dom';

const Options = ({open, maxLength, onClose}) => {
    if(!open) return null;
    const set = () => {
        const param = {
            top_k: document.getElementById('top-k').value,
            top_p: document.getElementById('top-p').value,
            temperature: document.getElementById('temp').value,
            max_words: document.getElementById('max').value
        }
        onClose(param)
    }
    return ReactDOM.createPortal(
        <>
            <div style={{position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: '1000'}} />
            <div style={{position: 'fixed', top: '50%', left: '50%', transform:'translate(-50%, -50%)', backgroundColor: 'transparent', padding: '20px', zIndex: '1000', borderRadius: '10px', display: 'flex', flexDirection: 'column'}}>
                <div style={{width: '50rem', height: '40rem', background: `var(--bg-clr)`, borderRadius: '2rem', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 8px 0 rgba(223, 223, 177, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)', justifyContent: 'space-around'}}>
                    <span style={{width: '100%', fontSize: '3rem', display: 'flex', justifyContent: 'center', padding: '1rem', background: 'var(--nav-clr)', borderTopLeftRadius: '2rem', borderTopRightRadius: '2rem', color: '#fff', fontWeight: 'bold'}}>Options</span>
                    <span style={{overflowY: 'scroll', height: '60%', width: '100%'}}>
                        <span style={{fontSize: '2.7rem', padding: '1rem', height: '25%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', wordWrap: 'break-word', color: 'var(--title-clr)'}}>
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', margin: 'auto 0', marginRight: '1.5rem', width: '25%'}}>Top K</span>
                                <div className='input-box option' style={{margin: '0'}}>
                                    <input type='number' className='input-area' id='top-k' defaultValue={1}/>
                                </div>
                            </div>
                        </span>
                        <span style={{fontSize: '2.7rem', padding: '1rem', height: '25%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', wordWrap: 'break-word', color: 'var(--title-clr)'}}>
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', margin: 'auto 0', marginRight: '1.5rem', width: '25%'}}>Top P</span>
                                <div className='input-box option' style={{margin: '0'}}>
                                    <input type='number' className='input-area' id='top-p' defaultValue={1}/>
                                </div>
                            </div>
                        </span>
                        <span style={{fontSize: '2.7rem', padding: '1rem', height: '25%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', wordWrap: 'break-word', color: 'var(--title-clr)'}}>
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', margin: 'auto 0', marginRight: '1.5rem', width: '25%'}}>Temperature</span>
                                <div className='input-box option' style={{margin: '0'}}>
                                    <input type='number' className='input-area' id='temp' defaultValue={100}/>
                                </div>
                            </div>
                        </span>
                        <span style={{fontSize: '2.7rem', padding: '1rem', height: '25%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', wordWrap: 'break-word', color: 'var(--title-clr)'}}>
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                <span style={{display: 'flex', justifyContent: 'center', margin: 'auto 0', marginRight: '1.5rem', width: '25%'}}>Max Length</span>
                                <div className='input-box option' style={{margin: '0'}}>
                                    <input type='number' className='input-area' id='max' defaultValue={maxLength}/>
                                </div>
                            </div>
                        </span>
                    </span>
                    <span style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                        <button className='btn1' onClick={() => set()} type="button">Set Parameters</button>
                    </span>
                </div>
            </div>
        </>,
        document.getElementById('portal')
    )
}

export default Options
