import * as express from 'express';
import * as jwt from 'express-jwt';

import { config } from '../../config';
import * as controller from './controller';

export const eventRouter = express.Router();

/** GET /api/events */
eventRouter.route('/').get(controller.find);

/** GET /api/events/:address */
// eventRouter
//   .route('/:address')
//   .get(controller.get);

/** POST /api/events */
/** Authenticated route */
//eventRouter.route('/').post(jwt({ secret: config.secret }),controller.create);
eventRouter.route('/').post(controller.create);
