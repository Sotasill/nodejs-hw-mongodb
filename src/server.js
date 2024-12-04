import express from 'express';
import cors from 'cors';
import pino from 'express-pino-logger';
import { getContacts } from './controllers/contactController.js';

export function setupServer() {
    const app = express();
    
    app.use(cors());
    
    const logger = pino();
    app.use(logger);

    app.use((req, res) => {
        res.status(404).json({ message: 'Not found' });
    });

    const PORT = process.env.PORT || 3000;

    app.get('/contacts', getContacts);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
