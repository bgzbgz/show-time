import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// =============================================================================
// Environment Variable Schema
// =============================================================================

const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_NAME: z.string().default('fast-track-backend'),
  APP_PORT: z.coerce.number().int().positive().default(3000),
  APP_URL: z.string().url().default('http://localhost:3000'),

  // Database
  DATABASE_URL: z.string().url(),
  DB_HOST: z.string().optional(),
  DB_PORT: z.coerce.number().int().positive().optional(),
  DB_NAME: z.string().optional(),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DB_SSL: z.coerce.boolean().default(true),

  // JWT Authentication
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRY: z.string().default('24h'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // Supabase
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),

  // LearnWorlds SSO
  LEARNWORLDS_API_URL: z.string().url().default('https://api.learnworlds.com/v2'),
  LEARNWORLDS_API_KEY: z.string().optional(),
  LEARNWORLDS_API_SECRET: z.string().optional(),
  LEARNWORLDS_SCHOOL_ID: z.string().optional(),
  LEARNWORLDS_SSO_SECRET: z.string().optional(),
  LEARNWORLDS_WEBHOOK_SECRET: z.string().optional(),

  // API Configuration
  API_BASE_PATH: z.string().default('/api'),
  API_VERSION: z.string().default('v1'),

  // Frontend URL (for redirects after auth)
  FRONTEND_URL: z.string().url().optional(),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  CORS_CREDENTIALS: z.coerce.boolean().default(true),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000), // 15 min
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
  EXPORT_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
  EXPORT_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(3600000), // 1 hour
  AI_RATE_LIMIT_USER: z.coerce.number().int().positive().default(10),
  AI_RATE_LIMIT_ADMIN: z.coerce.number().int().positive().default(50),
  AI_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(3600000), // 1 hour

  // External Integrations
  N8N_WEBHOOK_URL: z.string().url().optional(),
  N8N_TIMEOUT_MS: z.coerce.number().int().positive().default(30000),

  // Anthropic AI (Claude) — for AI Challenge Layer
  ANTHROPIC_API_KEY: z.string().optional(),

  // PDF Export
  PUPPETEER_EXECUTABLE_PATH: z.string().optional(),
  PDF_EXPORT_TIMEOUT_MS: z.coerce.number().int().positive().default(60000),
  LARGE_SUBMISSION_THRESHOLD_MB: z.coerce.number().positive().default(1),

  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  LOG_FILE_PATH: z.string().default('./logs'),
  LOG_MAX_FILES: z.coerce.number().int().positive().default(14),
  LOG_MAX_SIZE: z.string().default('20m'),

  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_URL: z.string().optional(),

  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ENVIRONMENT: z.string().default('development'),

  // Feature Flags
  ENABLE_AI_INTEGRATION: z.coerce.boolean().default(true),
  ENABLE_PDF_EXPORT: z.coerce.boolean().default(true),
  ENABLE_SWAGGER_UI: z.coerce.boolean().default(true),

  // Development
  DEBUG: z.string().optional(),
  ENABLE_QUERY_LOGGING: z.coerce.boolean().default(false),
});

// =============================================================================
// Parse and Validate Environment Variables
// =============================================================================

function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

export const config = validateEnv();

// =============================================================================
// Type Exports
// =============================================================================

export type Config = z.infer<typeof envSchema>;

// =============================================================================
// Configuration Summary (for debugging)
// =============================================================================

export function logConfig(): void {
  console.log('📋 Configuration Summary:');
  console.log(`  Environment: ${config.NODE_ENV}`);
  console.log(`  App Name: ${config.APP_NAME}`);
  console.log(`  Port: ${config.APP_PORT}`);
  console.log(`  Database: ${config.DB_HOST ? `${config.DB_HOST}:${config.DB_PORT}` : 'via DATABASE_URL'}`);
  console.log(`  JWT Expiry: ${config.JWT_EXPIRY}`);
  console.log(`  CORS Origin: ${config.CORS_ORIGIN}`);
  console.log(`  AI Integration: ${config.ENABLE_AI_INTEGRATION ? 'enabled' : 'disabled'}`);
  console.log(`  PDF Export: ${config.ENABLE_PDF_EXPORT ? 'enabled' : 'disabled'}`);
}
