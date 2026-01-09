import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Elden Ring API is running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/`);
});