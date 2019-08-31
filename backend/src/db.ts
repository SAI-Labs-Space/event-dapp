import * as path from 'path';
import * as os from 'os';
import { INTEGER, Sequelize, STRING,DATE, TEXT, BOOLEAN } from 'sequelize';

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
      type: STRING
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
      validate: { isLowercase: true }
    },
    ownerAddress: {
      allowNull: false,
      type: STRING,
      validate: { isLowercase: true }
    },
    name: {
      type: STRING
    },
    description: {
      type: STRING
    },
    location: {
      type: STRING
    },
    startDate: {
      type: DATE
    },
    endDate: {
      type: DATE
    },
    quota: {
      type: INTEGER
    },
    physicalAddress: {
      type: TEXT
    },
    disbursed: {
      type: BOOLEAN,
      defaultValue: false
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
