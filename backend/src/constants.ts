/**
 * @fileoverview Shared application constants for the FIFA 26 Smart Assist API.
 *
 * Centralising constants in one module avoids magic numbers scattered across
 * files and makes them easy to tune, document, and test.
 *
 * @module constants
 */

/** Maximum permitted length (in characters) for a chat message payload. */
export const MAX_MESSAGE_LENGTH = 500;

/** Cache time-to-live in milliseconds (5 minutes = 300,000 ms). */
export const CACHE_TTL_MS = 300_000;

/** Request timeout applied at the Express middleware layer (30 seconds = 30,000 ms). */
export const REQUEST_TIMEOUT_MS = 30_000;

/** Rate-limit window duration in milliseconds (15 minutes = 900,000 ms). */
export const RATE_LIMIT_WINDOW_MS = 900_000;

/** Maximum number of requests allowed per IP per rate-limit window. */
export const RATE_LIMIT_MAX_REQUESTS = 100;

/** Placeholder value that indicates no real Gemini API key has been configured. */
export const GEMINI_KEY_PLACEHOLDER = 'YOUR_GEMINI_API_KEY_HERE';

/** Gemini model identifier used for content generation. */
export const GEMINI_MODEL_ID = 'gemini-1.5-flash';

/** Default user role applied when the request omits the `role` field. */
export const DEFAULT_ROLE = 'fan' as const;

/** Default language code applied when the request omits the `language` field. */
export const DEFAULT_LANGUAGE = 'en' as const;
