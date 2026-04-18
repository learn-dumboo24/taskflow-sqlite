import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import followUpRoutes from './routes/followUpRoutes';
import errorHandler from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/followups', followUpRoutes);

app.use(errorHandler);

export default app;
