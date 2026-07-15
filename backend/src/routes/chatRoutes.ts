import { Router } from 'express';
import { handleChatRequest } from '../controllers/chatController';

const router = Router();

/**
 * Router configuration for GenAI chat endpoint.
 * Maps POST /api/chat to the handleChatRequest controller.
 */
router.post('/', handleChatRequest);

export default router;
