"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const jwt = require("express-jwt");
const config_1 = require("../../config");
const controller = require("./controller");
exports.userRouter = express.Router();
/** GET /api/users */
exports.userRouter.route('/').get(controller.find);
/** GET /api/users/:userId */
/** Authenticated route */
exports.userRouter
    .route('/:userId')
    .get(jwt({ secret: config_1.config.secret }), controller.get);
/** POST /api/users */
exports.userRouter.route('/').post(controller.create);
/** PATCH /api/users/:userId */
/** Authenticated route */
exports.userRouter
    .route('/:userId')
    .patch(jwt({ secret: config_1.config.secret }), controller.patch);
