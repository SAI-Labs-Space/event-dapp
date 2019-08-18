import * as path from 'path';
import * as os from 'os';
import { INTEGER, Sequelize, STRING,DATE, TEXT } from 'sequelize';

import { User,Event } from './models';

const sequelize = new Sequelize('event-database', '', undefined, {
  dialect: 'sqlite',
  storage: './db.sqlite',
  logging: false
});


// Init all models
User.init(
  {
    nonce: {
      allowNull: false,
      type: INTEGER.UNSIGNED, // SQLITE will use INTEGER
      defaultValue: () => Math.floor(1000 + Math.random() * 9000) // Initialize with a random nonce
    },
    publicAddress: {
      allowNull: false,
      type: STRING,
      unique: true,
      validate: { isLowercase: true }
    },
    name: {
      type: STRING,
      unique: true
    },
    email: {
      type: STRING,
      unique: true
    },
    phone: {
      type: STRING,
      unique: true
    }
  },
  {
    modelName: 'user',
    sequelize, // This bit is important
    timestamps: false
  }
);

Event.init(
  {
    publicAddress: {
      allowNull: false,
      type: STRING,
      unique: true,
      validate: { isLowercase: true }
    },
    ownerAddress: {
      allowNull: false,
      type: STRING,
      unique: true,
      validate: { isLowercase: true }
    },
    name: {
      type: STRING,
      unique: true
    },
    description: {
      type: STRING,
      unique: true
    },
    location: {
      type: STRING,
      unique: true
    },
    startDate: {
      type: DATE,
      unique: true
    },
    endDate: {
      type: DATE,
      unique: true
    },
    quota: {
      type: INTEGER
    },
    physicalAddress: {
      type: TEXT
    }
  },
  {
    modelName: 'event',
    sequelize, // This bit is important
    timestamps: false
  }
);

// Create new tables
sequelize.sync();

export { sequelize };
