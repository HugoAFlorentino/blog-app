import express from 'express';
import { PORT } from './config/env.config.js';
import db_connection from './database/mongoose.connect.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

import userRouter from './routes/usersRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import authRouter from './routes/authRoutes.js';
import logRouter from './routes/logRoutes.js';
import mongoSanitize from 'express-mongo-sanitize';
import sanitizeBody from './middleware/sanitizeBody.js';
import subscriptionRouter from './routes/subscriptionRoutes.js';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4000',
  'https://blogify-press.netlify.app',
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(sanitizeBody);
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  next();
});
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
app.use('/api/v1', blogRouter);
app.use('/api/v1', authRouter);
app.use('/api/v1', logRouter);
app.use('/api/v1', subscriptionRouter);

app.listen(PORT, () => {
  console.log(`server is running at port: ${PORT}`);
  db_connection();
});
