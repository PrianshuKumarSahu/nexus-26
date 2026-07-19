/**
 * @fileoverview Controller for the GenAI chat endpoint.
 *
 * Orchestrates request validation, input normalisation, AI response generation,
 * and structured HTTP response formation. Delegates all business logic to
 * {@link AIService} and all input handling to {@link validation}.
 *
 * @module chatController
 */

import { Request, Response } from 'express';
import { generateChatResponse } from '../services/AIService';
import { validateMessage, normalizeRole, normalizeLanguage, sanitizeInput } from '../utils/validation';
import { logger } from '../utils/logger';

/**
 * Expected shape of the request body for the POST `/api/chat` endpoint.
 */
export interface ChatRequestBody {
  /** The user's question or command in any supported language. */
  message?: unknown;
  /** The user's role context. Defaults to `'fan'` if omitted or invalid. */
  role?: unknown;
  /** The ISO 639-1 language code for the response. Defaults to `'en'`. */
  language?: unknown;
}

/**
 * Handles incoming POST `/api/chat` requests.
 *
 * Execution flow:
 * 1. Validate the `message` field using {@link validateMessage}.
 * 2. Sanitise the message with {@link sanitizeInput}.
 * 3. Normalise `role` and `language` using their respective helpers.
 * 4. Delegate to {@link generateChatResponse} to produce the AI response.
 * 5. Return HTTP 200 `{ response }` on success.
 *
 * @param req - The Express request object. Body should conform to {@link ChatRequestBody}.
 * @param res - The Express response object.
 * @returns HTTP 200 with `{ response: string }` on success,
 *          HTTP 400 for validation failures, or HTTP 500 for unexpected errors.
 */
export const handleChatRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, role, language } = req.body as ChatRequestBody;

    // ── Validate message ───────────────────────────────────────────────────────
    const validation = validateMessage(message);
    if (!validation.valid) {
      res.status(400).json({ error: validation.error });
      return;
    }

    // Safe to cast: validateMessage confirms it is a non-empty string
    const sanitized = sanitizeInput(message as string);

    // ── Normalise role and language ────────────────────────────────────────────
    const safeRole     = normalizeRole(role);
    const safeLanguage = normalizeLanguage(language);

    // ── Generate AI response ───────────────────────────────────────────────────
    const aiResponse = await generateChatResponse(sanitized, safeRole, safeLanguage);

    res.status(200).json({ response: aiResponse });
  } catch (error) {
    logger.error('Unhandled error in handleChatRequest', { error: String(error) });
    res.status(500).json({ error: 'Internal server error processing chat request.' });
  }
};
