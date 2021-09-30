import React from 'react'

export default function MessagePopup() {
    return (
        <div>
                    <div className={(this.props.type==="right")? 'messagepopup-right': 'messagepopup-left'} >
                    <div className="messagepopup-items">Reply</div>
                    <div className="messagepopup-items">Forward Message</div>
                    <div className="messagepopup-items">Delete Message</div>
                    <div className="messagepopup-items">Star Messages</div>
                </div>
                </div>
    )
}
