import React, { useState, useEffect } from 'react';


const LiveChat = ({messages, currentProfile, sendMessage}) => {

  const [message,setMessage] = useState("");

  const handleKeyDown = (podcast_id) => (event) =>{
    if (event.key === 'Enter') {
      console.log("Enter",message);
      sendMessage(message);
      setMessage("");

    }
  }


  return (
    <div className="livechat_container">
    <h2 className="livechat_header">Live Chat</h2>
      <div className="messagesContainer">
        {messages.map((elem) => {
          if(elem.user == "admin"){
            return(
              <div className="messageBox mbRight">
                <div className="messageContent">
                  <p className="messageSender">Palcast</p>
                  <p className="msgText">{elem.text}</p>
                </div>
                <img className="chat_profile_picture" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Eo_circle_brown_letter-a.svg/480px-Eo_circle_brown_letter-a.svg.png" alt=""/>
              </div>
            )
          }
          return(
            <div className={`messageBox ${elem.user == currentProfile.user_id ? "mbLeft" : "mbRight"}`}>
              <img className="chat_profile_picture" src={`/uploads/images/${elem.profile.profile_picture}`} alt=""/>
              <div className="messageContent">
                <p className="messageSender"><span>{elem.profile.first_name}</span> <span>{elem.profile.last_name}</span></p>
                <p className="msgText">{elem.text}</p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="sendChatMsgBox">
        <img src={`/uploads/images/${currentProfile.profile_picture}`} alt=""/>
        <input placeholder="Type your message" value={message} onChange={(value)=>setMessage(value.target.value)} onKeyDown={handleKeyDown()} type="text"/>
      </div>


    </div>
  )
}


export default LiveChat;
