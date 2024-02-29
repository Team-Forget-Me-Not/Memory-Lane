// MainApp.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CreateAccount from './CreateAccount';
import App from './App';
import Login from './LoginPage';
import Calendar from './Calendar';
import FrontPage from './FrontPage';
import ForgetPassword from './ForgetPassword';
import Planner from './Planner';

const MainApp = () => {
  return (
    <Router>
      <Switch>
        <Route path = "/forget-password" component={ForgetPassword}/>
        <Route path="/create-account" component={CreateAccount} />
        <Route path="/login-page" component={Login} />
        <Route path="/Calendar" component={Calendar} /> 
        <Route path="/Front-page" component={FrontPage} />  
        <Route path="/Planner" component={Planner} />
        <Route path="/" component={App} />
      
      </Switch>
    </Router>
  );
};

export default MainApp;
