import React, { useState, useEffect, useRef } from 'react';
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
import Peer from "simple-peer";
import styled from "styled-components";

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 250px;
    width: 250px;
    object-fit: contain;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}

const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

let socket;


const LiveStream = ({getCurrentProfile, auth, profile: {profile,loading}}) => {
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  //Video
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);

  useEffect(()=>{

  }, []);

  useEffect(() => {
    var messageBody = document.querySelector('.messagesContainer');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  }, [messages]);

  useEffect(() => {
    const { room } = queryString.parse(window.location.search);

    socket = io('localhost:5000');
    socketRef.current = socket;

    navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
    userVideo.current.srcObject = stream;


    socketRef.current.emit("join-video", room);


    // Once a new user has joined, Server fires all users which returns a list of all users in the call
    // For each user in the list, creates a peer for the new user with each user in the video_users list
    // and sets it in the peers array state
    socketRef.current.on("all users", video_users => {
        const peers = [];
        video_users.forEach(userID => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
                peerID: userID,
                peer,
            })
            peers.push({
              peerID: userID,
              peer
            });
        })
        setPeers(peers);
        console.log("All users handler", peers);
    })

    // This event is recived by all users currently in the voice chat
    // and a connection is made to the new user
    socketRef.current.on("user joined", payload => {
        const peer = addPeer(payload.signal, payload.callerID, stream);
        peersRef.current.push({
            peerID: payload.callerID,
            peer,
        })

        const peerObj = {
          peer,
          peerID: payload.callerID
        }

        setPeers(prevPeers => [...prevPeers, peerObj]);
        console.log("User joined handler", peers);
    });

    socketRef.current.on("receiving returned signal", payload => {
        const item = peersRef.current.find(p => p.peerID === payload.id);
        item.peer.signal(payload.signal);
        console.log("Receiving returned signal", peers);
    });

    socketRef.current.on("user left", id => {
      //get the person that currently left
      const peerObj = peersRef.current.find(p => p.peerID === id);

      // destory peer
      if(peerObj){
        peerObj.peer.destroy();
      }

      //update state
      const peers = peersRef.current.filter(p => p.peerID !== id);
      peersRef.current = peers;
      setPeers(peers);

    })

  });

    socket.emit('join', { user_id:auth.user.user_id ,room:room }, (error) => {
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

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
    });

    peer.on("signal", signal => {
        socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
    })

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
      const peer = new Peer({
          initiator: false,
          trickle: false,
          stream,
      })

      peer.on("signal", signal => {
          socketRef.current.emit("returning signal", { signal, callerID })
      })

      peer.signal(incomingSignal);

      return peer;
  }

  const sendMessage = (message) => {
    console.log("in sendMessage", message);
    if(message) {
      socket.emit('sendMessage', message, () => {
        var messageBody = document.querySelector('.messagesContainer');
        messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
      });
    }
  }

  if(profile == null || profile == "undefined" || auth == null || auth.user == null){
    return(
      <div>Waiting</div>
    )
  }

  return (
    <div>
      <StyledVideo muted ref={userVideo} autoPlay playsInline />
      {peers.map((peer) => {
          return (
              <Video key={peer.peerID} peer={peer.peer} />
          );
      })}
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
