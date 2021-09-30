import React,{useState,useEffect} from 'react'
import "./../ChatScreen/chatscreen.css";
//import Header from "../Common/Header";
import axios from "axios";
import { connect } from "react-redux";
//import { createClient } from "../../actions/actions";
import { loaderService } from "../../../service/loaderService";
//import CatchError from "../CatchError/CatchError";
//import Unarchive from './../../../assests/Unarchive.svg';
//import menu from './../../../assests/three-dots-vertical.svg'
//import ArchivePinOptions from "../ChatScreen/ArchivePinOptions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom';
export default function ArchivedMessages(props) {
   const[ state,setState] =useState({
        data: null,
        user: props.location.state && props.location.state.user,
        menu: false,
        settingDetails: false,
        isEmpty: false,
        catchError: false,
        hideMenu: false,
        temp:-1
    });
    const details = useSelector((state)=>state.user.userDetailsdetails);
    const dispatch = useDispatch();
    const history = useHistory();


   




const getContacts = () => {
    if (!state.catchError) {
        axios
            .request({
                method: "POST",
                url: `https://ptchatindia.herokuapp.com/conversations`,
                headers: {
                    authorization: props.user.token,
                },
                data: {
                    username: props.user.username,
                    is_archive: 1,
                },
                
            })
           
            .then((res) => {
                
                if (res.status === 200) {
                    if (res.data.data && res.data.data.length) {
                        let details = [];
                        res.data.data.map((user) => {
                            if (user.username !== props.user.username) {
                                details.push(user);
                            }
                        });
                        setState({ ...state,data:details });
                        loaderService.hide();
                    }
                    else {
                        setState({...state, isEmpty: true });
                        loaderService.hide();
                    }
                }
            })
            .catch((err) => {
                if (err.response.status != 200) {
                    loaderService.hide();
                    setState({ ...state,catchError: !state.catchError })
                }
            })
    };
    
}
useEffect(()=>getContacts(),[])
const open = (user) => {
    props.createClient(user);
    props.history.push({
        pathname: "/ChatRoom",
    });
};
const settings = () => {
    setState({...state, menu: true });
};
const settingDetails = () => {
    setState({...state, settingDetails: true });
};
const cancel = () => {
    setState({...state, menu: false, settingDetails: false });
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

const unArchiveMessage = (id,index) => {
   let data=state.data;
    data[index].optionsShow=false;
    axios
        .request({
            method: "POST",
            url: `https://ptchatindia.herokuapp.com/remove_archive`,
            headers: {
                authorization: props.user.token,
            },
            data: {
                username: props.user.username,
                roomIds: [id],
            },
        }).then((res) => {
        }).catch((error) => console.log(error))
setState({...state,data:data})
}
const showOptions=(index)=>
{
    let data=state.data;
    let temp=state.temp;
    if(data[index].optionsShow)
    {
    data[index].optionsShow=false;
    }
    else
    {
        if(index!==temp && temp>=0)
        {
            if(data[temp])
            data[temp].optionsShow=false;
        }
        data[index].optionsShow=true;
        temp=index;
    }
    temp=index;
    setState({...state,data:data,temp:temp});
}


const hideMenuBar = () => {
    setState({...state, hideMenu: !state.hideMenu });
}

    return (
        <div className="entire-area">
        
        <div>
            <div className={state.hideMenu?"menu-active":"chats"}>
                {state.isEmpty && <div>No conversations found</div>}
                {!state.catchError ? <div>
                    {state.data && !!state.data.length && state.data.map((user, index) => {
                        return (
                            user.messages && !!user.messages.length &&
                            <div key={index} className="contact">
                                <div className="profile-img">
                                    <img src={user.client.profile} className="image"></img>
                                </div>
                                <div className="text profile-nm"  onClick={() => {
                                open(user.client);
                            }}>
                                    <div className="profile-name">
                                        {user.client.username}
                                    </div>
                                    <p>{user.latest.message}</p>
                                </div>
                                <div className="profile-time">{getTimeByTimestamp(user.latest.timestamp)}</div>
                             <div className='archive-submit'>
                                    <img className='archive-button'  onClick={()=>{showOptions(index)}} src=''></img></div>
                                    
                            </div>

                        );
                    })}</div> : null}
            </div>
        </div>
    </div>
);
                
}

