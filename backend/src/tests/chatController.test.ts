/**
 * @fileoverview Unit tests for the chatController.
 * Tests validation logic, default application, input sanitisation,
 * and correct delegation to the AIService.
 */

import { Request, Response } from 'express';
import { handleChatRequest, ChatRequestBody } from '../controllers/chatController';
import * as AIService from '../services/AIService';

// Mock the AIService module so we control responses
jest.mock('../services/AIService');

const mockGenerateChatResponse = AIService.generateChatResponse as jest.MockedFunction<
  typeof AIService.generateChatResponse
>;

/**
 * Creates a minimal mock Express Request object.
 * @param body - The request body to use.
 */
const mockRequest = (body: Partial<ChatRequestBody> | Record<string, unknown>): Partial<Request> => ({ body });

/**
 * Creates a mock Express Response with jest-spied methods.
 */
const mockResponse = (): Partial<Response> & {
  status: jest.Mock;
  json: jest.Mock;
} => {
  const res: Partial<Response> & { status: jest.Mock; json: jest.Mock } = {
    status: jest.fn().mockReturnThis(),
    json:   jest.fn().mockReturnThis(),
  };
  return res;
};

beforeEach(() => {
  jest.clearAllMocks();
  mockGenerateChatResponse.mockResolvedValue('Mock AI response');
});

// ─────────────────────────────────────────────────────────────────────────────
// Validation tests
// ─────────────────────────────────────────────────────────────────────────────

describe('handleChatRequest — validation', () => {
  it('returns 400 when message is missing', async () => {
    const req = mockRequest({ role: 'fan', language: 'en' });
    const res = mockResponse();

    await handleChatRequest(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) }),
    );
  });

  it('returns 400 when message is null', async () => {
    const req = mockRequest({ message: null, role: 'fan' });
    const res = mockResponse();

    await handleChatRequest(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when message is a number (non-string)', async () => {
    const req = mockRequest({ message: 12345 });
    const res = mockResponse();

    await handleChatRequest(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when message is empty string', async () => {
    const req = mockRequest({ message: '' });
    const res = mockResponse();

    await handleChatRequest(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when message is only whitespace', async () => {
    const req = mockRequest({ message: '   ' });
    const res = mockResponse();

    await handleChatRequest(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('returns 400 when message exceeds 500 characters', async () => {
    const req = mockRequest({ message: 'a'.repeat(501) });
    const res = mockResponse();

    await handleChatRequest(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.stringContaining('500') }),
    );
  });

  it('strips HTML tags from message before delegating', async () => {
    const req = mockRequest({ message: '<script>alert("xss")</script>Hello', role: 'fan', language: 'en' });
    const res = mockResponse();

    await handleChatRequest(req as Request, res as Response);

    expect(mockGenerateChatResponse).toHaveBeenCalledWith(
      'Hello',
      'fan',
      'en',
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Default value tests
// ─────────────────────────────────────────────────────────────────────────────

describe('handleChatRequest — defaults', () => {
  it('defaults role to "fan" when role is not provided', async () => {
    const req = mockRequest({ message: 'Hello', language: 'en' });
    const res = mockResponse();

    await handleChatRequest(req as Request, res as Response);

    expect(mockGenerateChatResponse).toHaveBeenCalledWith(
      expect.any(String),
      'fan',
      expect.any(String),
    );
  });

  it('defaults role to "fan" for unknown role value', async () => {
    const req = mockRequest({ message: 'Hello', role: 'admin', language: 'en' });
    const res = mockResponse();

    await handleChatRequest(req as Request, res as Response);

    expect(mockGenerateChatResponse).toHaveBeenCalledWith(
      expect.any(String),
      'fan',
      expect.any(String),
    );
  });

  it('defaults language to "en" when language is not provided', async () => {
    const req = mockRequest({ message: 'Hello', role: 'fan' });
    const res = mockResponse();

    await handleChatRequest(req as Request, res as Response);

    expect(mockGenerateChatResponse).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      'en',
    );
  });

  it('passes role "staff" correctly', async () => {
    const req = mockRequest({ message: 'Crowd density?', role: 'staff', language: 'en' });
    const res = mockResponse();

    await handleChatRequest(req as Request, res as Response);

    expect(mockGenerateChatResponse).toHaveBeenCalledWith(
      expect.any(String),
      'staff',
      'en',
    );
  });

  it('passes language "es" correctly', async () => {
    const req = mockRequest({ message: 'Hola', role: 'fan', language: 'es' });
    const res = mockResponse();

    await handleChatRequest(req as Request, res as Response);

    expect(mockGenerateChatResponse).toHaveBeenCalledWith(
      expect.any(String),
      'fan',
      'es',
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Success path tests
// ─────────────────────────────────────────────────────────────────────────────

describe('handleChatRequest — success', () => {
  it('returns 200 with response on valid input', async () => {
    const req = mockRequest({ message: 'Where is Gate D?', role: 'fan', language: 'en' });
    const res = mockResponse();

    await handleChatRequest(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ response: 'Mock AI response' });
  });

  it('response body matches AIService return value', async () => {
    mockGenerateChatResponse.mockResolvedValue('Custom AI response for test');
    const req = mockRequest({ message: 'Hello', role: 'fan', language: 'en' });
    const res = mockResponse();

    await handleChatRequest(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledWith({ response: 'Custom AI response for test' });
  });

  it('accepts a 500-character message (boundary)', async () => {
    const req = mockRequest({ message: 'a'.repeat(500), role: 'fan', language: 'en' });
    const res = mockResponse();

    await handleChatRequest(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Error handling tests
// ─────────────────────────────────────────────────────────────────────────────

describe('handleChatRequest — error handling', () => {
  it('returns 500 when AIService throws', async () => {
    mockGenerateChatResponse.mockRejectedValue(new Error('Service error'));
    const req = mockRequest({ message: 'Hello', role: 'fan', language: 'en' });
    const res = mockResponse();

    await handleChatRequest(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) }),
    );
  });
});
