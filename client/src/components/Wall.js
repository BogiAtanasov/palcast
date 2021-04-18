import React, { useState } from 'react';
import Button from './forms/Button';
import {connect} from 'react-redux';
import { logout } from '../actions/auth';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

const Wall = ({logout}) => {

  return (
    <div>
      Wall Page
      <Link to="/home">Redirect to Home</Link>
    </div>
  )
}

Wall.propTypes = {
  logout: PropTypes.func.isRequired
}

export default connect(null, {logout})(Wall);
