/**
 * Calculator MCP Server
 * 
 * Main entry point for the MCP server.
 * Uses the @McpApp decorator pattern for clean, NestJS-style architecture.
 * 
 * Transport Configuration:
 * - Development (NODE_ENV=development): STDIO only
 * - Production (NODE_ENV=production): Dual transport (STDIO + HTTP SSE)
 */

import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import dns from 'dns';

// Ensure working directory is set to the project root FIRST before loading .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
process.chdir(projectRoot);

// Load .env explicitly from project root
dotenv.config({ path: path.join(projectRoot, '.env') });

import { McpApplicationFactory } from '@nitrostack/core';
import { AppModule } from './app.module.js';

// Configure DNS fallback for MongoDB SRV queries on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Fallback to system default DNS if setting servers fails
}

// Redirect non-JSON stdout writes (logs, banners) to stderr so MCP stdio protocol is never corrupted
const originalStdoutWrite = process.stdout.write.bind(process.stdout);
(process.stdout as any).write = (chunk: any, encoding?: any, callback?: any): boolean => {
  const str = chunk.toString();
  if (str.trim().startsWith('{')) {
    return originalStdoutWrite(chunk, encoding, callback);
  } else {
    return process.stderr.write(chunk, encoding, callback);
  }
};

/**
 * Bootstrap the application
 */
async function bootstrap() {
  // Create and start the MCP server
  const server = await McpApplicationFactory.create(AppModule);
  await server.start();
}

// Start the application
bootstrap().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
