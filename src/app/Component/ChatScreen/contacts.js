import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import './chatscreen.css';
import Header from '../Common/Header';
import CatchError from '../CatchError/CatchError';

export default function Contacts() {
    const [properties, setProperties] = useState({
        Data:null,
        extendpic: false,
        extendpicid: 0,
        backgroundblur: false,
        user: null,
        catchError: false

    })

    const user = useSelector(state => state.user);
    const searchContactData = useSelector(state => state.user.searchContactData);
    const dispatch = useDispatch()
    const history = useHistory();
    const [hideMenu, sethideMenu] = useState(false);

    useEffect(() => {
        getContacts();
        dispatch({
            type: "SEARCH_DATA", payload: []
        })
    }, []);

    const getContacts = () => {
        if(!properties.catchError){
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
                        setProperties({ ...properties, user: user })
                        index = index;
                    }
                    else {
                        details.push(users);
                    }
                });
                
                setProperties({ ...properties, Data: details })
            })
            .catch((err) => {
                if (err.response.status != 200) {
                  setProperties({...properties,catchError:!properties.catchError})
                }
              })
        }
    }
    const showpic = (id) => {
        if (properties.extendpic === false) {
            document.getElementById('blur1').style.filter = 'blur(4px)'
            setProperties({ ...properties, extendpic: true, extendpicid: id, backgroundblur: true })
        }
        else {
            if (properties.extendpicid === id) {
                document.getElementById('blur1').style.filter = ''
                setProperties({ ...properties, extendpic: false, backgroundblur: false })
            }
        }
    }
    const closePopUp = () => {
        document.getElementById('blur1').style.filter = ''
        setProperties({ ...properties, extendpic: false, backgroundblur: false })
    }
    const open = (user) => {
        dispatch({
            type: "CREATE_CLIENT",
            payload: user
        })
        history.push("/ChatRoom");
    };
    const hideMenuBar = () => {
        sethideMenu(value => !value);
    }
    return (
        <div className='entire-area'>
            <Header title="Contacts" usersData={properties.Data && properties.Data} callBack={hideMenuBar} />
            <div className={hideMenu ? "menu-active" : "entire-area-subdiv"}>
                <div className="chats">
                    {properties.extendpic ? <img className="extendedimage" onClick={closePopUp} src={properties.Data[properties.extendpicid]['profile']} alt="profile" width="120px" height="100px" /> : ""}
                    <div className={properties.backgroundblur ? 'background-inactive' : null} >
                        {!properties.catchError ? <div>
                            <div id="blur1">
                                {searchContactData && searchContactData.length === 0 ?

                                    properties.Data && !!properties.Data.length && properties.Data.map((user, index) => {
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
                                    }) :
                                    <div><h3>Search Results</h3>
                                        {searchContactData && searchContactData[0] === "notFound" ? <h1 style={{ textAlign: "center", paddingTop: "10%" }}>User Not Found</h1> :
                                            <div>
                                                {searchContactData && searchContactData.map((user, index) => {
                                                    return (
                                                        <div key={index} className="contact">
                                                            <div className="profile-img">
                                                                <img src={user.profile} className="image"></img>
                                                            </div>
                                                            <div className="text profile-nm">
                                                                <h2
                                                                    onClick={() => {
                                                                        this.open(user);
                                                                    }}
                                                                >
                                                                    {user.username}
                                                                </h2>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                                }</div>
                                        }
                                    </div>
                                }
                            </div>
                        </div> : <CatchError callBack={getContacts} />}
                    </div>
                </div>
            </div>
        </div>
    );
}


