import React from 'react'

export default function MessagePopup(props) {
    const deleteMessage=(msgid)=>
    {
     props.socket.on('messages',props.onMessages);
        props.socket.emit("delete", { username:props.userName, client:props.clientName, messageId:msgid });
        props.socket.once('messages',props.onMessages);
    }
    return (
        <div>
            <div className={(props.type === "right") ? 'messagepopup-right' : 'messagepopup-left'} >
                <div className="messagepopup-items"onClick={()=>{props.replyMsg(props.indexValue)} }>Reply</div>
                <div className="messagepopup-items" onClick={()=>{props.forwardMessage()}}>Forward Message</div>
                <div className="messagepopup-items"onClick={()=>{props.deleting()}}>Delete Message</div>
            </div>
        </div>
    )
}
