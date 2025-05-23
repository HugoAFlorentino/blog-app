import express from 'express';
import { PORT } from './config/env.config.js';
import db_connection from './database/mongoose.connect.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userRouter from './routes/usersRoutes.js';

const app = express();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:4000'];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use('/api/v1', userRouter);

app.listen(PORT, () => {
  console.log(`server is running at port: ${PORT}`);
  db_connection();
});
