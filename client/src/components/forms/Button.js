import React from 'react';
import './forms.css';

const Button = ({text, onClick, primary, description, title, className}) => {

  if(description){
    return(
        <div className="input_main">
          <div className="input_description">
            <p className="title">{title}</p>
            <p className="description">{description}</p>
          </div>
          <button className={`btn ${primary && 'btn-black'}`} onClick={onClick ? ()=>onClick() : () => {}}>{text}</button>
        </div>
      )
  }

  return (
    <button className={`btn ${primary && 'btn-black'} ${className && className}`} onClick={onClick ? ()=>onClick() : () => {}}>{text}</button>
  )
}

export default Button;
