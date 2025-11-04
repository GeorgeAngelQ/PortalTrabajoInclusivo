import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

import helmet from 'helmet';
import xss from 'xss-clean';
import MongoSanitize from 'express-mongo-sanitize';
import connectDB from './config/db.js';

import testRoutes from './routes/testRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

import errorMiddleware from './Middlewares/errorMiddleware.js';

dotenv.config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
app.use(helmet(``));
app.use(xss());
app.use(MongoSanitize())
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobRoutes);
app.use(errorMiddleware);