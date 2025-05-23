import express from 'express';
import { PORT } from './config/env.config.js';
import db_connection from './database/mongoose.connect.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userRouter from './routes/usersRoutes.js';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:4000' }));

app.use('/api/v1', userRouter);

app.listen(PORT, () => {
  console.log(`server is running at port: ${PORT}`);
  db_connection();
});
