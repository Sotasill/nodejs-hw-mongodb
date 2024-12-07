import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getEnvVars } from './utils/getEnvVars.js';
import { getAllContacts, getContactById } from './services/contacts.js';

const PORT = Number(getEnvVars('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Good',
    });
  });

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await getAllContacts();
      res.status(200).json({
        status: 'success',
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: 'Failed to fetch contacts',
        error: err.message,
      });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const contact = await getContactById(contactId);

      if (!contact) {
        return res.status(404).json({
          status: 404,
          message: `Contact with id ${contactId} not found`,
        });
      }

      res.status(200).json({
        status: 'success',
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (err) {
      res.status(500).json({
        status: 500,
        message: 'Failed to fetch contact',
        error: err.message,
      });
    }
  });

  app.use('*', (req, res) => {
    res.status(404).json({
      status: 'error',
      message: 'Not found',
    });
  });

  app.use((err, req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
