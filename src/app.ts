import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import todoRoutes from './routes/todos';

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use('/api/todos', todoRoutes);

export default app;