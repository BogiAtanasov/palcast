import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
const Inbox = (props) => {
  const { myProfile, receiver, userProfile } = props;
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  useEffect(()=>{
      getMessageHistory();
      const interval = setInterval(() => {
        getMessageHistory()
      }, 5000);
      return () => clearInterval(interval);
  }, []);

  useEffect(() => {
   const { myProfile, receiver, userProfile } = props;
   for(let message of messages){
     if(message.sender_user_id == receiver){
       message["profile"] = userProfile;
     }else{
       message["profile"] = myProfile;
     }
   }
   setMessages([...messages]);
}, [props]);

  const handleKeyDown = (podcast_id) => (event) =>{
    if (event.key === 'Enter') {
      sendMessage();
    }
  }

  const getMessageHistory = async () => {
    console.log("UserProfile", userProfile);
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const body = JSON.stringify({user_id: receiver});

    const res = await axios.post('/api/profile/messageHistory', body, config);
    let messages_payload = res.data;
    for(let message of messages_payload){
      if(message.sender_user_id == receiver){
        message["profile"] = userProfile;
      }else{
        message["profile"] = myProfile;
      }
    }
    setMessages([...messages_payload]);
  }


  const sendMessage = async () =>{

    let new_message = {profile:myProfile, message_text: message, sender_user_id: myProfile.user_id};
    setMessages([...messages, new_message]);

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    const body = JSON.stringify({receiver_user_id: receiver, message: message});
    setMessage("");

    const res = await axios.post('/api/interact/sendMessage', body, config);



  }


  return (
    <div className="livechat_container">
    <h2 className="livechat_header">Direct Messages Inbox</h2>
      <div className="messagesContainer">
        {messages.length === 0 &&
        <div style={{display: 'flex', justifyContent: 'center'}}>No messages with this user</div>
        }
        {messages.map((elem,index) => {
          if(elem.user == "admin"){
            return(
              <div key={index} className="messageBox mbRight">
                <div className="messageContent">
                  <p className="messageSender">Palcast</p>
                  <p className="msgText">{elem.text}</p>
                </div>
                <img className="chat_profile_picture" src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Eo_circle_brown_letter-a.svg/480px-Eo_circle_brown_letter-a.svg.png" alt=""/>
              </div>
            )
          }
          return(
            <div key={index} className={`messageBox ${elem.sender_user_id == myProfile.user_id ? "mbLeft" : "mbRight"}`}>
              <img className="chat_profile_picture" src={`/uploads/images/${elem.profile.profile_picture}`} alt=""/>
              <div className="messageContent">
                <p className="messageSender"><span>{elem.profile.first_name}</span> <span>{elem.profile.last_name}</span></p>
                <p className="msgText">{elem.message_text}</p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="sendChatMsgBox">
        <img src={`/uploads/images/${myProfile ? myProfile.profile_picture : "" }`} alt=""/>
        <input placeholder="Type your message" value={message} onChange={(value)=>setMessage(value.target.value)} onKeyDown={handleKeyDown()} type="text"/>
      </div>


    </div>
  )
}


export default Inbox;
