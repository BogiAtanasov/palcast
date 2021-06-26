import React, { useState } from 'react';
import './forms.css';
import { MdSearch, MdRemoveRedEye } from "react-icons/md";
import { FaUser, FaLock } from "react-icons/fa";
import { HiMail } from "react-icons/hi";


const icons = {
  'search' : <MdSearch />,
  'profile' : <FaUser />,
  'mail' : <HiMail />,
  'password' : <FaLock className="icon__password"/>,
  'eye' : <MdRemoveRedEye/>,
}

const Input = ({iconName, placeholder, onChange, primary, secondary, value, title, description, type, id}) => {
  var iconSvg;
  if(iconName){
    iconSvg = icons[iconName]
  }

  const [revealPassword, setReveal] = useState(false);


  //Settings Input
  if(description){
    return(
        <div className="input_main">
          <div className="input_description">
            <p className="title">{title}</p>
            <p className="description">{description}</p>
          </div>
          {id == "upload-profile-picture" &&
            <img style={{width: 140, height: 160, borderRadius: 10, objectFit: 'cover', boxShadow: "0px 3px 6px rgb(0 0 0 / 20%)", marginRight: 12}}
            src={(typeof(value) === "object" && value !== null)? window.URL.createObjectURL(value) : `/uploads/images/${value}`} alt=""/>
          }
          {id == "upload-cover-photo" &&
            <img style={{width: 140, height: 160, borderRadius: 10, objectFit: 'cover', boxShadow: "0px 3px 6px rgb(0 0 0 / 20%)", marginRight: 12}}
            src={(typeof(value) === "object" && value !== null)? window.URL.createObjectURL(value) : `/uploads/images/${value}`} alt=""/>
          }
          {type != "file" &&
           <input id={id && id} placeholder={placeholder} value={value} type={type ? type : "input"} onChange={onChange ? (val)=>onChange(val.target.value) : () => {}} />
          }
          {type == "file" &&
          <div>
            <label className="upload_button" for={id}>Upload</label>
            <input id={id && id} placeholder={placeholder} type={type ? type : "input"} onChange={onChange ? (val)=>onChange(val.target.files[0]) : () => {}} />
          </div>
          }
        </div>
      )
    }


  //Register/Login Input
  return (
    <div className={`input ${primary && 'input__primary'} ${secondary && 'input__secondary'}`}>

    {type != "password" &&
      <input placeholder={placeholder} value={value} onChange={onChange ? (val)=>onChange(val.target.value) : () => {}} />
    }

    {type == "password" &&
      <input placeholder={placeholder} type={revealPassword ?  "input" : "password" } value={value} onChange={onChange ? (val)=>onChange(val.target.value) : () => {}} />
    }

    {type == "password" &&
      <div className="revealPassword" style={{opacity: `${value ? revealPassword ? "1" : "0.3" : "0"}`}} onClick={()=>setReveal(!revealPassword)}>
        {
          icons['eye']
        }
      </div>
    }

    {iconSvg && iconSvg}
    </div>
  )

}

export default Input;
