"use strict";
const React = require('react');
const Router = require('react-router');
const routes = require('./routes/Routes');
let injectTapEventPlugin = require("react-tap-event-plugin");

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('app'));
});