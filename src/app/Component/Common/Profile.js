import React from 'react';
import { useSelector } from 'react-redux';

export default function Profile(props) {
    const user = useSelector((state) => state.user.userDetails);
    return (
        <div className='overlay' onClick={props.onClose}>
            <div className="header-profile-main">
                <div className="header-profile-item">
                    <img className="header-profile-image" src={user.profile} alt="userimage" />
                </div>
                <div className="header-profile-item">Name : {user.username}</div>
                <div className="header-profile-item">Email : {user.email}</div>
                <div className="header-profile-item">Mobileno : (+91) {user.mobile}</div>
            </div>
        </div>
    )
}


