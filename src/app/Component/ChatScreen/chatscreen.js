import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import './chatscreen.css';
import Header from '../Common/Header';
import { BsChatDots } from 'react-icons/bs';
import { useHistory } from 'react-router-dom';
import menu from '../../../assets/three-dots-vertical.svg';
import { loaderService } from '../../../service/loaderService';
import ArchivePinOptions from "./ArchivePinOptions";
import { AiFillPushpin } from "react-icons/ai";
import { socketConnect } from '../../../service/socket';

export default function Chatscreen(props) {

    const [Data, setData] = useState([]);
    const [hideMenu, sethideMenu] = useState(false);
    const [isEmpty, setisEmpty] = useState(false);
    const [contactData, setContactData] = useState({
        contactData: [],
        temp: -1,
        chooseOption: false,

    });

    const user = useSelector(state => state.user);
    const pin_data = useSelector(state => state.user.pin_data);
    const dispatch = useDispatch();
    const history = useHistory();
    loaderService.hide();
    useEffect(() => {
        getContacts();
        socketConnect((socket) => {
            socket = socket;
            socket.emit("notifications", { username: user.username });
            socket.on("notification", onNotification);
        });
    }, [])

    useEffect(() => {
        return () => {
            socketConnect((socket) => {
                socket.off("notification", onNotification);
            });
        }
    }, [])

    const onNotification = () => {
        getContacts();
    }

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
                            if (userData.client.username !== user.client.username) {
                                Object.assign(userData, { popUp: false })
                                let found = 0;
                                let pin = pin_data;
                                if (pin.length === 0) {
                                    details.push(userData);
                                }
                                else {
                                    for (let i = 0; i < pin.length; i++) {
                                        if (userData.id === pin[i].id)
                                            found = 1
                                    }
                                    if (found === 0) {
                                        details.push(userData);
                                        found = 0
                                    }
                                    else {
                                        found = 0
                                        details.unshift(userData);
                                    }

                                }
                            }
                        });
                        setData(details);

                    }
                    else {
                        setisEmpty(true);
                    }
                }
            })
    }
    const archiveMessage = (id, index) => {
        let data = Data;
        data[index].optionsShow = false;
        axios
            .request({
                method: "POST",
                url: `https://ptchatindia.herokuapp.com/archive`,
                headers: {
                    authorization: user.userDetails.token,
                },
                data: {
                    username: user.userDetails.username,
                    roomIds: [id],
                },
            }).then((res) => {
            })
        data.splice(index, 1)
        setData(PrevData => [...PrevData, Data]);
    };

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
        sethideMenu(value => !value);
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

    const pinContact = (obj) => {
        let pin = pin_data;
        let contacts = Data;
        if (pin.length < 3) {
            pin.push(obj)
            let temp = [], index = 0;
            for (let i = 0; i < contacts.length; i++) {
                if (contacts[i].id === obj.id) {
                    contacts[i].optionsShow = false;
                    temp = contacts.splice(i, 1);
                }
            }
            contacts.unshift(temp[0])
            dispatch({
                type: "PIN_CONVERSATION",
                payload: pin
            })
            setContactData({ chooseOption: true, });
            setData(contacts)
        }
        else {
            setContactData({ chooseOption: true });
            setData(contacts)
        }
    }

    const unPinContact = (obj) => {
        let pin = pin_data;
        let contacts = Data;
        for (let i = 0; i < contacts.length; i++) {
            if (contacts[i].id === obj.id) {
                contacts[i].optionsShow = false;
                contacts.splice(i, 1);
            }
        }
        for (let i = 0; i < pin.length; i++) {
            if (pin[i].id === obj.id)
                pin.splice(i, 1);
        }
        contacts.push(obj);
        dispatch({
            type: "PIN_CONVERSATION",
            payload: pin
        })
        setContactData({ chooseOption: true, });
        setData(contacts)
    }

    const isPin = (obj) => {
        let pin = pin_data;
        let found = -1
        for (let i = 0; i < pin.length; i++) {
            if (pin[i].id === obj.id)
                found = 1;
        }
        if (found === -1) { return false; }
        else return true;
    }

    const showOptions = (index) => {
        let data = Data;
        let temp = contactData.temp;
        if (data[index].optionsShow) {
            data[index].optionsShow = false;
        }
        else {
            if (index !== temp && temp >= 0) {
                if (data[temp])
                    data[temp].optionsShow = false;
            }
            data[index].optionsShow = true;
            temp = index;
        }
        temp = index;
        setContactData({ temp: temp });
        setData(data)
    }

    return (
        <div>
            <div className="entire-area">
                <Header title="Conversations" callBack={hideMenuBar} />
                <div className={hideMenu ? "menu-active" : null}>
                    {isEmpty && <div style={{textAlign:"center"}}> No Conversations Found</div>}
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
                                            {getDurationByTimestamp(user.latest.timestamp) === 'Today' ? <div>{getTimeByTimestamp(user.latest.timestamp)}</div> : <div>{getDurationByTimestamp(user.latest.timestamp)}</div>}
                                        </div>
                                    </div>
                                    <div className="archive-submit">
                                        <img className="archive-button" src={menu} onClick={() => { showOptions(index) }} ></img>
                                        <div>{isPin(user) ? <div><p style={{ color: "white" }}><AiFillPushpin size={25} /></p></div> : null}</div>
                                        {Data[index].optionsShow && <ArchivePinOptions id={Data[index].id} pinCallBack={pinContact} unPinCallBack={unPinContact} obj={user} index={index} archiveMessage={archiveMessage} type='archive-pin' />}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="contacts-footer">
                        <div className="chats-button" onClick={() => { selectContact() }}>
                            <BsChatDots />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

