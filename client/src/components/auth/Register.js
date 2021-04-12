import React, { useState } from 'react';
import '../pages/pages.css';
import Images from '../Images';
import Button from '../forms/Button';
import Input from '../forms/Input';
import { Link } from 'react-router-dom';
import { FaFacebook, FaGoogle} from "react-icons/fa";
import axios from 'axios';

const Register = () => {
  const [passwordInput, setPasswordInput] = useState();
  const [emailInput, setEmailInput] = useState();
  const [nameInput, setNameInput] = useState();
  const [firstNameInput, setFirstNameInput] = useState();
  const [lastNameInput, setLastNameInput] = useState();

  const submitForm = async e => {

    const newUser = {
      username: nameInput,
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

    const res = await axios.post('api/users', body, config);
    console.log(res.data);

    } catch (e) {
      console.error(e.response.data);
    }

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
          <Input primary value={nameInput} iconName='profile' onChange={(value)=>setNameInput(value)} placeholder="Username"/>
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

export default Register;
