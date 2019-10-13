"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
var models_1 = require("./models");
var sequelize = new sequelize_1.Sequelize('event-database', '', undefined, {
    dialect: 'sqlite',
    storage: './db.sqlite',
    logging: false
});
exports.sequelize = sequelize;
// Init all models
models_1.User.init({
    nonce: {
        allowNull: false,
        type: sequelize_1.INTEGER.UNSIGNED,
        defaultValue: function () { return Math.floor(1000 + Math.random() * 9000); } // Initialize with a random nonce
    },
    publicAddress: {
        allowNull: false,
        type: sequelize_1.STRING,
        unique: true,
        validate: { isLowercase: true }
    },
    name: {
        type: sequelize_1.STRING
    },
    email: {
        type: sequelize_1.STRING,
        unique: true
    },
    phone: {
        type: sequelize_1.STRING,
        unique: true
    }
}, {
    modelName: 'user',
    sequelize: sequelize,
    timestamps: false
});
models_1.Event.init({
    publicAddress: {
        allowNull: false,
        type: sequelize_1.STRING,
        validate: { isLowercase: true }
    },
    ownerAddress: {
        allowNull: false,
        type: sequelize_1.STRING,
        validate: { isLowercase: true }
    },
    name: {
        type: sequelize_1.STRING
    },
    description: {
        type: sequelize_1.STRING
    },
    location: {
        type: sequelize_1.STRING
    },
    startDate: {
        type: sequelize_1.DATE
    },
    endDate: {
        type: sequelize_1.DATE
    },
    quota: {
        type: sequelize_1.INTEGER
    },
    physicalAddress: {
        type: sequelize_1.TEXT
    },
    disbursed: {
        type: sequelize_1.BOOLEAN,
        defaultValue: false
    }
}, {
    modelName: 'event',
    sequelize: sequelize,
    timestamps: false
});
// Create new tables
sequelize.sync();
