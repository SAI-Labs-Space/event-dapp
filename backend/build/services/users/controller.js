"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../../models/user.model");
exports.find = (req, res, next) => {
    // If a query string ?publicAddress=... is given, then filter results
    const whereClause = req.query &&
        req.query.publicAddress && {
        where: { publicAddress: req.query.publicAddress }
    };
    return user_model_1.User.findAll(whereClause)
        .then(users => res.json(users))
        .catch(err => res.status(400).json({ message: err.message }));
};
exports.get = (req, res, next) => {
    // AccessToken payload is in req.user.payload, especially its `id` field
    // UserId is the param in /users/:userId
    // We only allow user accessing herself, i.e. require payload.id==userId
    if (req.user.payload.id !== +req.params.userId) {
        return res.status(401).send({ error: 'You can can only access yourself' });
    }
    return user_model_1.User.findByPk(req.params.userId)
        .then(user => res.json(user))
        .catch(err => res.status(400).json({ message: err.message }));
};
exports.create = (req, res, next) => user_model_1.User.create(req.body)
    .then((user) => res.json(user))
    .catch(err => res.status(400).json({ message: err.message }));
exports.patch = (req, res, next) => {
    // Only allow to fetch current user
    if (req.user.payload.id !== +req.params.userId) {
        return res.status(401).send({ error: 'You can can only access yourself' });
    }
    return user_model_1.User.findByPk(req.params.userId)
        .then((user) => __awaiter(this, void 0, void 0, function* () {
        if (!user) {
            return user;
        }
        Object.assign(user, req.body);
        return user.save();
    }))
        .then(user => {
        return user
            ? res.json(user)
            : res.status(401).send({
                error: `User with publicAddress ${req.params.userId} is not found in database`
            });
    })
        .catch(err => res.status(400).json({ message: err.message }));
};
