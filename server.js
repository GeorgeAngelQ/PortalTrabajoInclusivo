import express, { application } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

import helmet from 'helmet';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import enterpriseRoutes from './routes/enterpriseRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import errorMiddleware from './Middlewares/errorMiddleware.js';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3001;


app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobRoutes);
app.use("/api/v1/enterprise", enterpriseRoutes);
app.use("/api/v1/application", applicationRoutes);
app.use(errorMiddleware);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});