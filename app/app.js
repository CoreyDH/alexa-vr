'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

import Layout from './pages/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Account from './pages/Account';
import VRScene from './pages/VRScene';

const app = document.getElementById('app');

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={Home}></IndexRoute>
      <Route path="about"    name="about"    component={About}></Route>
      <Route path="login"    name="login"    component={Login}></Route>
      <Route path="logout"   name="logout"   component={Logout}></Route>
      <Route path="register" name="register" component={Register}></Route>
      <Route path="account"  name="account"  component={Account}></Route>
      <Route path="vrscene"  name="vrscene"  component={VRScene}></Route>
    </Route>
  </Router>,
app);
