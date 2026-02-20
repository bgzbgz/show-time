import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';

const app: Express = express();

// =============================================================================
// Middleware
// =============================================================================

// Security headers
app.use(helmet());

// CORS configuration
console.log('🔓 CORS Origins:', config.CORS_ORIGIN);
app.use(
  cors({
    origin: config.NODE_ENV === 'development' ? '*' : config.CORS_ORIGIN.split(','),
    credentials: config.CORS_CREDENTIALS,
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// =============================================================================
// Routes
// =============================================================================

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
  });
});

// Import routes
import authRoutes from './routes/auth.js';
import toolRoutes from './routes/tools.js';
import userRoutes from './routes/user.js';
import dataRoutes from './routes/data.js';
import aiRoutes from './routes/ai.js';
import guruRoutes from './routes/guru.js';
import learnworldsRoutes from './routes/learnworlds.js';
import webhookRoutes from './routes/webhooks.js';

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/user', userRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/guru', guruRoutes);
app.use('/api/learnworlds', learnworldsRoutes);
app.use('/api/webhooks', webhookRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource does not exist',
  });
});

// =============================================================================
// Error Handling
// =============================================================================

app.use(errorHandler);

// =============================================================================
// Server Startup
// =============================================================================

const PORT = config.APP_PORT;

async function startServer() {
  try {
    // Load tool registry
    const { toolService } = await import('./services/ToolService.js');
    await toolService.loadToolRegistry();

    // Load dependency configuration and orchestrator
    const { toolOrchestrator } = await import('./services/ToolOrchestrator.js');
    await toolOrchestrator.loadDependencyConfig();

    // Validate dependency graph
    const { validateDependencyGraph } = await import('./utils/dependencyGraph.js');
    // Note: Config will be loaded by orchestrator, validation will happen there
    // For now, we trust the loaded config is valid

    console.log('✓ Dependency orchestrator initialized');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Fast Track Backend running on port ${PORT}`);
      console.log(`📝 Environment: ${config.NODE_ENV}`);
      console.log(`🔗 API Base: ${config.APP_URL}/api`);
      console.log(`❤️  Health Check: ${config.APP_URL}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
