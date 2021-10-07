import React, { useState, useRef } from 'react'
import './Login.css'
import axios from 'axios';
import './CommonStyles.css';
import { Link } from 'react-router-dom';
import {useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import CatchError from '../CatchError/CatchError';
export default function Login() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [catchError,setCatchError]= useState(false);
    const [error, seterror] = useState({ nameError: "", passworderror: "" })
    const Name = useRef();
    const Password = useRef();

    const LoginData = (type) => {
        if (type === 'Name' || type === 'all') {
            if (!Name.current.value) {
                seterror({ nameError: 'Please enter username' });
            } else {
                seterror({ nameError: '' });
            }
        }

        if (type === 'Password' || type === 'all') {
            if (!Password.current.value) {
                seterror({ passworderror: 'Please enter password.' });
            }
            else {
                seterror({ passworderror: "" });
            }
        }
    }

    const onSubmit = () => {
        if (!Name.current.value && !Password.current.value) {
            seterror({ nameError: 'Please enter username', passworderror: 'Please enter password.' })
        }
        else {
            axios.post("https://ptchatindia.herokuapp.com/login",
                {
                    "username": Name.current.value,
                    "password": Password.current.value
                }).then(res => {
                    if (res.status === 200) {
                        dispatch({
                            type: "USER_LOGIN",
                            payload:res.data.data
                        })
                        history.push('/chats');
                    }
                })
                .catch((err)=>{
                    setCatchError(true)
                });
        }
    }
    const catchErrorChange=()=>{
        setCatchError(!catchError)
    }

    return (
        <div className='login-container'>
            {!catchError && <div className='login-box'>
                <p className='login-header'>Login</p>
                <div className='login-input'>
                    <label>Username*</label>
                    <input type="text" className="input-change" placeholder="Enter User Name" ref={Name} onBlur={() => LoginData('Name')} />
                    <div className='error-msg'>{error && <p>{error.nameError}</p>}</div>
                </div>
                <div className='login-input'>
                    <label>Password*</label>
                    <input type="password" placeholder="Enter password" className="input-change" ref={Password} onBlur={() => LoginData('Password')} />
                    <div className='error-msg'>{error && <p>{error.passworderror}</p>}</div>
                </div>
                <div>*Please fill mandatory fields</div>
                <div className='login-submit'>
                    <button className='login-button' onClick={onSubmit}>Login</button>
                </div>
                <div className='register'>
                    <Link style={{ color: '#ffffff' }} to='/register'>Register</Link>
                </div>
            </div>}
            {catchError && <CatchError callBack={catchErrorChange}/>}
        </div>
    )
}



