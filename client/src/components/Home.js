import React, { useState } from 'react';
import Button from './forms/Button';
import {connect} from 'react-redux';
import { logout } from '../actions/auth';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Home = ({logout}) => {

  return (
    <div>
      Logout test
    <Button onClick={()=> logout() } primary text="Logout"></Button>
    <Link to="/wall">Redirect to Wall</Link>
    </div>
  )
}

Home.propTypes = {
  logout: PropTypes.func.isRequired
}

export default connect(null, {logout})(Home);
