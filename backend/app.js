import express from 'express';
import { PORT } from './config/env.config.js';
import db_connection from './database/mongoose.connect.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import sendEmail from './utils/sendEmail.js';

import userRouter from './routes/usersRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import authRouter from './routes/authRoutes.js';

const app = express();

const allowedOrigins = ['http://localhost:5173', 'http://localhost:4000'];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());

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

app.get('/api/v1/test-email', async (req, res) => {
  try {
    await sendEmail(
      'hugoflorentino86@gmail.com',
      'Test Email',
      '<h1>Hello from test route!</h1>'
    );
    res.status(200).send('Test email sent successfully');
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).send('Failed to send test email');
  }
});

app.use('/api/v1', userRouter);
app.use('/api/v1', blogRouter);
app.use('/api/v1', authRouter);

app.listen(PORT, () => {
  console.log(`server is running at port: ${PORT}`);
  db_connection();
});
