import React, { useState, useEffect } from 'react';
import Input from './forms/Input';
import Button from './forms/Button';
import LiveChat from './LiveChat';
import {connect} from 'react-redux';
import { getCurrentProfile, updateProfile } from '../actions/profile';
import PropTypes from 'prop-types';
import { FaCog } from "react-icons/fa";
import {Link} from 'react-router-dom';
import axios from 'axios';
import FormData from 'form-data';
import queryString from 'query-string';
import io from "socket.io-client";

let socket;


const LiveStream = ({getCurrentProfile, auth, profile: {profile,loading}}) => {
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(()=>{
    getCurrentProfile();

  }, [loading]);

  useEffect(() => {
    var messageBody = document.querySelector('.messagesContainer');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  }, [messages]);

  useEffect(() => {
    const { room } = queryString.parse(window.location.search);

    socket = io('localhost:5000');

    socket.emit('join', { user_id:auth.user.user_id,room:room }, (error) => {
      if(error) {
        alert(error);
      }
    });
  }, ['localhost:5000', window.location.search]);

  useEffect(() => {
  socket.on('message', message => {
    setMessages(messages => [ ...messages, message ]);
  });

  socket.on("roomData", ({ users }) => {
    setUsers(users);
  });
  }, []);

  const sendMessage = (message) => {
    console.log("in sendMessage", message);
    if(message) {
      socket.emit('sendMessage', message, () => {
        var messageBody = document.querySelector('.messagesContainer');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
      });
    }
  }

  if(loading){
    return(
      <div>Waiting</div>
    )
  }

  return (
    <div>
    <LiveChat messages={messages} currentProfile={profile} sendMessage={(message)=>sendMessage(message)}/>
    </div>
  )
}

LiveStream.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
})

export default connect(mapStateToProps,{getCurrentProfile})(LiveStream);
