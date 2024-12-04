import dotenv from 'dotenv';
dotenv.config();

import { setupServer } from './server.js';
import connectDB from '../src/mongo.js';
import importContacts from '../src/scripts/importContacts.js';

connectDB()
    .then(async () => {
        await importContacts();
        setupServer();
    })
    .catch(err => {
        console.error('Не вдалося підключитися до MongoDB:', err);
    });
