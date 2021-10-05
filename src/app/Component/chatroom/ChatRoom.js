import React from 'react';
import './chatroom.css';
import Picker, { SKIN_TONE_MEDIUM_DARK } from 'emoji-picker-react';
import { getSocket } from '../../../service/socket'
import readIcon from './../../../assets/seenTick.png';
import deliveredIcon from './../../../assets/deliveredTick.png';
import ClientHeader from '../ClientDetails/ClientHeader';
import ForwardMessage from '../ForwardMessage/ForwardMessage';
import { GrEmoji } from "react-icons/gr";
import MessagePopup from './MessagePopup';
import { IoImagesOutline } from 'react-icons/io5';
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from 'react';

let socket = null;
export default function ChatRoom(props) {
  const [properties, setProperties] = useState({
    message: '',
    messages: [],
    isOponentTyping: false,
    isEmojiActive: false,
    forwardPopup: false,
    forwardingMessage: '',
    reply: false,
    Index: -1,
    reactionData: {},
    tempReaction: false
  })
  const message = useRef();
  const user = useSelector(state => state.user.userDetails);
  const client = useSelector(state => state.user.client);

  useEffect(() => {
    socket = getSocket();
    socket.emit("joinRoom", { username: user.username, client2: client.username });
    socket.on("messages", onMessages);
    socket.on("message", onMessage);
    socket.on("typing-start", onTyping);
    socket.on("typing-end", onTyping);
  }, []);

  useEffect(() => {
    return () => {
      socket.off('message', onMessage);
      socket.off('messages', onMessages);
      socket.off("typing-start", onTyping);
      socket.off("typing-end", onTyping);
    }
  }, []);

  const onTyping = (data) => {
    if (user.username !== data.username) {
      setProperties({ ...properties, isOponentTyping: data.typing });
    }
  }

  const onMessage = (data) => {
    socket.emit("read_status", { username: user.username, client2: client.username, messageIds: [data.id] })
    let msgs = properties.messages;
    Object.assign(data, { messagePopUp: false });
    msgs.push(data);
    let previousDate = null;
    setProperties({ ...properties, messages: msgs });
  }

  const onMessages = (data) => {
    let msgIds = data.messages.filter((msg) => {
      if (msg.readStatus === 0 && user.username !== msg.username)
        return msg.id;
    });
    if (msgIds && msgIds.length) {
      socket.emit("read_status", { username: user.username, client2: client.username, messageIds: msgIds });
    }
    data.messages.map((obj) => {
      Object.assign(obj, { messagePopUp: false });
    })
    setProperties({ ...properties, messages: data.messages })
    socket.off("messages", true)
  }

  const send = (index) => {
    let tempmsg = message.current.value.trim();
    if (properties.isEmojiActive) {
      setProperties({ ...properties, isEmojiActive: false });
    }
    if (index === -1) {
      if (tempmsg && tempmsg.length !== 0) {
        socket.emit("chat", {
          username: user.username,
          client2: client.username,
          message: tempmsg
        });
        message.current.value = '';
      }
      setProperties({ ...properties, reply: false });

    }
    else if (index !== -1) {
      if (tempmsg && tempmsg.length !== 0) {
        socket.emit("reply", {
          username: user.username,
          client: client.username,
          messageId: properties.messages[index].id,
          message: tempmsg
        });
        message.current.value = ''
      }
      setProperties({ ...properties, Index: -1, reply: false });
    }
  }
  const settings = () => {
    setProperties({ ...properties, menu: true })
  }

  const getTimeByTimestamp = (timestamp) => {
    let date = new Date(timestamp * 1000);
    let ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    let hours = date.getHours() >= 12 ? date.getHours() - 12 : date.getHours();
    return hours + ":" + date.getMinutes() + ampm;
  }

  let previousDate = null;
  const getDateByTimestamp = (timestamp) => {
    let date = new Date(timestamp * 1000);
    if (!previousDate) {
      previousDate = date;
      return (<div className="chatroom-date">{date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()}</div>);
    }
    else {
      if (previousDate.getDate() < date.getDate())
        return (<div className="chatroom-date">{date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()}</div>);
    }

  }
  const sendTypingStartStatus = () => {
    socket.emit("typing-start", { username: user.username, client2: client.username });
  }

  const sendTypingEndStatus = () => {
    socket.emit("typing-end", { username: user.username, client2: client.username });
  }

  const handleEmoji = () => {
    setProperties({ ...properties, isEmojiActive: !properties.isEmojiActive, tempReaction: false });
  }

  const imageUploading = (e) => {
    if (!e.target.files[0].name.match(/.(jpg|jpeg|png|gif)$/i)) {
      alert('worng format of file');
    } else {
      if (e.target.files[0].size / 1024 < 1024) {
      }
    }

  }
  const msgDisplay = () => {
    setProperties({ ...properties, reply: false, Index: -1 })
  }

  const forwardPopup = (message) => {
    setProperties({ ...properties, forwardPopup:!properties.forwardPopup, forwardingMessage: message })
  }
  //For Displaying message popup
  const showMessagePopUp = (index) => {
    let msgs = properties.messages
    for (let i = 0; i < msgs.length; i++) {
      if (i === index) {
        msgs[i].messagePopUp = !msgs[index].messagePopUp;
      } else {
        if (msgs[i].messagePopUp) {
          msgs[i].messagePopUp = !msgs[index].messagePopUp;
        }
      }
    }
    // closing message popup by clicking outside
    // function closePopup() {
    //   let message = msgs;
    //   if (message[index]) {
    //     if (msgs[index].messagePopUp) {
    //       msgs[index].messagePopUp = !msgs[index].messagePopUp;
    //     }
    //   }
    // }
    setProperties({ ...properties, messages: msgs })
  }
  let firstMsg = ''
  const onclickReply = (index) => {
    firstMsg = properties.messages[index].message
    setProperties({ ...properties, reply: true, Index: index })
  }

  const deleteMessage = (user, client, msgId) => {
    socket.emit("delete", { username: user, client: client, messageId: msgId });
  }
  const handleReaction = (obj) => {
    if (properties.isEmojiActive === false) {
      setProperties({ ...properties, reactionData: obj, isEmojiActive: !properties.isEmojiActive, tempReaction: !properties.tempReaction });
    }
    else if (properties.isEmojiActive === true) {
      setProperties({ ...properties, isEmojiActive: !properties.isEmojiActive })
    }
  }
  const userReaction = (reaction, obj) => {
    socket.emit("reaction", { username: user.username, client: client.username, messageId: obj.id, reaction: reaction })
    socket.once('messages', onMessages);
    setProperties({ ...properties, reactionData: {}, isEmojiActive: !properties.isEmojiActive, tempReaction: !properties.tempReaction });
  }
  const removeReaction = (obj) => {
    socket.emit("reaction", { username: user.username, client: client.username, messageId: obj.id })
    socket.once('messages', onMessages);
  }

  return (
    <>
      {properties.forwardPopup ? <ForwardMessage message={properties.forwardingMessage} handleclose={forwardPopup} /> :
        <div className='chat-room' >
          <ClientHeader title={client.username} />
          {/* <div className='msg-container' onClick={()=>{closePopup()}}> */}
          <div className='msg-container'>
            {properties.messages && !!properties.messages.length && properties.messages.map((message, index) => {
              return (<div className='message-field' key={index}>
                {getDateByTimestamp(message.timestamp)}
                {message.username === user.username && message.message ?
                  (<div className="msg-field-container">
                    <span className='msg-right'><span className="popup" alt="dots" onClick={() => { showMessagePopUp(index) }}>&#8942;</span>
                      {message.hasOwnProperty('replyId') ?
                        <div>
                          {properties.messages && properties.messages.map((firstmsg, index) => {
                            return (
                              <div key={index} >
                                {message.replyId === firstmsg.id ?
                                  <div>
                                    <div className='reply-msg-style'><div className='right-username-style'><b>{firstmsg.username}</b></div><span className='first-msg-style'>{firstmsg.message}</span> </div>
                                    <span >{message.message}</span>
                                  </div> : null}
                              </div>
                            )
                          })}
                        </div>
                        : <span >{message.message}</span>}
                    </span>
                    {properties.messages && message.reaction ? <div className='msg-right-reaction'>{message.reaction}</div> : null}
                    {message.messagePopUp && <MessagePopup type="right" forwardMessage={() => forwardPopup(message.message)} socket={socket} indexValue={index} replyMsg={onclickReply} deleting={() => deleteMessage(user.username, client.username, message.id)} />}
                    <span className='msg-time-right'>{getTimeByTimestamp(message.timestamp)}</span>
                    < span className='msg-time-right'>{message.readStatus ? <img src={readIcon} /> : <img src={deliveredIcon} />}</span>
                  </div>) :
                  message.message && (<div className="msg-field-container aln-left">
                    <span className='msg-left'><span className="popup" alt="dots" onClick={() => { showMessagePopUp(index) }}>&#8942;</span>{message.hasOwnProperty('replyId') ?
                      <div>
                        {properties.messages.map((firstmsg) => {
                          return (
                            <div>
                              {message.replyId === firstmsg.id ? <div onClick={() => { handleReaction(message) }}><div className='left-reply-msg-style'>
                                <div className='left-username-style'><b>{firstmsg.username}</b></div>
                                <div><span className='first-msg-style'>{firstmsg.message}</span> </div></div>

                                <span>{message.message}</span>
                              </div> : null}
                            </div>
                          )
                        })

                        }
                      </div>

                      : <span className='message-onclick' onClick={() => { handleReaction(message) }}>{message.message}</span>}
                    </span>
                    {properties.messages && message.reaction ? <div className='msg-reaction-left' onClick={() => { removeReaction(message) }}><span>{message.reaction}</span></div> : null}
                    {message.messagePopUp && <MessagePopup forwardMessage={() => forwardPopup(message.message)} type="left" indexValue={index} replyMsg={onclickReply} />}
                    <span className='msg-time-left'>{getTimeByTimestamp(message.timestamp)}</span>
                  </div>)
                }
              </div>)
            })}
            {properties.isOponentTyping &&
              <div>
                <div className="msg-left" style={{ width: '14px', paddingLeft: '13px', marginLeft: '5px' }}>
                  <div className="bounce">
                  </div>
                  <div className="bounce1">
                  </div>
                  <div className="bounce2">
                  </div>
                </div></div>
            }

          </div>

          <div className='footer'>
            <div>{properties.reply ? <div className='reply'><div className='msg-style'><span className='reply-footer-display'>{firstMsg}</span>
              <span className='msg-display' onClick={msgDisplay}>X</span></div></div> : null}</div>
            <div className="emoji">
              <GrEmoji className='emoji-style' onClick={() => { handleEmoji() }} />
              {properties.isEmojiActive === true && properties.tempReaction === true ? <div className="emoji-holder">
                <Picker
                  onEmojiClick={(obj, data) => {
                    userReaction(data.emoji, properties.reactionData)
                  }}
                  disableAutoFocus={true}
                  skinTone={SKIN_TONE_MEDIUM_DARK}
                  groupNames={{ smileys_people: 'PEOPLE' }}
                  pickerStyle={{ 'boxShadow': 'none' }}
                  native
                />
              </div> : <div>{properties.isEmojiActive ?
                <div className="emoji-holder">
                  <Picker
                    onEmojiClick={(obj, data) => {
                      message.current.value = message.current.value + data.emoji;
                    }}
                    disableAutoFocus={true}
                    skinTone={SKIN_TONE_MEDIUM_DARK}
                    groupNames={{ smileys_people: 'PEOPLE' }}
                    pickerStyle={{ 'boxShadow': 'none' }}
                    native
                  />
                </div> : null
              }</div>
              }
            </div>
            <div className="images">
              <label className='fileUpload'>
                <IoImagesOutline className='fileUploadIcon' />
                <input className='file' type="file" onChange={imageUploading} ></input></label></div>

            <div className='message-input'>
              <textarea className='textfield' id="textip" ref={message} onFocus={() => { sendTypingStartStatus() }} onBlur={() => { sendTypingEndStatus() }} placeholder='Type a message' />
            </div>
            <div className='submit-button'>
              <button className='send' onClick={() => { send(properties.Index) }}>Send</button>
            </div>
          </div>
        </div>
      }
    </>
  );
}