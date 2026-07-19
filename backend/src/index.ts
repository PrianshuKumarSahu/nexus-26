/**
 * @fileoverview Express application entry point for the FIFA 26 Smart Assist API.
 *
 * Imports the configured app instance and starts the HTTP server with
 * graceful shutdown support for SIGTERM and SIGINT signals.
 *
 * @module index
 */

import dotenv from 'dotenv';
import app from './app';
import { logger } from './utils/logger';

dotenv.config();

const port = process.env.PORT || 3001;

// ── Server Startup ────────────────────────────────────────────────────────────
/**
 * Starts the HTTP server and registers graceful shutdown handlers
 * for SIGTERM and SIGINT signals (e.g. container stop, Ctrl-C).
 */
const startServer = (): void => {
  const server = app.listen(port, () => {
    logger.info('FIFA 26 Smart Assist API started', { port });
  });

  /**
   * Gracefully shuts down the server by stopping new connections
   * and allowing in-flight requests to complete.
   *
   * @param signal - The received OS signal name.
   */
  const gracefulShutdown = (signal: string): void => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(() => {
      logger.info('Server closed. Exiting process.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT',  () => gracefulShutdown('SIGINT'));
};

startServer();
