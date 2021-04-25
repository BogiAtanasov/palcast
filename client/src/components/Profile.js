import React, { useState, useEffect } from 'react';
import Input from './forms/Input';
import Button from './forms/Button';
import {connect} from 'react-redux';
import { getCurrentProfile, updateProfile } from '../actions/profile';
import PropTypes from 'prop-types';
import { FaCog } from "react-icons/fa";
import {Link} from 'react-router-dom';

const Profile = ({getCurrentProfile, updateProfile, auth, profile: {profile,loading}}) => {

  const[formData, setFormData] = useState({
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      profile_id: ''
  });

  useEffect(()=>{
    getCurrentProfile();

    if(profile){
      setFormData({
        email: loading || !profile.email ? "" : profile.email,
        first_name: loading || !profile.first_name ? "" : profile.first_name,
        last_name: loading || !profile.last_name ? "" : profile.last_name,
        profile_id: loading || !profile.profile_id ? "" : profile.profile_id,
      });
    }


  }, [loading]);

  const submitForm = () => {
    updateProfile({first_name: formData.first_name, last_name:formData.last_name});
  };

  return (
    <div className="profile_page profile_page__container">
      <div className="profile_page__content">
        <h1><FaCog /> Account Settings</h1>

        <div className="profile__form">

        <Input value={formData.email} onChange={(value)=>setFormData({...formData, email:value})} title="Email" description="Change your email address"/>

        <Input value={formData.password} onChange={(value)=>setFormData({...formData, password:value})} title="Password" description="Change your password"/>

        <Input value={formData.first_name} onChange={(value)=>setFormData({...formData, first_name:value})} title="First Name" description="Change your first name"/>

        <Input value={formData.last_name} onChange={(value)=>setFormData({...formData, last_name:value})} title="Last Name" description="Change your last name"/>

        <Button onClick={()=> submitForm() } primary text="Update Profile"></Button>

        </div>
      </div>
    </div>
  )
}

Profile.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps, {getCurrentProfile, updateProfile})(Profile);
