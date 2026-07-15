import { Router } from 'express';
import { handleChatRequest } from '../controllers/chatController';

const router = Router();

// Route for handling GenAI chat requests
router.post('/', handleChatRequest);

export default router;
