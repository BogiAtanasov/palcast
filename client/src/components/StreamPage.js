import React, { useState, useEffect } from 'react';
import Input from './forms/Input';
import Button from './forms/Button';
import {connect} from 'react-redux';
import { getCurrentProfile, updateProfile } from '../actions/profile';
import PropTypes from 'prop-types';
import { FaCog } from "react-icons/fa";
import {Link} from 'react-router-dom';
import axios from 'axios';
import Images from './Images';
import FormData from 'form-data';


const StreamPage = ({auth}) => {

  const[formData, setFormData] = useState({
      title: '',
      description: '',
      category: '',
      mp3: null,
      episode_cover: null,
  });

  const submitForm = async e => {

      let info = JSON.stringify({
        title: formData.title,
        description: formData.description,
        category: formData.category,
      })
      const body = new FormData();
      body.append("payload", info);
      body.append("uploadFiles", formData.mp3);
      body.append("uploadFiles", formData.episode_cover);

      const res = await axios.post('api/studio', body, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
      });
  };

  const addLiveStream = () => {

    let info = JSON.stringify({
      title: formData.title,
      description: formData.description,
      category: formData.category,
    });

    const body = new FormData();
    body.append("payload", info);
    body.append("uploadFiles", formData.episode_cover);

    axios.post('api/studio/livestream', body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  }


  return (
    <div className="uploadstream_page uploadstream_page__container">
      <div className="uploadstream_page__content">
        <h2>Begin stream</h2>
        <div className="profile__form">
          <div>
          <Input value={formData.title} onChange={(value)=>setFormData({...formData, title:value})} title="Name" description="Set the title of the podcast"/>
          <Input value={formData.category} onChange={(value)=>setFormData({...formData, category:value})} title="Category" description="Set the category of the podcast"/>
          <Input value={formData.description} onChange={(value)=>setFormData({...formData, description:value})} title="Description" description="Set the description of the podcast"/>
          <Input value={formData.episode_cover} type="file" onChange={(value)=>setFormData({...formData, episode_cover:value})} title="Upload File" description="Set the cover photo for this episode" id="upload-episode-cover"/>

          <Link to={`/stream?room=${formData.title}`}>
            <Button primary onClick={()=>addLiveStream()} text="Start Live Broadcast"></Button>
          </Link>
          </div>
          <img className="stream_image" src={Images.stream} alt=""/>
        </div>
      </div>
    </div>
  )
}

StreamPage.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(mapStateToProps,null)(StreamPage);
