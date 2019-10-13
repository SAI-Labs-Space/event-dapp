"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event_model_1 = require("../../models/event.model");
exports.find = function (req, res, next) {
    // If a query string ?ownerAddress=... is given, then filter results
    var whereClause = req.query &&
        req.query.ownerAddress && {
        where: { ownerAddress: req.query.ownerAddress }
    };
    return event_model_1.Event.findAll(whereClause)
        .then(function (events) { return res.json(events); })
        .catch(function (err) { return res.status(400).json({ message: err.message }); });
};
exports.get = function (req, res, next) {
    return event_model_1.Event.findOne({
        where: { publicAddress: req.params.id }
    }).then(function (event) { return res.json(event); })
        .catch(function (err) { return res.status(400).json({ message: err.message }); });
};
exports.create = function (req, res, next) {
    var body = Object.assign({}, req.body);
    body.name = body.eventName;
    body.physicalAddress = body.location;
    delete body.eventName;
    event_model_1.Event.create(body)
        .then(function (event) { return res.json(event); })
        .catch(function (err) { return res.status(400).json({ message: err.message }); });
};
