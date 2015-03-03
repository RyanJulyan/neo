'use strict';


var React = require('react');
var Route = require('react-router').Route;
var DefaultRoute = require('react-router').DefaultRoute;

/*var Home = require('../../../pods/anderson/routes/Home/Home.jsx');
var Story = require('../../../pods/anderson/routes/Stories/Stories.jsx');
var Anderson = require('../../../pods/anderson/Pod/Pod.jsx');*/

var routes = function (routes, Application) {

  return (
    <Route name="app" path="/" handler={Application}>
    {routes}
    </Route>
  )

};

module.exports = routes;
