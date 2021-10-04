import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import './chatscreen.css';
import Header from '../Common/Header';
import { BsChatDots } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';
import menu from '../../../assets/three-dots-vertical.svg';
import { loaderService } from '../../../service/loaderService';

export default function Chatscreen() {

    const [Data, setData] = useState([]);
    const[hideMenu,sethideMenu]=useState(false);
    const [isEmpty, setisEmpty] = useState(false);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const history = useHistory();
    loaderService.hide();
    useEffect(() => {
        getContacts();
    },[])

    const getContacts = () => {
        axios
            .request({
                method: "POST",
                url: `https://ptchatindia.herokuapp.com/conversations`,
                headers: {
                    authorization: user.userDetails.token,
                },
                data: {
                    username: user.userDetails.username,
                    is_archive: 0
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    if (res.data.data && res.data.data.length) {
                        let details = [];
                        res.data.data.map((userData) => {
                            details.push(userData)
                        })
                        setData(details);

                    }
                    else {
                        setisEmpty(true);
                    }
                }
            })
    }
   
    const open = (user) => {
        dispatch({
            type: "CREATE_CLIENT",
            payload: user
        })
        history.push("/ChatRoom");
    };

    const getTimeByTimestamp = (timestamp) => {
        let date = new Date(timestamp * 1000);
        let ampm = date.getHours() >= 12 ? 'pm' : 'am';
        let hours = date.getHours() >= 12 ? date.getHours() - 12 : date.getHours();
        return hours + ":" + date.getMinutes() + ampm;
    }

    const getDurationByTimestamp = (timestamp) => {
        let date = new Date(timestamp * 1000);
        let days = (new Date() - new Date(date.getFullYear(), date.getMonth(), date.getDate())) / (1000 * 60 * 60 * 24);
        days = Math.floor(days);
        let weeks = Math.floor(days / 7);
        let months = Math.floor(days / 30);
        let years = Math.floor(days / 365);
        if (days === 0) return 'Today';
        else if (days === 1) return 'Yesterday';
        else if (days < 8) return (days.concat('days', 'ago'));
        else if (weeks === 1) return (weeks.concat('week', 'ago'));
        else if (weeks < 6) return (weeks.concat(' weeks', ' ago'));
        else if (months === 1) return (months.concat(' month', ' ago'));
        else if (months < 13) return (months.concat(' months', ' ago'));
        else if (years === 1) return (years.concat(' year', ' ago'));
        else return (years.concat(' years', ' ago'));
    }
    const hideMenuBar = () => {
       sethideMenu(value=>!value);
    }
    const selectContact = () => {
        history.push({
            pathname: "/contacts"
        })
    }

    const latestMessaage = (msgs) => {
        let latestMessage = '';
        msgs.forEach((msg, index) => {
            if (msg.is_delete === undefined) {
                latestMessage = msg.message;
            }
        })
        return latestMessage;
    }

    return (
        <div>
            <div className="entire-area">
            <Header title="Conversations" callBack={hideMenuBar}/>
            <div className={hideMenu ? "menu-active":null}>
                {isEmpty && <div> No Conversations Found</div>}
                <div className="chats">
                    {Data.map((user, index) => {
                        return (
                            user.messages && !!user.messages.length &&
                            <div key={index} className="contact" >
                                <div className="profile-img">
                                    <img src={user.client.profile} className="image" alt='profile-img'></img>
                                </div>
                                <div className="text profile-nm" onClick={() => {
                                    open(user.client);
                                }}>
                                    <div className="profile-name">
                                        {user.client.username}
                                    </div>
                                    <p>{latestMessaage(user.messages)}</p>
                                </div>
                                <div className="profile-time">
                                    <div>
                                        {getDurationByTimestamp(user.latest.timestamp) === 'Today'?<div>{getTimeByTimestamp(user.latest.timestamp)}</div>:<div>{getDurationByTimestamp(user.latest.timestamp)}</div>}
                                    </div>
                                </div>
                                <div className="archive-submit">
                                    <img className="archive-button" src={menu} alt='archive-button' ></img>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="contacts-footer">
                    <div className="chats-position">
                        <div className="chats-button" onClick={() => { selectContact() }}>
                            <BsChatDots />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

