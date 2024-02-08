// MainApp.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CreateAccount from './CreateAccount';
import App from './App';

const MainApp = () => {
  return (
    <Router>
      <Switch>
        <Route path="/create-account" component={CreateAccount} />
        <Route path="/" component={App} />
      </Switch>
    </Router>
  );
};

export default MainApp;
