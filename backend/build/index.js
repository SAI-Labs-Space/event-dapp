"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var cors = require("cors");
var express = require("express");
require("./db");
var services_1 = require("./services");
var app = express();
// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.get('/', function (request, response) {
    response.send('Hello !');
});
// Mount REST on /api
app.use('/api', services_1.services);
app.listen(8000, function () { return console.log('Express app listening on localhost:8000'); });
