import React from 'react';
import './Header.css';
import { useHistory} from "react-router";
import {useDispatch} from 'react-redux';


export default function Options(props) {
   const dispatch=useDispatch();
   const history =useHistory();
    const logOut = () => {
        dispatch({
            type:'LOGOUT'
        })
        history.push('/');
    }
        return (
            <div className='overlay' onClick={props.onClose}>
                <div className="options">
                    <div className="option-item" onClick={props.showProfile}>Profile</div>
                    <div className="option-item">Add to archive</div>
                    <div className="option-item-logout" onClick={logOut}>Logout</div>
                </div>
            </div>
        )
}

