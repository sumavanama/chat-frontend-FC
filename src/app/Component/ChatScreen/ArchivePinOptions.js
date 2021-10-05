import { React, Component, useState } from 'react'
import "./chatscreen.css";
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
function  ArchivePinOptions(props) {
    
    
    
  
return (
   
      <div className='mainDiv'>
        <div className='optionsFor' >
          <div className='showOptions' >
            {props.type === 'archive-pin' && <div onClick={() => { props.archiveMessage(props.id, props.index) }} className='item-1' >Archive</div>}
            
           {props.type === 'unarchive' && <div className='item-2' onClick={() => { props.unArchiveMessage(props.id, props.index) }} >Unarchive</div>}
           {props.type === 'archive-pin' && <div className='item-2'>Pin</div>}
          </div>
        </div>
      </div>
    )
  }




export default ArchivePinOptions;
