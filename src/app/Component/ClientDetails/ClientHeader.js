import React, { useState } from 'react';
import { BsChevronLeft } from 'react-icons/bs';
import HeaderOptions from './HeaderOptions';
import './ClientHeader.css';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import menu from '../../../assets/three-dots-vertical.svg';

function ClientHeader(props) {
    const [isShowOptions, setisShowOptions] = useState(false);
    const [isShowProfile, setisShowProfile] = useState(false)
    const history = useHistory();
    const user = useSelector(state => state.user)
    const handleBack = () => {
        history.push("/chats");
    }
    const showOptions = () => {  
        setisShowOptions(value => !value);
    }
  
    return (
        <div className="client-common-header">
            <div style={{ marginLeft: '-2rem' }}>
                <BsChevronLeft className='back-arrow' onClick={handleBack} />
            </div>
            <div className="client-header-profile">
                <img className="client-header-image" src={user.userDetails.profile} alt="profile" />
            </div>
            <div className="client-header-name">{props.title}</div>
            <div className="client-header-menu">
                <img src={menu} style={{ cursor: 'pointer', height: '2.1rem' }} alt="menu" onClick={showOptions} />
            </div>
            {isShowOptions && <HeaderOptions onClose={() => { setisShowOptions(value => !value) }} />}
        </div>
    )
}

export default ClientHeader