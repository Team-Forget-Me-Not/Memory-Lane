// MainApp.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import CreateAccount from './CreateAccount';
import App from './App';
import Login from './LoginPage';
import Calendar from './Calendar';
import FrontPage from './FrontPage';
import ForgetPassword from './ForgetPassword';
import Planner from './Planner';
import Profile from './Profile';

const MainApp = () => {
  return (
    <Router>
      <Switch>
        <Route path="/forget-password" component={ForgetPassword} />
        <Route path="/create-account" component={CreateAccount} />
        <Route path="/login-page" component={Login} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/front-page" component={FrontPage} />
        <Route path="/planner" component={Planner} />
        <Route path="/profile" component={Profile} />
        <Route exact path="/">
          <Redirect to="/front-page" />
        </Route>
        <Route path="/app" component={App} />
      </Switch>
    </Router>
  );
};

export default MainApp;
