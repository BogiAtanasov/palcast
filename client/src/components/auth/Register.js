import React, { useState } from 'react';
import '../pages/pages.css';
import Images from '../Images';
import Button from '../forms/Button';
import Input from '../forms/Input';
import { Link } from 'react-router-dom';
import { FaFacebook, FaGoogle} from "react-icons/fa";

const Register = () => {
  const [passwordInput, setPasswordInput] = useState();
  const [emailInput, setEmailInput] = useState();
  const [nameInput, setNameInput] = useState();
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
          <Input primary value={nameInput} iconName='profile' onChange={(value)=>setNameInput(value)} placeholder="Name"/>
          <Input primary value={emailInput} iconName='mail' onChange={(value)=>setEmailInput(value)} placeholder="Email"/>
          <Input primary value={passwordInput} iconName='password' onChange={(value)=>setEmailInput(value)} placeholder="Password"/>
          <Button primary text="Sign up"></Button>
        </div>
      </div>
    </div>
  )
}

export default Register;
