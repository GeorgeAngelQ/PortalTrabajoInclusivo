import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import testRoutes from './routes/testRoutes.js';
import authRoutes from './routes/authRoutes.js';
import morgan from 'morgan';
import cors from 'cors';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);