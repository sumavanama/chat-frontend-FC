import React from 'react';
import "./chatscreen.css";
import { useSelector } from 'react-redux';

export default function ArchivePinOptions(props) {
    const pin_data=useSelector(state=>state.user.pin_data);
    const isPin = () => {
        let obj = props.obj;
        let pin = pin_data;
        let found = -1
        for (let i = 0; i < pin.length; i++) {
          if (pin[i].id === obj.id)
            found = i;
        }
        if (found === -1) return false;
        else return true;
      }

      const setPin = (type) => {
        let obj = props.obj;
        if (type === 'pin') {
          props.pinCallBack(obj);
        }
        else if (type === 'unpin') {
          props.unPinCallBack(obj)
        }
      }

    return (
        <div className='mainDiv'>
        <div className='optionsFor' >
          <div className='showOptions' >
            {props.type === 'archive-pin' && <div onClick={() => {props.archiveMessage(props.id, props.index) }} className='item-1' >Archive</div>}
            {props.type === 'unarchive' && <div className='item-2' onClick={() => {props.unArchiveMessage(props.id, props.index) }} >Unarchive</div>}
            <div style={{ padding: "8px" }} onClick={() => {setPin(isPin() ? "unpin" : "pin") }} >{isPin() ? "Unpin" : "Pin"}</div>
          </div>
        </div>
      </div>
    )
}
