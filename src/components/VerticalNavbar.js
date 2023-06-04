import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/navbar.css';

const VerticalNavbar = () => {
  return (
    <div className='nav-bar-vertical'>
        <NavLink 
            to='/' 
            className='nav-link'
            style={({ isActive }) => ({
                background: isActive ? 'var(--nav-clr)' : '',
                color: isActive ? '#FFFFFF' : 'var(--v-nav-item-clr)',
                borderRadius: isActive ? '0.5rem' : '',
            })}
        >
            <span>Sentiment Analysis</span>
        </NavLink>
        <NavLink 
            to='/text-summarization' 
            className='nav-link'
            style={({ isActive }) => ({
                background: isActive ? 'var(--nav-clr)' : '',
                color: isActive ? '#FFFFFF' : 'var(--v-nav-item-clr)',
                borderRadius: isActive ? '0.5rem' : '',
            })}
        >
            <span>Text Summarization</span>
        </NavLink>
        <NavLink 
            to='/translation' 
            className='nav-link'
            style={({ isActive }) => ({
                background: isActive ? 'var(--nav-clr)' : '',
                color: isActive ? '#FFFFFF' : 'var(--v-nav-item-clr)',
                borderRadius: isActive ? '0.5rem' : '',
            })}
        >
            <span>Translation</span>
        </NavLink>
        <NavLink 
            to='/question-answering' 
            className='nav-link'
            style={({ isActive }) => ({
                background: isActive ? 'var(--nav-clr)' : '',
                color: isActive ? '#FFFFFF' : 'var(--v-nav-item-clr)',
                borderRadius: isActive ? '0.5rem' : '',
            })}
        >
            <span>Question Answering</span>
        </NavLink>
        <NavLink 
            to='/text-generation' 
            className='nav-link'
            style={({ isActive }) => ({
                background: isActive ? 'var(--nav-clr)' : '',
                color: isActive ? '#FFFFFF' : 'var(--v-nav-item-clr)',
                borderRadius: isActive ? '0.5rem' : '',
            })}
        >
            <span>Text Generation</span>
        </NavLink>
        <NavLink 
            to='/sentence-similarity' 
            className='nav-link'
            style={({ isActive }) => ({
                background: isActive ? 'var(--nav-clr)' : '',
                color: isActive ? '#FFFFFF' : 'var(--v-nav-item-clr)',
                borderRadius: isActive ? '0.5rem' : '',
            })}
        >
            <span>Sentence Similarity</span>
        </NavLink>
        <NavLink 
            to='/fill-mask' 
            className='nav-link'
            style={({ isActive }) => ({
                background: isActive ? 'var(--nav-clr)' : '',
                color: isActive ? '#FFFFFF' : 'var(--v-nav-item-clr)',
                borderRadius: isActive ? '0.5rem' : '',
            })}
        >
            <span>Fill Mask</span>
        </NavLink>
        <NavLink 
            to='/image-classification' 
            className='nav-link'
            style={({ isActive }) => ({
                background: isActive ? 'var(--nav-clr)' : '',
                color: isActive ? '#FFFFFF' : 'var(--v-nav-item-clr)',
                borderRadius: isActive ? '0.5rem' : '',
            })}
        >
            <span>Image Classification</span>
        </NavLink>
        <NavLink 
            to='/object-detection' 
            className='nav-link'
            style={({ isActive }) => ({
                background: isActive ? 'var(--nav-clr)' : '',
                color: isActive ? '#FFFFFF' : 'var(--v-nav-item-clr)',
                borderRadius: isActive ? '0.5rem' : '',
            })}
        >
            <span>Object Detection</span>
        </NavLink>
        <NavLink 
            to='/segmentation' 
            className='nav-link'
            style={({ isActive }) => ({
                background: isActive ? 'var(--nav-clr)' : '',
                color: isActive ? '#FFFFFF' : 'var(--v-nav-item-clr)',
                borderRadius: isActive ? '0.5rem' : '',
            })}
        >
            <span>Segmentation</span>
        </NavLink>
    </div>
  )
}

export default VerticalNavbar
