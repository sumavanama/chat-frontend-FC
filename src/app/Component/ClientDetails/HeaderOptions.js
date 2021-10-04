import React, { useState } from 'react';
import './ClientHeader.css';
import ClientProfile from './ClientProfile';

export default function HeaderOptions(props) {

    const [isShowProfilePopup, setisShowProfilePopup] = useState(false);
    const showProfilePopup = () => {
        setisShowProfilePopup(value => !value)
    }
    return (
        <div className='overlay1' onClick={props.onClose}>
            <div className="options1">
                <div className="option-item1" onClick={showProfilePopup} >Profile</div>
                {isShowProfilePopup ? <ClientProfile onClose={() => setisShowProfilePopup(value => !value)} /> : null}
            </div>
        </div>
    )
}

