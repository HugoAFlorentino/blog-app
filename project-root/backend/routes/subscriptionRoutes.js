import { Router } from 'express';
import { sendThankYou } from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

subscriptionRouter.post('/subscription/thank-you', sendThankYou);

export default subscriptionRouter;
