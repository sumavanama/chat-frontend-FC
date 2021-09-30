import React, {useState,useEffect} from 'react';
import './Header.css';
import { connect } from 'react-redux';
import menu from '../../../assests/three-dots-vertical.svg';
import Options from './Options';
import Profile from './Profile';
//import { socketConnect } from '../../../service/socket';
import ReactNotifications, { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { contacts, searchData } from "../../actions/actions";
import { withRouter } from 'react-router';
import { BsList } from 'react-icons/bs';
import { BsXCircleFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { SideBarData } from './SideBarData';
import NotificationSound from "../Common/NotificationSound";
function  Header(props)  {
    console.log("inside header",props);
    const[isShowOptions,setShowOptions]=useState(false);
    const[isShowProfile,setShowProfile]=useState(false);
    const[searchButton,setSearchButton]=useState(false);
    const[searchIcon,setSearchIcon]=useState(props.title === "Contacts"?true:false);
    const[onNotificationSound,setonNotificationSound]=useState(false);
    const[sidebar,setSidebar]=useState(false);
    let searchContact = React.createRef();
    // componentDidMount() {
    //     socketConnect((socket) => {
    //         this.socket = socket;
    //         this.socket.emit("notifications", { username: this.props.user.username });
    //         this.socket.on("notification", this.onNotification);
    //     });
    // }
    // useEffect(() => {
    //     socketConnect((socket) => {
    //         console.log("entering")
    //                 socket = socket;
    //                 socket.emit("notifications", { username: props.user.username });
    //                 socket.on("notification", onNotification);
    //             });
    //   }, []);
    // componentWillUnmount = () => {
    //     this.socket.off("notification", this.onNotification);
    // }
    // useEffect(() => {
    //     socket.off("notification", onNotification);
    // }, [])

   const onNotification = (data) => {
        console.log(data, "got notifications");
        store.addNotification({
            title: data.username,
            message: data.message,
            type: 'default',
            container: 'top-right',
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
                duration: 2000,
                onScreen: true
            }
        });

        setonNotificationSound(value=>!value);
       
    }
    useEffect(() => {
        
        console.log(onNotificationSound);
    }, [])

    const showProfile = () => {
        console.log(isShowOptions,isShowProfile);
        setShowProfile(value=>!value);
        setShowOptions(value=>!value);
        console.log(isShowOptions,isShowProfile);
    }

  const  showOptions = () => {
        console.log(isShowOptions,isShowProfile);
        setShowOptions(value=>!value);
        setShowProfile(value=>value);
        console.log(isShowOptions,isShowProfile);
    }
    // useEffect(() => {
    //     console.log(isShowOptions,isShowProfile);
    // })
    
    const showSearchbar = () => {
         props.searchData([]);
        setSearchButton(searchButton?false:true);
        
     }
    const showSearch = () => {
        let searchValue = searchContact.current.value;
        let result = [];
        if (searchValue.length > 0) {
            if (isNaN(searchValue)) {
                searchValue = searchValue.toLowerCase();
                result = props.usersData.filter((data) => {                    
                    return data.username.toLowerCase().includes(searchValue);
                });
            }
            else {
                searchValue = parseInt(searchValue);
                result =props.usersData.filter((data) => {
                    return data.mobile.includes(searchValue);
                });
            }
        }
        if (searchValue.length !== 0 && result.length === 0) {
            result[0] = "notFound"
        }
        console.log("in header", result[0]);
        props.searchData(result);

    }

   const showSidebar = () => {
        setSidebar(value=>!value);
        setonNotificationSound(value=>value);
        props.callBack();
    }

        return (
            
            <div>
           {onNotificationSound ? <NotificationSound /> : null}
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
                                        <span style={{padding:'9px'}}>{data.icon}</span>
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
                    <img className="header-image" src={props.user.profile} alt="profile" />
                </div>
                <div className="header-name">{props.title}</div>
                <div className='header-search'>{searchButton && <input className="searchInput" autoFocus type="search" placeholder="Search contact's here" onChange={showSearch} ref={searchContact} />}
                    {searchIcon ? <img className="searchButton" src="https://img.icons8.com/material-rounded/50/ffffff/search.png" onClick={showSearchbar} /> : null}</div> 
                <div className="header-menu">
                    <img src={menu} style={{ cursor: 'pointer' }} alt="menu" onClick={() => { showOptions() }} />
                </div>
                {isShowOptions && <Options showProfile={showProfile}
                   onClose={()=>setShowOptions(false)}  />}
                {isShowProfile && <Profile />}
                <ReactNotifications />
            </div>
            </div>
        )
    }


const mapStateToProps = (state) => ({
    user: state.user.userDetails
});
const mapDispatchToProps = (dispatch) => ({
    searchData: (data) => dispatch(searchData(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));