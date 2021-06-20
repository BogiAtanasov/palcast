import React, { useState } from 'react';
import '../pages/pages.css';

import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

import Images from '../Images';
import Button from '../forms/Button';
import Input from '../forms/Input';
import { Link, Redirect } from 'react-router-dom';
import { FaFacebook, FaGoogle} from "react-icons/fa";
import axios from 'axios';

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [passwordInput, setPasswordInput] = useState();
  const [emailInput, setEmailInput] = useState();
  const [nameInput, setNameInput] = useState();
  const [firstNameInput, setFirstNameInput] = useState();
  const [lastNameInput, setLastNameInput] = useState();

  const submitForm = async e => {

    const newUser = {
      email: emailInput,
      password: passwordInput,
      firstName: firstNameInput,
      lastName: lastNameInput,
    }
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

    const body = JSON.stringify(newUser);

    // const res = await axios.post('api/users', body, config);

    register({email:newUser.email, password:newUser.password, firstName:newUser.firstName, lastName:newUser.lastName });

    } catch (e) {
      console.error(e.response.data);
    }

  }

  if(isAuthenticated){
    return <Redirect to="/home" />;
  }

  return (
    <div className="register_page">
      <img className="register_bg_top" src={Images.auth_bg_top} alt=""/>
      <img className="register_bg_bottom" src={Images.auth_bg_bottom} alt=""/>

      <div className="register__container">

        <div className="register__image">
          <h1>Hello Friend</h1>
          <h4>Enter your personal details and start your journey with us</h4>
          <img className="register__ilu" src={Images.register} alt=""/>
          <h4 className="login_redirect">If you already have an account <Link to="/login"><span>login</span></Link></h4>
          <img className="register_bg" src={Images.auth_bg} alt=""/>
        </div>
        <div className="register__form">
          <h1>Create Account</h1>
          <div className="social_login">
            <img src={Images.fb} alt=""/>
            <img src={Images.google} alt=""/>
          </div>
          <h4>or use your email for registration</h4>
          <Input primary value={emailInput} iconName='mail' onChange={(value)=>setEmailInput(value)} placeholder="Email"/>
          <Input primary value={passwordInput} iconName='password' onChange={(value)=>setPasswordInput(value)} placeholder="Password"/>
          <Input primary value={firstNameInput} iconName='profile' onChange={(value)=>setFirstNameInput(value)} placeholder="First Name"/>
          <Input primary value={lastNameInput} iconName='profile' onChange={(value)=>setLastNameInput(value)} placeholder="Last Name"/>
          <Button onClick={()=> submitForm() } primary text="Sign up"></Button>
        </div>
      </div>
    </div>
  )
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}


const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register })(Register);
