import React, { useState, useRef } from 'react'
import './Login.css'
import axios from 'axios';
import './CommonStyles.css';
import { Link } from 'react-router-dom';
import {useSelector,useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
export default function Login() {
    const data = useSelector((state) => state.data);
    const dispatch = useDispatch();
    const history = useHistory();
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
                    console.log(res.data);
                    if (res.status === 200) {

                        dispatch({
                            type: "USER_LOGIN",
                            data:res.data.data
                        })
                        history.push('/contacts');
                    }
                })
                .catch(err => console.log("error", err)
            )
        }
    }

    return (
        <div className='login-container'>
            <div className='login-box'>
                <div className='login-header'>Login</div>
                <div className='login-input'>
                    <label>Username</label>
                    <input type="text" className="input-change" placeholder="Enter User Name" ref={Name} onBlur={() => LoginData('Name')} />
                    <div className='error-msg'>{error && <p>{error.nameError}</p>}</div>
                </div>
                <div className='login-input'>
                    <label>Password</label>
                    <input type="password" placeholder="Enter password" className="input-change" ref={Password} onBlur={() => LoginData('Password')} />
                    <div className='error-msg'>{error && <p>{error.passworderror}</p>}</div>
                </div>
                <div className='login-submit'>
                    <button className='login-button' onClick={onSubmit}>Login</button>
                </div>
                <div className='register'>
                    <Link style={{ color: '#ffffff' }} to='/register'>Register</Link>
                </div>
            </div>
        </div>


    )
}



