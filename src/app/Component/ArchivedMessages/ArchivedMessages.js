import React, { useState, useEffect } from 'react'
import "./../ChatScreen/chatscreen.css";
import Header from "../Common/Header";
import axios from "axios";
import { connect } from "react-redux";
import { loaderService } from "../../../service/loaderService";
import menu from '../../../assets/three-dots-vertical.svg';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
import ArchivePinOptions from '../ChatScreen/ArchivePinOptions';
export default function ArchivedMessages(props) {
    const [state, setState] = useState({
        data: null,
        menu: false,
        settingDetails: false,
        isEmpty: false,
        catchError: false,
        hideMenu: false,
        temp: -1
    });
    const user = useSelector(state => state.user)
    const dispatch = useDispatch();
    const history = useHistory();
    const getContacts = () => {
        if (!state.catchError) {
            axios
                .request({
                    method: "POST",
                    url: `https://ptchatindia.herokuapp.com/conversations`,
                    headers: {
                        authorization: user.userDetails.token,
                    },
                    data: {
                        username: user.userDetails.username,
                        is_archive: 1,
                    },

                })

                .then((res) => {

                    if (res.status === 200) {
                        if (res.data.data && res.data.data.length) {
                            let details = [];
                            res.data.data.map((user1) => {
                                if (user1.username !== user.userDetails.username) {
                                    details.push(user1);
                                }
                            });
                            setState({ ...state, data: details });

                        }
                        else {
                            setState({ ...state, isEmpty: true });

                        }
                    }
                })

        };

    }
    useEffect(() => getContacts(), [])
    const open = (user) => {
        props.createClient(user);
        props.history.push({
            pathname: "/ChatRoom",
        });
    };
    const settings = () => {
        setState({ ...state, menu: true });
    };
    const settingDetails = () => {
        setState({ ...state, settingDetails: true });
    };
    const cancel = () => {
        setState({ ...state, menu: false, settingDetails: false });
    };
    const selectContact = () => {
        props.history.push({
            pathname: "/contacts"
        })
    }

    const getTimeByTimestamp = (timestamp) => {
        let date = new Date(timestamp * 1000);
        let ampm = date.getHours() >= 12 ? 'pm' : 'am';
        let hours = date.getHours() >= 12 ? date.getHours() - 12 : date.getHours();
        return hours + ":" + date.getMinutes() + ampm;
    }

    const unArchiveMessage = (id, index) => {
        let data = state.data;
        data[index].optionsShow = false;
        axios
            .request({
                method: "POST",
                url: `https://ptchatindia.herokuapp.com/remove_archive`,
                headers: {
                    authorization: user.userDetails.token,
                },
                data: {
                    username: user.userDetails.username,
                    roomIds: [id],
                },
            }).then((res) => {
            }).catch((error) => console.log(error))
        data.splice(index, 1)
        setState({ ...state, data: data })
    }
    const showOptions = (index) => {

        let Temp = state.temp;
        if (state.data[index].optionsShow) {
            state.data[index].optionsShow = false;
        }
        else {
            if (index !== Temp && Temp >= 0) {
                if (state.data[Temp])
                    state.data[Temp].optionsShow = false;
            }
            state.data[index].optionsShow = true;
            Temp = index;
        }
        Temp = index;
        //setState(Prevdata=>[...Prevdata,state.data]);
        setState({ ...state, data: state.data })
        setState({ ...state, temp: Temp });



    }


    const hideMenuBar = () => {
        setState({ ...state, hideMenu: !state.hideMenu });
    }
    return (
        <div className="entire-area">
            <Header title="Archived Messages" callBack={hideMenuBar} />
            <div>
                <div className={state.hideMenu ? "menu-active" : "chats"}>
                    {state.isEmpty && <div style={{textAlign:"center"}}>No conversations found</div>}
                    {!state.catchError ? <div>
                        {state.data && !!state.data.length && state.data.map((user, index) => {
                            return (
                                user.messages && !!user.messages.length &&
                                <div key={index} className="contact">
                                    <div className="profile-img">
                                        <img src={user.client.profile} className="image"></img>
                                    </div>
                                    <div className="text profile-nm" onClick={() => {
                                        open(user.client);
                                    }}>
                                        <div className="profile-name">
                                            {user.client.username}
                                        </div>
                                        <p>{user.latest.message}</p>
                                    </div>
                                    <div className="profile-time">{getTimeByTimestamp(user.latest.timestamp)}</div>
                                    <div className='archive-submit'>
                                        <img className='archive-button' onClick={() => { showOptions(index) }} src={menu}></img></div>
                                    {user.optionsShow && <ArchivePinOptions type='unarchive' id={user.id} unArchiveMessage={unArchiveMessage} index={index} />}
                                </div>

                            );
                        })}</div> : null}
                </div>
            </div>
        </div>
    )
}