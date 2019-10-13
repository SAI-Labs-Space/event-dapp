"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const event_model_1 = require("../../models/event.model");
exports.find = (req, res, next) => {
    // If a query string ?ownerAddress=... is given, then filter results
    const whereClause = req.query &&
        req.query.ownerAddress && {
        where: { ownerAddress: req.query.ownerAddress }
    };
    return event_model_1.Event.findAll(whereClause)
        .then(events => res.json(events))
        .catch(err => res.status(400).json({ message: err.message }));
};
exports.get = (req, res, next) => {
    return event_model_1.Event.findOne({
        where: { publicAddress: req.params.id }
    }).then(event => res.json(event))
        .catch(err => res.status(400).json({ message: err.message }));
};
exports.create = (req, res, next) => {
    const body = Object.assign({}, req.body);
    body.name = body.eventName;
    body.physicalAddress = body.location;
    delete body.eventName;
    event_model_1.Event.create(body)
        .then(event => res.json(event))
        .catch(err => res.status(400).json({ message: err.message }));
};
