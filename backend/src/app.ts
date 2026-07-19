/**
 * @fileoverview Express application factory for the FIFA 26 Smart Assist API.
 *
 * This module exports the configured `app` instance for use in tests and
 * other modules. The server is started separately in `index.ts`.
 *
 * @module app
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import chatRoutes from './routes/chatRoutes';
import {
  REQUEST_TIMEOUT_MS,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
} from './constants';

const app = express();

// ── Security Middleware ────────────────────────────────────────────────────────
/** Helmet sets 15+ secure HTTP response headers (CSP, HSTS, X-Frame-Options, …) */
app.use(helmet());

/** CORS — permit all origins in development; restrict in production via env */
app.use(cors());

/** JSON body parser */
app.use(express.json());

// ── Request Timeout Middleware ────────────────────────────────────────────────
/**
 * Enforces a maximum request processing time.
 * Responds with HTTP 503 if the handler does not complete within the timeout.
 */
app.use((_req: Request, res: Response, next: NextFunction): void => {
  const timer = setTimeout(() => {
    if (!res.headersSent) {
      res.status(503).json({ error: 'Request timed out. Please try again.' });
    }
  }, REQUEST_TIMEOUT_MS);

  res.on('finish', () => clearTimeout(timer));
  res.on('close',  () => clearTimeout(timer));

  next();
});

// ── Rate Limiting ─────────────────────────────────────────────────────────────
/**
 * Rate-limiter applied to all `/api/` routes.
 * Prevents DDoS and brute-force attacks on the Gemini API.
 * Allows up to 100 requests per IP per 15-minute window.
 */
const apiLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/chat', chatRoutes);

/**
 * Health-check endpoint.
 * Returns HTTP 200 with a status payload to confirm the server is alive.
 */
app.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'ok',
    message: 'FIFA 26 Smart Assist API is running',
    timestamp: new Date().toISOString(),
  });
});

export default app;
