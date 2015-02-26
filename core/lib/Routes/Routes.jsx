'use strict';


var React = require('react');
var Route = require('react-router').Route;

var routes = function (routes, Application) {
  //console.log(routes);
  return (
    <Route name="app" path="/" handler={Application}>
    {routes}
    </Route>
  )
};

module.exports = routes;
