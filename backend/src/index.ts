import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import productRoutes from './routes/productRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/products', productRoutes);

app.get('/health', (_req, res) => {
    res.json({ status: 'OK', message: 'EMI Products API is running' });
});

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();
