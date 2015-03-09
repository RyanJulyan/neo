/**
 * Copyright 2014, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
'use strict';
var React = require('react');
var Link = require('react-router').Link;
var StateMixin = require('react-router').State;

var Nav = React.createClass({
  mixins: [StateMixin],
  render: function() {
    return (
      <ul className="pure-menu pure-menu-open pure-menu-horizontal">
        <li className={this.isActive('/anderson/home') ? 'pure-menu-selected' : ''}><Link to='/anderson/home'>Home</Link></li>
        <li className={this.isActive('/anderson/story') ? 'pure-menu-selected' : ''}><Link to='/anderson/story'>Story</Link></li>
      </ul>
    );
  }
});

module.exports = Nav;

