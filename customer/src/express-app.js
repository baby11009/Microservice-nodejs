const express = require("express");
const cors = require("cors");
const { customer } = require("./api");

module.exports = async (app, channel) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));

  //api
  customer(app, channel);
};
