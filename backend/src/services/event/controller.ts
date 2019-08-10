import { NextFunction, Request, Response } from 'express';

import { Event } from '../../models/event.model';

export const find = (req: Request, res: Response, next: NextFunction) => {
  // If a query string ?ownerAddress=... is given, then filter results
  const whereClause = req.query &&
    req.query.ownerAddress && {
      where: { ownerAddress: req.query.ownerAddress }
    };

  return Event.findAll(whereClause)
    .then(events => res.json(events))
    .catch(err=>res.status(400).json({message:err.message}));
};

export const get = (req: Request, res: Response, next: NextFunction) => {
  return Event.findOne({
    where: {publicAddress: req.params.address}
  }).then(event => res.json(event))
  .catch(err=>res.status(400).json({message:err.message}));
};

export const create = (req: Request, res: Response, next: NextFunction) =>
  Event.create(req.body)
    .then(event => res.json(event))
    .catch(err=>res.status(400).json({message:err.message}));