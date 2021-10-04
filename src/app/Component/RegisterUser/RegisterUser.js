import React, { useState, useRef } from 'react'
import './RegisterUser.css';
import "../Login/CommonStyles.css";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import ProfileUploader from '../profileUploader';

export default function RegisterUser() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [Details, setDetails] = useState({ username: "", email: '', mobile: '', password: "" });
    const [error, seterror] = useState({ nameError: "", passwordError: "", emailError: "", mobileError: "", confirmpasswordError: "" });
    const Name = useRef();
    const Email = useRef();
    const Password = useRef();
    const Mobile = useRef();
    const confirmPassword = useRef();

    const LoginData = (type) => {
        if (type === 'Name' || type === 'all') {
            if (!Name.current.value) {
                seterror({ nameError: 'Please enter username.' });
            }
            else if (Name.current.value.length < 4) {
                seterror({ nameError: 'Please check username length.' });
            }
            else {
                seterror({ nameError: '' });
            }
        }

        if (type === 'Email' || type === 'all') {
            if (!Email.current.value) {
                seterror({ emailError: 'Please enter email.' });
            }
            else if ((!Email.current.value.match(/^[a-zA-Z0-9.!#$%&'+/=?^_{|}~-]+@[a-zA-Z0-9-]+.+(?:\.[a-zA-Z0-9-]+)*$/))) {
                seterror({ emailError: 'Please check email strength.' });
            }
            else {
                seterror({ emailError: '' });
            }
        }

        if (type === 'Mobile' || type === 'all') {
            if (!Mobile.current.value) {
                seterror({ mobileError: 'Please enter mobile number.' });
            }
            else if (Mobile.current.value.length !== 10) {
                seterror({ mobileError: 'Please check mobile number length.' });
            }
            else if (Mobile.current.value.match(/^[6-9][0-9]*$/)) {
                seterror({ mobileError: "mobile number should start with 6 or 7 or 8 or 9" });
            }
            else {
                seterror({ mobileError: '' });
            }
        }

        if (type === 'Password' || type === 'all') {
            if (!Password.current.value) {
                seterror({ passwordError: 'Please enter password.' });
            }
            else if ((!Password.current.value.match(/^.*(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%&]).*$/))) {
                seterror({ passwordError: 'Please check password strength.' });
            }
            else {
                seterror({ passwordError: "" });
            }
        }

        if (type === 'confirmPassword' || type === 'all') {
            if (!confirmPassword.current.value) {
                seterror({ confirmpasswordError: 'Please enter password.' });
            }
            else if (Password.current.value === confirmPassword.current.value) {
                seterror({ confirmpasswordError: "" });
            }
            else {
                seterror({ confirmpasswordError: "Password and confirm password should match" });
            }
        }
    }

    const onSubmit = () => {
        let details = {
            username: Name.current.value,
            password: Password.current.value,
            email: Email.current.value,
            mobile: Mobile.current.value
        }
        if (!Name.current.value && !Password.current.value && !Email.current.value && !Mobile.current.value && !confirmPassword.current.value) {
            seterror({ nameError: 'Please enter username', passwordError: 'Please enter password.', mobileError: 'Please enter mobile number.', emailError: 'Please enter email.', confirmpasswordError: 'Please enter password.' })
        }
        else {
            setDetails({ username: Name.current.value, password: Password.current.value, email: Email.current.value, mobile: Mobile.current.value })
        }
        axios.post("https://ptchatindia.herokuapp.com/register", details)
            .then(res => {
                if (res.status === 200) {
                    dispatch({
                        type: "SUBMIT_REGISTER",
                        payload: res.data.data
                    })
                    history.push("/chats")
                }
            })
    }

    return (
            <div className='login-container'>
                <div className='login-box'>
                    <p className='login-header'>Register</p>
                    <div className='login-input'>
                        <label>Username*</label>
                        <input type="text" className="input-change" placeholder="Enter Username..." ref={Name} onBlur={() => LoginData('Name')} />
                        {error && <div className='error-msg'>{error.nameError}</div>}
                    </div>
                    <div className='login-input'>
                        <label>Email*</label>
                        <input type="text" className="input-change" placeholder="Enter Email..." ref={Email} onBlur={() => LoginData('Email')} />
                        {error &&  <div className='error-msg'>{error.emailError}</div>}
                    </div>
                    <div className='login-input'>
                        <label>Mobile*</label>
                        <input type="number" className="input-change" placeholder="Enter Mobile..." ref={Mobile} onBlur={() => LoginData('Mobile')} />
                        {error &&  <div className='error-msg'>{error.mobileError}</div>}
                    </div>
                    <div className='login-input'>
                        <label>Password*</label>
                        <input type="password" placeholder="Enter password..." className="input-change" ref={Password} onBlur={() => LoginData('Password')} />
                        {error &&  <div className='error-msg'>{error.passwordError}</div>}
                    </div>
                    <div className='login-input'>
                        <label>ConfirmPassword*</label>
                        <input type="password" placeholder="Enter password..." className="input-change" ref={confirmPassword} onBlur={() => LoginData('confirmPassword')} />
                        {error &&  <div className='error-msg'>{error.confirmpasswordError}</div>}
                    </div>
                    <ProfileUploader/>
                    <div>*Please fill mandatory fields</div>
                    <div className='login-submit'>
                        <button className='login-button' onClick={onSubmit}>Register</button>
                    </div>
                    <div className='register'>
                        <Link style={{ color: '#ffffff' }} to='/login'>Login</Link>
                    </div>
                </div>
            </div>
    )
}


