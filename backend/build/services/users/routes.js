"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var jwt = require("express-jwt");
var config_1 = require("../../config");
var controller = require("./controller");
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
