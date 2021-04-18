import React, { useState } from 'react';
import '../pages/pages.css';
import Images from '../Images';
import Button from '../forms/Button';
import Input from '../forms/Input';
import { Link, Redirect } from 'react-router-dom';
import { FaFacebook, FaGoogle} from "react-icons/fa";

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { login } from '../../actions/auth';


const Login = ({ login, isAuthenticated, loading }) => {

  const submitForm = () => {
    const form = {
      email: emailInput,
      password: passwordInput,
    }
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }

    login({email:form.email, password:form.password});

    } catch (e) {
      console.error(e.response.data);
    }
  }

  const [passwordInput, setPasswordInput] = useState();
  const [emailInput, setEmailInput] = useState();

  if(isAuthenticated){
    return <Redirect to='/home' />
  }

  if(loading){
    return <div></div>
  }

  return (
    <div className="login_page">
      <img className="login_bg_top" src={Images.auth_bg_top} alt=""/>
      <img className="login_bg_bottom" src={Images.auth_bg_bottom} alt=""/>

      <div className="login__container">

        <div className="login__image">
          <h1>Welcome Back</h1>
          <h4>Login with your personal info to start listening or recording podcasts</h4>
          <img className="login__ilu" src={Images.login} alt=""/>
          <h4 className="register_redirect">If you dont have an account: <Link to="/register"><span>Register</span></Link></h4>
          <img className="login_bg" src={Images.auth_bg} alt=""/>
        </div>
        <div className="login__form">
          <h1>Sign in</h1>
          <div className="social_login">
            <img src={Images.fb} alt=""/>
            <img src={Images.google} alt=""/>
          </div>
          <h4>or use your email account</h4>
          <Input primary value={emailInput} iconName='mail' onChange={(value)=>setEmailInput(value)} placeholder="Email"/>
          <Input primary value={passwordInput} iconName='password' onChange={(value)=>setPasswordInput(value)} placeholder="Password"/>
          <Button onClick={()=> submitForm() } primary text="Sign in"></Button>
        </div>
      </div>
    </div>
  )
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading
});

export default connect(mapStateToProps, {login})(Login);
