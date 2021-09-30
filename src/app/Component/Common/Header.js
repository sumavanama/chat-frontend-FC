import React, {useState} from 'react';
import './Header.css';
import menu from '../../../assets/three-dots-vertical.svg';
import Options from './Options';
import Profile from './Profile';
import { BsList } from 'react-icons/bs';
import { BsXCircleFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { SideBarData } from './SideBarData';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
function  Header(props)  {
    const[isShowOptions,setShowOptions]=useState(false);
    const[isShowProfile,setShowProfile]=useState(false);
    const[searchButton,setSearchButton]=useState(false);
    const[searchIcon,setSearchIcon]=useState(props.title === "Contacts"?true:false);
    const[sidebar,setSidebar]=useState(false);
    let searchContact = React.createRef();

    const showProfile = () => {
        setShowProfile(value=>!value);
        setShowOptions(value=>!value);
    }

  const  showOptions = () => {
        setShowOptions(value=>!value);
        setShowProfile(value=>value);
    }

    const showSearchbar = () => {
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
        props.callBack();
    }

        return (   
            <div>
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
                    {searchIcon ? <img className="searchButton" src="https://img.icons8.com/material-rounded/50/ffffff/search.png" onClick={showSearchbar} alt="serachIcon"/> : null}</div> 
                <div className="header-menu">
                    <img src={menu} style={{ cursor: 'pointer' }} alt="menu" onClick={() => { showOptions() }} />
                </div>
                {isShowOptions && <Options showProfile={showProfile}
                   onClose={()=>setShowOptions(false)} />}
                {isShowProfile && <Profile />}
            </div>
            </div>
        )
    }

const mapStateToProps = (state) => ({
        user: state.user.userDetails
});
    
export default connect(mapStateToProps,null )(withRouter(Header));
