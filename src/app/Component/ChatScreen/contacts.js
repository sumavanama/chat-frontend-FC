import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import './chatscreen.css';
export default function Contacts(props) {
    const [states, setStates] = useState({
        Data: null,
        extendpic: false,
        extendpicid: 0,
        backgroundblur: false,
        user: null
    })

    const user = useSelector(state => state.user);
    const dispatch = useDispatch()
    const history = useHistory();

    useEffect(() => {
        getContacts();
    }, []);

    const getContacts = () => {
        axios
            .request({
                method: "POST",
                url: `https://ptchatindia.herokuapp.com/contacts`,
                headers: {
                    authorization: user.userDetails.token,
                },
            })
            .then((res) => {
                let details = [];
                res.data.map((users, index) => {
                    if (users.username === user.userDetails.username) {
                        setStates({ ...states, user: user })
                        index = index;
                    }
                    else {
                        details.push(users);
                    }
                });
                setStates({ ...states, Data: details })
            });
    }
    const showpic = (id) => {
        if (states.extendpic === false) {
            document.getElementById('blur1').style.filter = 'blur(4px)'
            setStates({ ...states, extendpic: true, extendpicid: id, backgroundblur: true })
        }
        else {
            if (states.extendpicid === id) {
                document.getElementById('blur1').style.filter = ''
                setStates({ ...states, extendpic: false, backgroundblur: false })
            }
        }
    }
    const closePopUp = () => {
        document.getElementById('blur1').style.filter = ''
        setStates({ extendpic: false, backgroundblur: false })
    }
    const open = (user) => {
        dispatch({
            type: "CREATE_CLIENT",
            payload: user
        })
        history.push("/ChatRoom");
    };
    return (
        <div className='entire-area'>
            <div className="chats">
                {states.extendpic ? <img className="extendedimage" onClick={closePopUp} src={states.Data[states.extendpicid]['profile']} alt="profile" width="120px" height="100px" /> : ""}
                <div className={states.backgroundblur ? 'background-inactive' : null} >
                    <div id="blur1">
                        <div>
                            {states.Data && !!states.Data.length && states.Data.map((user, index) => {
                                return (
                                    <div key={index} className="contact">
                                        <div className="profile-img">
                                            <img onClick={() => showpic(index)} src={user.profile} alt="profile" className="image"></img>
                                        </div>
                                        <div className="text profile-nm">
                                            <h2 onClick={() => open(user)}>
                                                {user.username}
                                            </h2>
                                        </div>
                                    </div>
                                );
                            })}</div>
                    </div>
                </div>
            </div>
        </div>

    );
}
