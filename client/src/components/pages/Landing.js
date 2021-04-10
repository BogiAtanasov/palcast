import React, { useState } from 'react';
import './pages.css';
import Images from '../Images';
import Button from '../forms/Button';
import Input from '../forms/Input';
import { Link } from 'react-router-dom';
import { FaFacebookSquare, FaTwitterSquare, FaYoutubeSquare } from "react-icons/fa";

const Landing = () => {
  const [searchInput, setSearchInput] = useState();
  const [emailInput, setEmailInput] = useState();
  const [nameInput, setNameInput] = useState();
  return (
    <div className="landing_page">
    <div className="landing_page_main">
      <img className="bg_top" src={Images.landing_bg_top} alt=""/>
      <img className="bg_bottom" src={Images.landing_bg_bottom} alt=""/>
      <div className="container">

        <nav>
          <h1>
            <Link to="/">Palcast</Link>
          </h1>
          <ul>
            <li><Link to="">Browse</Link></li>
            <li><Link to="">Features</Link></li>
            <li><Link to="">Support</Link></li>
            <li><Link to="/register" className="signUpNav">Sign up</Link></li>
          </ul>
        </nav>

        <section className="header">
          <div className="header__text">
            <h1>The easiest way to share your conversations with the world</h1>
            <h4>Record and listen to podcasts made by regular friends and family.</h4>
            <Link to="/register">
              <Button primary text="Sign up now"></Button>
            </Link>
          </div>
          <div className="header__image">
            <img className="" src={Images.landing_discussing} alt=""/>
          </div>
        </section>

        <section className="catalog">
          <div className="catalog__browse">
            <h1>Browse our catalog</h1>
            <h4>Search for a category or a content creator through our library of thousand of podcasts</h4>
            <Input secondary value={searchInput} iconName='search' onChange={(value)=>setSearchInput(value)} placeholder="What are you looking for?"/>
          </div>
          <div className="catalog__examples">
            <div className="podcast_highlight">
              <img src={Images.podcast_image_1} alt=""/>
              <h4>Hidden Brain</h4>
              <div className="podcast_hilight__social">
                  <FaFacebookSquare />
                  <FaTwitterSquare />
                  <FaYoutubeSquare />
              </div>
            </div>
            <div className="podcast_highlight">
              <img src={Images.podcast_image_2} alt=""/>
              <h4>Conan O'Brien</h4>
              <div className="podcast_hilight__social">
                  <FaFacebookSquare />
                  <FaTwitterSquare />
                  <FaYoutubeSquare />
              </div>
            </div>
            <div className="podcast_highlight">
              <img src={Images.podcast_image_3} alt=""/>
              <h4>Ted Talks Daily</h4>
              <div className="podcast_hilight__social">
                  <FaFacebookSquare />
                  <FaTwitterSquare />
                  <FaYoutubeSquare />
              </div>
            </div>
            <div className="podcast_highlight">
              <img src={Images.podcast_image_4} alt=""/>
              <h4>The Daily Show</h4>
              <div className="podcast_hilight__social">
                  <FaFacebookSquare />
                  <FaTwitterSquare />
                  <FaYoutubeSquare />
              </div>
            </div>
            <div className="podcast_highlight">
              <img src={Images.podcast_image_5} alt=""/>
              <h4>7 Good Minutes</h4>
              <div className="podcast_hilight__social">
                  <FaFacebookSquare />
                  <FaTwitterSquare />
                  <FaYoutubeSquare />
              </div>
            </div>
          </div>
        </section>

        <section className="laptop">
          <div className="laptop__text">
            <h1>Easy to navigate</h1>
            <h4>
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
            </h4>
            <Link to="/register">
              <Button primary text="Sign up now"></Button>
            </Link>
          </div>
          <img className="laptop_mockup" src={Images.landing_laptop} alt=""/>
        </section>

        <section className="features">
          <div className="feature">
            <img className="feature__image" src={Images.landing_recording} alt=""/>
            <div className="feature__text">
              <h1>Record podcasts</h1>
              <h4>
                Our platform is made for everyone to be able to record and share prodcasts with the world. Wether you are a group of friends or a family, it is the perfect place to share your conversations.
              </h4>
              <Link to="/register">
                <Button primary text="Sign up now"></Button>
              </Link>
            </div>
          </div>
          <div style={{textAlign: 'right'}} className="feature">
            <div className="feature__text">
              <h1>Participate Live</h1>
              <h4>
                Our platform is made for everyone to be able to record and share prodcasts with the world. Wether you are a group of friends or a family, it is the perfect place to share your conversations.
              </h4>
              <Link to="/register">
                <Button primary text="Browse Products"></Button>
              </Link>
            </div>
            <img className="feature__image" src={Images.landing_podcast} alt=""/>
          </div>
          <div className="feature">
            <img className="feature__image" src={Images.landing_running} alt=""/>
            <div className="feature__text">
              <h1>Listen on the go</h1>
              <h4>
                Our platform is made for everyone to be able to record and share prodcasts with the world. Wether you are a group of friends or a family, it is the perfect place to share your conversations.
              </h4>
              <Link to="/register">
                <Button primary text="Start Recording"></Button>
              </Link>
            </div>
          </div>

        </section>

        <section className="newsletter">
          <h1>Subscribe to our newsletter</h1>
          <div className="newsletter__inputs">
            <Input primary value={nameInput} iconName='profile' onChange={(value)=>setNameInput(value)} placeholder="Name"/>
            <Input primary value={emailInput} iconName='mail' onChange={(value)=>setEmailInput(value)} placeholder="Email"/>
          </div>
          <Link to="/register">
            <Button primary text="Start Recording"></Button>
          </Link>
        </section>

      </div>
    </div>
    <footer>

    </footer>
    </div>
  )
}

export default Landing;
