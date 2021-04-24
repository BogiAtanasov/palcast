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

const Input = ({iconName, placeholder, onChange, primary, secondary, value, title, description}) => {
  var iconSvg;
  if(iconName){
    iconSvg = icons[iconName]
  }


  //Settings Input
  if(description){
    return(
        <div className="input_main">
          <div className="input_description">
            <p className="title">{title}</p>
            <p className="description">{description}</p>
          </div>
          <input placeholder={placeholder} value={value} onChange={onChange ? (val)=>onChange(val.target.value) : () => {}} />
        </div>
      )
    }


  //Register/Login Input
  return (
    <div className={`input ${primary && 'input__primary'} ${secondary && 'input__secondary'}`}>
    <input placeholder={placeholder} value={value} onChange={onChange ? (val)=>onChange(val.target.value) : () => {}} />
    {iconSvg && iconSvg}
    </div>
  )

}

export default Input;
