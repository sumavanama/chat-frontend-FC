import React, { useState, useEffect } from 'react';
import { BsChevronLeft } from 'react-icons/bs';
import HeaderOptions from './HeaderOptions';
import './ClientHeader.css';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import menu from '../../../assets/three-dots-vertical.svg';
import ReactNotifications, { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { getSocket } from '../../../service/socket';
import NotificationSound from "../Common/NotificationSound";

let socket = null;

function ClientHeader(props) {
    const [isShowOptions, setisShowOptions] = useState(false);
    const [isShowProfile, setisShowProfile] = useState(false)
    const history = useHistory();
    const user = useSelector(state => state.user)
    const handleBack = () => {
        history.push("/chats");
    }
    const showOptions = () => {
        setisShowOptions(value => !value);
    }
    const [notificationSound, setNotificationSound] = useState(false);

    useEffect(() => {
        socket = getSocket();
        socket.emit("notifications", { username: user.username });
        socket.on("notification", onNotification);
    }, []);

    useEffect(() => {
        return () => {
            socket.off("notification", onNotification);
        }
    }, []);

    const onNotification = (data) => {
        store.addNotification({
            title: data.username,
            message: data.message,
            type: 'default',
            container: 'top-right',
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 3000,
                onScreen: true
            }
        });
        setNotificationSound(true);
    }

    return (
        <div className="client-common-header">
            {notificationSound ? <NotificationSound /> : null}
            <div style={{ marginLeft: '-2rem' }}>
                <BsChevronLeft className='back-arrow' onClick={handleBack} />
            </div>
            <div className="client-header-profile">
                <img className="client-header-image" src={user.userDetails.profile} alt="profile" />
            </div>
            <div className="client-header-name">{props.title}</div>
            <div className="client-header-menu">
                <img src={menu} style={{ cursor: 'pointer', height: '2.1rem' }} alt="menu" onClick={showOptions} />
            </div>
            {isShowOptions && <HeaderOptions onClose={() => { setisShowOptions(value => !value) }} />}
            <ReactNotifications />
        </div>
    )
}

export default ClientHeader;
