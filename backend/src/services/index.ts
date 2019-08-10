import * as express from 'express';

import { authRouter } from './auth';
import { userRouter } from './users';
import { eventRouter } from './event';

export const services = express.Router();

services.use('/auth', authRouter);
services.use('/users', userRouter);
services.use('/events', eventRouter);
