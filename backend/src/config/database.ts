import { PrismaClient } from '@prisma/client';
import { config } from './env.js';

// =============================================================================
// Prisma Client Singleton
// =============================================================================

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      config.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
    errorFormat: 'pretty',
  });

if (config.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// =============================================================================
// Database Connection Health Check
// =============================================================================

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✓ Database connection established');
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    return false;
  }
}

// =============================================================================
// Graceful Shutdown
// =============================================================================

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  console.log('Database disconnected');
}

// Handle shutdown signals
process.on('beforeExit', async () => {
  await disconnectDatabase();
});

// =============================================================================
// Cross-Schema Query Helpers
// =============================================================================

/**
 * Execute raw SQL query across schemas
 * Useful for cross-tool dependency queries
 */
export async function queryRaw<T = unknown>(sql: string, values?: unknown[]): Promise<T> {
  return prisma.$queryRawUnsafe<T>(sql, ...(values ?? []));
}

/**
 * Execute SQL in a transaction
 */
export async function transaction<T>(
  fn: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(fn);
}

// =============================================================================
// Schema Helper Functions
// =============================================================================

/**
 * Get schema name from tool slug
 * Example: 'know-thyself' → 'sprint_01_know_thyself'
 */
export function getSchemaName(toolSlug: string, sprintNumber: number): string {
  const paddedNumber = sprintNumber.toString().padStart(2, '0');
  const schemaSlug = toolSlug.replace(/-/g, '_');
  return `sprint_${paddedNumber}_${schemaSlug}`;
}

/**
 * Get table name with schema prefix
 * Example: ('sprint_01_know_thyself', 'submissions') → 'sprint_01_know_thyself.submissions'
 */
export function getFullTableName(schemaName: string, tableName: string): string {
  return `${schemaName}.${tableName}`;
}
