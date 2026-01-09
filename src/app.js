import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bossRoutes from './routes/bossRoutes.js';
import newsRoutes from './routes/newsRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(join(__dirname, '../public')));

app.use('/api/bosses', bossRoutes);
app.use('/api/news', newsRoutes);

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, '../public/index.html'));
});

app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `Cannot ${req.method} ${req.url}`
    });
});

export default app;