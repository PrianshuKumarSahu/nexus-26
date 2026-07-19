/**
 * @fileoverview Unit tests for shared application constants.
 * Verifies that all constants have the expected types and values,
 * providing a safety net against accidental mutation or misconfiguration.
 */

import {
  MAX_MESSAGE_LENGTH,
  CACHE_TTL_MS,
  REQUEST_TIMEOUT_MS,
  RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_MAX_REQUESTS,
  GEMINI_KEY_PLACEHOLDER,
  GEMINI_MODEL_ID,
  DEFAULT_ROLE,
  DEFAULT_LANGUAGE,
} from '../constants';

describe('Application Constants', () => {
  describe('MAX_MESSAGE_LENGTH', () => {
    it('is a number', () => expect(typeof MAX_MESSAGE_LENGTH).toBe('number'));
    it('is exactly 500', () => expect(MAX_MESSAGE_LENGTH).toBe(500));
    it('is positive', () => expect(MAX_MESSAGE_LENGTH).toBeGreaterThan(0));
  });

  describe('CACHE_TTL_MS', () => {
    it('is a number', () => expect(typeof CACHE_TTL_MS).toBe('number'));
    it('is 5 minutes in milliseconds', () => expect(CACHE_TTL_MS).toBe(300_000));
    it('is positive', () => expect(CACHE_TTL_MS).toBeGreaterThan(0));
  });

  describe('REQUEST_TIMEOUT_MS', () => {
    it('is a number', () => expect(typeof REQUEST_TIMEOUT_MS).toBe('number'));
    it('is 30 seconds in milliseconds', () => expect(REQUEST_TIMEOUT_MS).toBe(30_000));
    it('is less than CACHE_TTL_MS', () => expect(REQUEST_TIMEOUT_MS).toBeLessThan(CACHE_TTL_MS));
  });

  describe('RATE_LIMIT_WINDOW_MS', () => {
    it('is a number', () => expect(typeof RATE_LIMIT_WINDOW_MS).toBe('number'));
    it('is 15 minutes in milliseconds', () => expect(RATE_LIMIT_WINDOW_MS).toBe(900_000));
  });

  describe('RATE_LIMIT_MAX_REQUESTS', () => {
    it('is a number', () => expect(typeof RATE_LIMIT_MAX_REQUESTS).toBe('number'));
    it('is exactly 100', () => expect(RATE_LIMIT_MAX_REQUESTS).toBe(100));
    it('is positive', () => expect(RATE_LIMIT_MAX_REQUESTS).toBeGreaterThan(0));
  });

  describe('GEMINI_KEY_PLACEHOLDER', () => {
    it('is a string', () => expect(typeof GEMINI_KEY_PLACEHOLDER).toBe('string'));
    it('is non-empty', () => expect(GEMINI_KEY_PLACEHOLDER.length).toBeGreaterThan(0));
    it('contains YOUR_GEMINI_API_KEY', () => {
      expect(GEMINI_KEY_PLACEHOLDER).toContain('YOUR_GEMINI_API_KEY');
    });
  });

  describe('GEMINI_MODEL_ID', () => {
    it('is a string', () => expect(typeof GEMINI_MODEL_ID).toBe('string'));
    it('references gemini-1.5-flash', () => expect(GEMINI_MODEL_ID).toBe('gemini-1.5-flash'));
  });

  describe('DEFAULT_ROLE', () => {
    it('is "fan"', () => expect(DEFAULT_ROLE).toBe('fan'));
  });

  describe('DEFAULT_LANGUAGE', () => {
    it('is "en"', () => expect(DEFAULT_LANGUAGE).toBe('en'));
  });

  describe('Inter-constant relationships', () => {
    it('CACHE_TTL_MS is greater than REQUEST_TIMEOUT_MS', () => {
      expect(CACHE_TTL_MS).toBeGreaterThan(REQUEST_TIMEOUT_MS);
    });

    it('RATE_LIMIT_WINDOW_MS is greater than CACHE_TTL_MS', () => {
      expect(RATE_LIMIT_WINDOW_MS).toBeGreaterThan(CACHE_TTL_MS);
    });
  });
});
