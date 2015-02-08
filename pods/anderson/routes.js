'use strict';


var loadPage = require('../../global/components/App/AppStore');

module.exports = {
  home: {
    path: '/',
    method: 'get',
    page: 'home',
    title: 'Home',
    action: loadPage
  },
  about: {
    path: '/stories',
    method: 'get',
    page: 'stories',
    title: 'Stories',
    action: loadPage
  }
};
