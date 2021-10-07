import React, { useState, useEffect } from 'react';
import './Header.css';
import menu from '../../../assets/three-dots-vertical.svg';
import Options from './Options';
import Profile from './Profile';
import { BsList } from 'react-icons/bs';
import { BsXCircleFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { SideBarData } from './SideBarData';
import { useSelector, useDispatch } from 'react-redux';
import ReactNotifications, { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { getSocket } from '../../../service/socket';
import NotificationSound from "../Common/NotificationSound";

let socket = null;
export default function Header(props) {
    const [isShowOptions, setShowOptions] = useState(false);
    const [isShowProfile, setShowProfile] = useState(false);
    const [searchButton, setSearchButton] = useState(false);
    const [contactsData, setContactsData] =useState([])
    const [searchIcon, setSearchIcon] = useState(props.title === "Contacts" ? true : false);
    const [sidebar, setSidebar] = useState(false);
    let searchContact = React.createRef();
    const user = useSelector((state) => state.user.userDetails)
    const dispatch = useDispatch()
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

    const showProfile = () => {
        setShowProfile(value => !value);
        setShowOptions(value => !value);
    }

    const showOptions = () => {
        setShowOptions(value => !value);
        setShowProfile(value => value);
    }

    const showSearchbar = () => {
        dispatch({
            type: "SEARCH_DATA",
            payload: []
        })
        setSearchButton(searchButton ? false : true);
        setContactsData(props.usersData)

    }
    const showSearch = () => {
        let searchValue = searchContact.current.value;
        let result = [];
        if (searchValue.length > 0) {
            if (isNaN(searchValue)) {
                searchValue = searchValue.toLowerCase();
                result = contactsData.filter((data) => {
                    return data.username.toLowerCase().includes(searchValue);
                });
            }
            else {
                searchValue = parseInt(searchValue);
                result = contactsData.filter((data) => {
                    return data.mobile.includes(searchValue);
                });
            }
        }
        if (searchValue.length !== 0 && result.length === 0) {
            result[0] = "notFound"
        }
        dispatch({
            type: "SEARCH_DATA",
            payload: result
        })

    }

    const showSidebar = () => {
        setSidebar(value => !value);
        props.callBack();
    }

    return (
        <div>
            {notificationSound ? <NotificationSound /> : null}
            <div className='menu-bars'>
                <BsList onClick={showSidebar} />
            </div>
            <div className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items' >
                    <div className='close-icon'>
                        <BsXCircleFill onClick={showSidebar} />
                    </div>
                    <div className='menu-bars'></div>
                    <div>
                        {SideBarData.map((data, index) => {
                            return (
                                <li key={index} className={data.cName}>
                                    <Link to={data.path}>
                                        <span style={{ padding: '9px' }}>{data.icon}</span>
                                        <span>{data.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </div>
                </ul>
            </div>
            <div className="common-header">
                <div className="header-profile" >
                    <img className="header-image" src={user.profile} alt="profile" />
                </div>
                <div className="header-name">{props.title}</div>
                <div className='header-search'>{searchButton && <input className="searchInput" autoFocus type="search" placeholder="Search contact's here" onChange={showSearch} ref={searchContact} />}
                    {searchIcon ? <img className="searchButton" src="https://img.icons8.com/material-rounded/50/ffffff/search.png" onClick={showSearchbar} alt="serachIcon" /> : null}</div>
                <div className="header-menu">
                    <img src={menu} style={{ cursor: 'pointer' }} alt="menu" onClick={() => { showOptions() }} />
                </div>
                {isShowOptions && <Options showProfile={showProfile}
                    onClose={() => setShowOptions(false)} />}
                {isShowProfile && <Profile onClose={() => setShowProfile(false)} />}
                <ReactNotifications />
            </div>
        </div>
    )
}
