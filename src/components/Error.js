import React from 'react';
import ReactDOM from 'react-dom';

const Error = ({open, displayText,onClose}) => {
    if(!open) return null;
    return ReactDOM.createPortal(
        <>
            <div style={{position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: '1000'}} />
            <div style={{position: 'fixed', top: '50%', left: '50%', transform:'translate(-50%, -50%)', backgroundColor: 'transparent', padding: '20px', zIndex: '1000', borderRadius: '10px', display: 'flex', flexDirection: 'column'}}>
                <div style={{width: '50rem', height: '30rem', background: `var(--bg-clr)`, borderRadius: '2rem', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 8px 0 rgba(223, 223, 177, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}>
                    <span style={{width: '100%', fontSize: '3rem', display: 'flex', justifyContent: 'center', padding: '1rem', background: 'var(--nav-clr)', borderTopLeftRadius: '2rem', borderTopRightRadius: '2rem', color: '#fff', fontWeight: 'bold'}}>Error</span>
                    <span style={{overflowY: 'scroll', height: '60%', width: '100%'}}>
                        <span style={{fontSize: '2.5rem', padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', wordWrap: 'break-word', color: 'var(--title-clr)'}}>{displayText}</span>
                    </span>
                    <span style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                        <button className='btn1' onClick={onClose} type="button">OK</button>
                    </span>
                </div>
            </div>
        </>,
        document.getElementById('portal')
    )
}

export default Error
