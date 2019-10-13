"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethUtil = require("ethereumjs-util");
var sigUtil = require("eth-sig-util");
var jwt = require("jsonwebtoken");
var config_1 = require("../../config");
var user_model_1 = require("../../models/user.model");
exports.create = function (req, res, next) {
    var _a = req.body, signature = _a.signature, publicAddress = _a.publicAddress;
    if (!signature || !publicAddress)
        return res
            .status(400)
            .send({ error: 'Request should have signature and publicAddress' });
    return (user_model_1.User.findOne({ where: { publicAddress: publicAddress } })
        ////////////////////////////////////////////////////
        // Step 1: Get the user with the given publicAddress
        ////////////////////////////////////////////////////
        .then(function (user) {
        if (!user)
            return res.status(401).send({
                error: "User with publicAddress " + publicAddress + " is not found in database"
            });
        return user;
    })
        ////////////////////////////////////////////////////
        // Step 2: Verify digital signature
        ////////////////////////////////////////////////////
        .then(function (user) {
        if (!(user instanceof user_model_1.User)) {
            // Should not happen, we should have already sent the response
            throw new Error('User is not defined in "Verify digital signature".');
        }
        var msg = "I am signing my one-time nonce: " + user.nonce;
        // We now are in possession of msg, publicAddress and signature. We
        // will use a helper from eth-sig-util to extract the address from the signature
        var msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
        var address = sigUtil.recoverPersonalSignature({
            data: msgBufferHex,
            sig: signature
        });
        // The signature verification is successful if the address found with
        // sigUtil.recoverPersonalSignature matches the initial publicAddress
        if (address.toLowerCase() === publicAddress.toLowerCase()) {
            return user;
        }
        else {
            return res
                .status(401)
                .send({ error: 'Signature verification failed' });
        }
    })
        ////////////////////////////////////////////////////
        // Step 3: Generate a new nonce for the user
        ////////////////////////////////////////////////////
        .then(function (user) {
        if (!(user instanceof user_model_1.User)) {
            // Should not happen, we should have already sent the response
            throw new Error('User is not defined in "Generate a new nonce for the user".');
        }
        user.nonce = Math.floor(1000 + Math.random() * 9000);
        return user.save();
    })
        ////////////////////////////////////////////////////
        // Step 4: Create JWT
        ////////////////////////////////////////////////////
        .then(function (user) {
        return new Promise(function (resolve, reject) {
            // https://github.com/auth0/node-jsonwebtoken
            return jwt.sign({
                payload: {
                    id: user.id,
                    publicAddress: publicAddress
                }
            }, config_1.config.secret, {}, function (err, token) {
                if (err) {
                    return reject(err);
                }
                return resolve(token);
            });
        });
    })
        .then(function (accessToken) { return res.json({ accessToken: accessToken }); })
        .catch(function (err) { return res.status(400).json({ message: err.message }); }));
};
