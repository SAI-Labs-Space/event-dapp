"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
require("./db");
const services_1 = require("./services");
const app = express();
// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.get('/', (request, response) => {
    response.send('Hello !');
});
// Mount REST on /api
app.use('/api', services_1.services);
app.listen(8000, () => console.log('Express app listening on localhost:8000'));
