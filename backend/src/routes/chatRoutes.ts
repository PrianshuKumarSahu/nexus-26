/**
 * @fileoverview Route definitions for the GenAI chat API.
 *
 * Maps HTTP verbs and paths to their respective controller handlers.
 * All routes in this module are mounted under `/api/chat` by the application.
 *
 * @module chatRoutes
 */

import { Router } from 'express';
import { handleChatRequest } from '../controllers/chatController';

const router = Router();

/**
 * POST `/api/chat`
 *
 * Accepts a chat message from a fan or staff member and returns an
 * AI-generated response. See {@link handleChatRequest} for full validation
 * and response contract details.
 *
 * @example
 * // Request body
 * { "message": "Where is Gate D?", "role": "fan", "language": "en" }
 *
 * // Success response (200)
 * { "response": "🗺️ To avoid Gate C (85% congested)..." }
 *
 * // Error response (400)
 * { "error": "Message is required and must be a string." }
 */
router.post('/', handleChatRequest);

export default router;
