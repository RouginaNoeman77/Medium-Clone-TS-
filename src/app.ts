import express from 'express';
import * as dotenv from 'dotenv';
import connectDB from './config/database';
import userRoutes from './routes/userRoutes';
import articleRoutes from './routes/articleRoutes';
import tagRoutes from './routes/tagRoutes';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/tags', tagRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
