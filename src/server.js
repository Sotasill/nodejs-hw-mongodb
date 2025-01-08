import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import { getEnvVars } from './utils/getEnvVars.js';

const PORT = Number(getEnvVars('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(
    cors({
      credentials: true,
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
    }),
  );
  app.use(cookieParser());

  app.use('/auth', authRouter);
  app.use('/contact', contactsRouter);

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'server is running on port 3000',
    });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
