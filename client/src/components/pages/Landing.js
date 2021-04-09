import React from 'react';
import './pages.css';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="landing_page">
      <div className="container">

        <nav>
          <h1>
            <Link to="/">Palcast</Link>
          </h1>
          <ul>
            <li>
              <Link to="">Browse</Link>
            </li>
            <li>
              <Link to="">Features</Link>
            </li>
            <li>
              <Link to="">Support</Link>
            </li>
            <li>
              <Link to="/register">Sign up</Link>
            </li>
          </ul>
        </nav>

      </div>
    </div>
  )
}

export default Landing;
