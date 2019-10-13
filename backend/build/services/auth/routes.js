"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var controller = require("./controller");
exports.authRouter = express.Router();
/** POST /api/auth */
exports.authRouter.route('/').post(controller.create);
