/**
 * @fileoverview Integration tests for the Express application (routes + middleware).
 * Tests the full request-response cycle for all registered endpoints.
 *
 * NOTE: Uses supertest to send real HTTP requests against the Express app
 * without starting a live server.
 */

import request from 'supertest';
import app from '../app';
import * as AIService from '../services/AIService';

// Mock AIService to avoid real Gemini calls
jest.mock('../services/AIService');

const mockGenerateChatResponse = AIService.generateChatResponse as jest.MockedFunction<
  typeof AIService.generateChatResponse
>;

beforeEach(() => {
  jest.clearAllMocks();
  mockGenerateChatResponse.mockResolvedValue('Integration test AI response');
});

// ─────────────────────────────────────────────────────────────────────────────
// Health endpoint
// ─────────────────────────────────────────────────────────────────────────────

describe('GET /health', () => {
  it('returns HTTP 200', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
  });

  it('returns status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.body.status).toBe('ok');
  });

  it('returns a message field', async () => {
    const res = await request(app).get('/health');
    expect(typeof res.body.message).toBe('string');
    expect(res.body.message.length).toBeGreaterThan(0);
  });

  it('returns a timestamp field', async () => {
    const res = await request(app).get('/health');
    expect(typeof res.body.timestamp).toBe('string');
    // Should be a valid ISO date
    const isoPattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    expect(res.body.timestamp).toMatch(isoPattern);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Chat endpoint — POST /api/chat
// ─────────────────────────────────────────────────────────────────────────────

describe('POST /api/chat', () => {
  describe('success cases', () => {
    it('returns HTTP 200 for valid request', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'Hello', role: 'fan', language: 'en' });
      expect(res.status).toBe(200);
    });

    it('returns { response: string } shape', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'Where is Gate D?', role: 'fan', language: 'en' });
      expect(typeof res.body.response).toBe('string');
      expect(res.body.response).toBe('Integration test AI response');
    });

    it('delegates to AIService with correct parameters', async () => {
      await request(app)
        .post('/api/chat')
        .send({ message: 'Crowd density?', role: 'staff', language: 'es' });
      expect(mockGenerateChatResponse).toHaveBeenCalledWith('Crowd density?', 'staff', 'es');
    });

    it('defaults role to fan when omitted', async () => {
      await request(app)
        .post('/api/chat')
        .send({ message: 'Hello', language: 'en' });
      expect(mockGenerateChatResponse).toHaveBeenCalledWith(
        expect.any(String),
        'fan',
        'en',
      );
    });

    it('defaults language to en when omitted', async () => {
      await request(app)
        .post('/api/chat')
        .send({ message: 'Hello', role: 'fan' });
      expect(mockGenerateChatResponse).toHaveBeenCalledWith(
        expect.any(String),
        'fan',
        'en',
      );
    });
  });

  describe('validation errors', () => {
    it('returns 400 when message is missing', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ role: 'fan' });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('returns 400 when message is empty string', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: '', role: 'fan' });
      expect(res.status).toBe(400);
    });

    it('returns 400 when message exceeds 500 chars', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'x'.repeat(501), role: 'fan' });
      expect(res.status).toBe(400);
    });

    it('returns error object for invalid request', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({});
      expect(res.body).toHaveProperty('error');
      expect(typeof res.body.error).toBe('string');
    });
  });

  describe('HTTP headers', () => {
    it('response Content-Type is application/json', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'Hello', role: 'fan', language: 'en' });
      expect(res.headers['content-type']).toMatch(/application\/json/);
    });

    it('rate limit headers are present', async () => {
      const res = await request(app)
        .post('/api/chat')
        .send({ message: 'Hello', role: 'fan', language: 'en' });
      // express-rate-limit standardHeaders=true adds RateLimit-* headers
      expect(
        res.headers['ratelimit-limit'] ?? res.headers['x-ratelimit-limit'],
      ).toBeDefined();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 404 for unknown routes
// ─────────────────────────────────────────────────────────────────────────────

describe('Unknown routes', () => {
  it('returns 404 for GET /unknown', async () => {
    const res = await request(app).get('/unknown');
    expect(res.status).toBe(404);
  });

  it('returns 404 for GET /api/unknown', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.status).toBe(404);
  });
});
