import React from 'react';
import './ForwardMessage.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../ChatScreen/chatscreen.css';
import { getSocket } from '../../../service/socket';

let socket = null;
function ForwardMessage(props) {

    const [dataConversation, setdataConversation] = useState([]);
    const [dataContacts, setdataContacts] = useState([]);
    const user = useSelector(state => state.user)
    const client =useSelector(state=>state.user.client);

    useEffect(() => {
        socket = getSocket();
        getContacts();
        getNewContacts();
    }, [])

    const getNewContacts = async () => {
       await axios
            .request({
                method: "POST",
                url: `https://ptchatindia.herokuapp.com/contacts`,
                headers: {
                    authorization: user.userDetails.token,
                },
            })
            .then(async res => {
                let details = [];
                res.data.map((users) => {
                    if (users.username !== user.userDetails.username) {
                        details.push(users);
                    }
                }   
                );
                dataConversation.map((userConversation) => {
                    details.map((user, index) => {
                        if (userConversation.client.username === user.username) {
                            details.splice(index, 1);
                        }
                    })
                })
                setdataContacts(details);               
            }).catch((err) => {
            })
    }

    const getContacts = async () => {
        await axios
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
                        res.data.data.map((users) => {
                            if (users.username !== user.userDetails.username) {
                                details.push(users);
                            }
                        });
                        setdataConversation(details);
                    }
                }
            })
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
  const forwordUserList = [];
    const open = (user) => {
        forwordUserList.push(user);
    };

    const handleForwardMessage = () => {
        forwordUserList.map(users => {
            socket.emit('joinRoom', {
                username: user.userDetails.username,
                client2: users.username,
            });
            socket.emit("chat", {
                username: user.userDetails.username,
                client2: users.username,
                message: props.message,
            });
        })
        props.handleclose();
    }

    return (
        <div>
            <div className="popup-box">
                <div className="box">
                    <div className="forward-text">
                        <span className="close-icon-forward" onClick={props.handleclose} >X</span>
                        <h3>Forward message to</h3>
                        <div className="forward-div"><input className="forword-send" type="button" value="Send" onClick={handleForwardMessage} />
                        </div>
                    </div>
                    <div className="" style={{ paddingTop: '4rem' }}>
                        {dataConversation && !!dataConversation.length && dataConversation.map((user, index) => {
                            return (
                                user.messages && !!user.messages.length &&
                                <div key={index} className="contact" >
                                    <div className="checkbox-div"><input className="chekbox" type="checkbox" onClick={() => {
                                        open(user.client);
                                    }} /></div>

                                    <div className="forward-profile-img">
                                        <img src={user.client.profile} className="image" alt='profile-img'></img>
                                    </div>
                                    <div className="text profile-nm">
                                        <div className="profile-name">

                                            {user.client.username}
                                        </div>
                                        <p>{user.latest.message}</p>
                                    </div>
                                    <div className="forward-profile-time">
                                        <div>
                                            {getDurationByTimestamp(user.latest.timestamp) === 'Today' && <div>{getTimeByTimestamp(user.latest.timestamp)}</div>}
                                            {getDurationByTimestamp(user.latest.timestamp) !== 'Today' && <div>{getDurationByTimestamp(user.latest.timestamp)}</div>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {dataContacts && !!dataContacts.length && dataContacts.map((user, index) => {
                            return (
                                <div key={index} className="contact">
                                    <div className="checkbox-div"><input className="chekbox" type="checkbox" onClick={() => {
                                        open(user);
                                    }} /></div>
                                    <div className="profile-img">
                                        <img src={user.profile} className="image" alt='profile-img'></img>
                                    </div>
                                    <div className="text profile-nm">
                                        <h2>{user.username}</h2>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ForwardMessage
