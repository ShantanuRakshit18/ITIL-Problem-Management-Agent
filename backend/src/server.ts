import express, { Express, Request, Response } from 'express';
import { config } from './config/env';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import uploadRoutes from './routes/upload';
import analysisRoutes from './routes/analysis';
import exportRoutes from './routes/export';

const app: Express = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// API Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/export', exportRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    code: 'NOT_FOUND',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(
    `✅ ITIL Problem Management Agent Server running on port ${PORT}`
  );
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Upload directory: ${config.uploadDir}`);
});

export default app;
