import React from 'react';
import ReactDOM from 'react-dom';
import '../css/loading.css';

const Loading = ({open}) => {
    if(!open) return null;
    return ReactDOM.createPortal(
        <>
            <div style={{position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0, 0, 0, 0.7)', zIndex: '1000'}} />
            <div className="container">
                <div className="dash uno" />
                <div className="dash dos" />
                <div className="dash tres" />
                <div className="dash cuatro" />
            </div>
        </>,
        document.getElementById('portal')
    )
}

export default Loading
