import React from 'react';
import './ClientHeader.css';

export default function HeaderOptions(props) {

    return (
        <div className='overlay1' onClick={props.onClose}>
            <div className="options1">
                <div className="option-item1" onClick={props.showProfile} >Profile</div>
            </div>
        </div>
    )
}