"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var controller = require("./controller");
exports.eventRouter = express.Router();
/** GET /api/events */
exports.eventRouter.route('/').get(controller.find);
exports.eventRouter.route('/item/:id').get(controller.get);
/** GET /api/events/:address */
// eventRouter
//   .route('/:address')
//   .get(controller.get);
/** POST /api/events */
/** Authenticated route */
//eventRouter.route('/').post(jwt({ secret: config.secret }),controller.create);
exports.eventRouter.route('/').post(controller.create);
