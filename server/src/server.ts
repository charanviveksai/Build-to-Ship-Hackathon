import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ENV } from './config/env';

import authRoutes from './routes/auth';
import appsRoutes from './routes/apps';
import faceRoutes from './routes/face';
import securityRoutes from './routes/security';
import aiRoutes from './routes/ai';
import dashboardRoutes from './routes/dashboard';
import settingsRoutes from './routes/settings';

const app = express();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use(limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'LockMe AI Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', authRoutes);
app.use('/api/apps', appsRoutes);
app.use('/api/face', faceRoutes);
app.use('/api', securityRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);

// Global 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

const PORT = parseInt(ENV.PORT, 10) || 5000;
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🛡️ LockMe AI Server running on port ${PORT}`);
  console.log(`🔒 Health check: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});

export default app;
