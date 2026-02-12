import { beforeAll, afterAll, beforeEach, vi } from 'vitest';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// =============================================================================
// Global Test Setup
// =============================================================================

beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  process.env.JWT_SECRET = 'test_jwt_secret_at_least_32_characters_long_12345';
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
  process.env.N8N_WEBHOOK_URL = 'http://localhost:5678/webhook-test';

  console.log('🧪 Test environment initialized');
});

afterAll(async () => {
  console.log('✅ Test suite completed');
});

beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks();
});

// =============================================================================
// Global Mocks
// =============================================================================

// Mock logger to avoid console spam during tests
vi.mock('../src/middleware/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
  requestLogger: vi.fn((req, res, next) => next()),
}));

// Mock Prisma for unit tests (can be overridden in specific test files)
vi.mock('../src/config/database.js', async () => {
  const actual = await vi.importActual('../src/config/database.js');
  return {
    ...actual,
    prisma: {
      users: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      user_progress: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        upsert: vi.fn(),
        createMany: vi.fn(),
      },
      organizations: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
    },
    queryRaw: vi.fn(),
  };
});
