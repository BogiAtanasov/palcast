import React from 'react';
import './forms.css';
import { MdSearch } from "react-icons/md";
import { FaUser, FaLock } from "react-icons/fa";
import { HiMail } from "react-icons/hi";


const icons = {
  'search' : <MdSearch />,
  'profile' : <FaUser />,
  'mail' : <HiMail />,
  'password' : <FaLock className="icon__password"/>,
}

const Input = ({iconName, placeholder, onChange, primary, secondary, value}) => {
  var iconSvg;
  if(iconName){
    iconSvg = icons[iconName]
  }

  return (
    <div className={`input ${primary && 'input__primary'} ${secondary && 'input__secondary'}`}>
    <input placeholder={placeholder} onClick={onChange ? onChange() : () => {}} />
    {iconSvg && iconSvg}
    </div>
  )
}

export default Input;
