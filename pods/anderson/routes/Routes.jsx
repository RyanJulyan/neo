'use strict';


var React = require('react');
var Route = require('react-router').Route;
var DefaultRoute = require('react-router').DefaultRoute;

var Application = require('../Pod/Pod.jsx');
var Home = require('./Home/Home.jsx');
var Story = require('./Stories/Stories.jsx');

var config = require('../pod.config');

var routes = (
  <Route key="1" name="anderson" path="/" handler={Application}>
    <Route name="story" path="/story" handler={Story}/>
    <DefaultRoute name="home" handler={Home}/>
  </Route>
  );

module.exports = routes;
