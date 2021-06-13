import './App.css';
import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Landing from './components/pages/Landing';
import Alert from './components/Alert';
import Home from './components/Home';
import Wall from './components/Wall';
import Inbox from './components/Inbox';
import Category from './components/Category';
import BrowsePage from './components/BrowsePage';
import LiveStream from './components/LiveStream';
import LiveStreamMiddleware from './components/LiveStreamMiddleware';
import Profile from './components/Profile';
import UploadStream from './components/UploadStream';
import MediaNavbar from './components/layout/MediaNavbar';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/routing/PrivateRoute';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

//Redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/setAuthToken'
import {loadUser} from './actions/auth';
import { getCurrentProfile } from './actions/profile';

const news_key = 'd5143f3e263544a38035daaefb2e2b05';
if(localStorage.token){
  setAuthToken(localStorage.token);
}

const App = () => {

  useEffect(()=>{
    store.dispatch(loadUser());
    store.dispatch(getCurrentProfile());
  }, []);

  return(
  <Provider store={store}>
  <MediaNavbar />
  <Router>
    <Fragment>
      <Route exact path='/' component={Landing} />
      <Navbar />
        <Alert />
        <Switch>
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
          <section className="app">
          <PrivateRoute exact path='/home' component={Home} />
          <PrivateRoute exact path='/profile' component={Profile} />
          <PrivateRoute exact path='/studio' component={UploadStream} />
          <PrivateRoute exact path='/stream' component={LiveStreamMiddleware} />
          <PrivateRoute exact path='/browse' component={BrowsePage} />
          <PrivateRoute exact path='/category/:category' component={Category} />
          <PrivateRoute exact path='/user/:user' component={Wall} />
          <PrivateRoute exact path='/message/:user' component={Inbox} />
          </section>
        </Switch>
    </Fragment>
  </Router>
</Provider>
)
}
export default App;
