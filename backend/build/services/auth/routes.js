"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const controller = require("./controller");
exports.authRouter = express.Router();
/** POST /api/auth */
exports.authRouter.route('/').post(controller.create);
