import Router from 'express';
import { getLogs } from '../controllers/log.controllers.js';
import authenticateUser from '../middleware/authUser.js';

const logRouter = Router();

logRouter.get('/logs', authenticateUser, getLogs);

export default logRouter;
