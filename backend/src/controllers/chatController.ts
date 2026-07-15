import { Request, Response } from 'express';
import { generateChatResponse } from '../services/AIService';

/**
 * Controller to handle chat requests from the frontend.
 * Validates input and delegates to the AIService.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 */
export const handleChatRequest = async (req: Request, res: Response) => {
  try {
    const { message, role, language } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const aiResponse = await generateChatResponse(message, role || 'fan', language || 'en');
    
    return res.status(200).json({
      response: aiResponse,
    });
  } catch (error) {
    console.error('Error handling chat request:', error);
    return res.status(500).json({ error: 'Internal server error processing chat request.' });
  }
};
