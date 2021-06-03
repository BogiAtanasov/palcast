import React, { useState, useEffect, useRef } from 'react';
import Input from './forms/Input';
import Button from './forms/Button';
import LiveChat from './LiveChat';
import LiveVideo from './LiveVideo';
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


const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <div>
        <video style={{height:250, width:250, objectFit: 'contain'}} playsInline autoPlay ref={ref} />
      </div>
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


  useEffect(() => {
    var messageBody = document.querySelector('.messagesContainer');
    messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
  }, [messages]);

  useEffect(() => {
    console.log('%c Peers changed! ', 'background: #222; color: #bada55', peers);
  }, [peers]);

  useEffect(() => {
    const { room } = queryString.parse(window.location.search);

    socket = io('localhost:5000');
    socketRef.current = socket;

    navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
    userVideo.current.srcObject = stream;


    socketRef.current.emit("join-video", room);

    console.log("THIS USE EFFECT IS CALLED TWICE LIVESTREAM <<<<")

    // Once a new user has joined, Server fires all users which returns a list of all users in the call
    // For each user in the list, creates a peer for the new user with each user in the video_users list
    // and sets it in the peers array state
    socketRef.current.on("all users", video_users => {
        console.log("all users");
        const peers_temp = [];
        video_users.forEach(userID => {
            const peer = createPeer(userID, socketRef.current.id, stream);
            peersRef.current.push({
                peerID: userID,
                peer,
            })

            peers_temp.push({
              peerID: userID,
              peer
            });
        })
        console.log("All users handler before push", peers);
        setPeers([...peers_temp]);
        console.log("All users handler", peers);
    })

    // This event is recived by all users currently in the voice chat
    // and a connection is made to the new user
    socketRef.current.on("user joined", payload => {
        console.log("User joined", peers);
        const peer = addPeer(payload.signal, payload.callerID, stream);
        peersRef.current.push({
            peerID: payload.callerID,
            peer,
        })

        const peerObj = {
          peer,
          peerID: payload.callerID
        }
        console.log("peers before push user joined", peers);
        peers.push(peerObj);
        setPeers([...peers]);
        console.log("User joined handler", peers);
        console.log("User joined peersRef", peersRef.current);
    });


    //Once the users in the call accept the new user signal, this function makes the new user accept
    //all signals coming from the users currently in the call
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
      setPeers([...peers]);

    })

  });

    socket.emit('join', { user_id:auth.user.user_id ,room:room }, (error) => {
      if(error) {
        alert(error);
      }
    });

    return () => {
    socket.emit('disconnect user');
    }


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
    console.log("creatingPeer");

    const peer = new Peer({
        initiator: true,
        trickle: false,
        stream,
    });

    peer.on("signal", signal => {
        console.log("createPeer signaling user:", userToSignal, " my caller id is:", callerID);
        socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
    })

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
      console.log("addingPeer");
      const peer = new Peer({
          initiator: false,
          trickle: false,
          stream,
      })

      peer.on("signal", signal => {
          console.log("addingPeer signal");
          socketRef.current.emit("returning signal", { signal, callerID })
      })

      //Accepts the signal whcih calls signal on top
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
      {console.log("rendering", peers)}
      <div style={{display: "flex"}}>
        <p>My id: {socketRef.current ? socketRef.current.id : ""}</p>
      <video style={{width:250, height: 250, objectFit: 'contain'}} muted ref={userVideo} autoPlay playsInline />
      </div>
      <LiveVideo myStream={userVideo} peers={peers}/>
      {peersRef.current.map((peer, index) => {
          console.log("writing peer",peer);
          return (
          <div key={peer.peerID} style={{display: 'flex'}}>
              <p>{peer.peerID}</p>

              <Video key={peer.peerID} peer={peer.peer} />
          </div>
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
