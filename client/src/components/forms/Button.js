import React from 'react';
import './forms.css';

const Button = ({text, onClick, primary}) => {
  return (
    <button className={`btn ${primary && 'btn-black'}`} onClick={onClick ? ()=>onClick() : () => {}}>{text}</button>
  )
}

export default Button;
