/**
 * @fileoverview Unit tests for the logger utility.
 * Tests all four log levels, timestamp format, and structured context handling.
 */

import { logger } from '../utils/logger';

describe('logger', () => {
  let consoleSpy: {
    log:   jest.SpyInstance;
    warn:  jest.SpyInstance;
    error: jest.SpyInstance;
    debug: jest.SpyInstance;
  };

  beforeEach(() => {
    consoleSpy = {
      log:   jest.spyOn(console, 'log').mockImplementation(() => {}),
      warn:  jest.spyOn(console, 'warn').mockImplementation(() => {}),
      error: jest.spyOn(console, 'error').mockImplementation(() => {}),
      debug: jest.spyOn(console, 'debug').mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // ── Level routing ────────────────────────────────────────────────────────
  describe('level routing', () => {
    it('info() calls console.log', () => {
      logger.info('test info message');
      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
      expect(consoleSpy.warn).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
    });

    it('warn() calls console.warn', () => {
      logger.warn('test warning');
      expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it('error() calls console.error', () => {
      logger.error('test error');
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });

    it('debug() calls console.debug', () => {
      logger.debug('test debug');
      expect(consoleSpy.debug).toHaveBeenCalledTimes(1);
      expect(consoleSpy.log).not.toHaveBeenCalled();
    });
  });

  // ── Format checks ────────────────────────────────────────────────────────
  describe('log format', () => {
    it('info output contains [INFO] prefix', () => {
      logger.info('my info message');
      const call = consoleSpy.log.mock.calls[0][0] as string;
      expect(call).toContain('[INFO]');
    });

    it('warn output contains [WARN] prefix', () => {
      logger.warn('my warn message');
      const call = consoleSpy.warn.mock.calls[0][0] as string;
      expect(call).toContain('[WARN]');
    });

    it('error output contains [ERROR] prefix', () => {
      logger.error('my error message');
      const call = consoleSpy.error.mock.calls[0][0] as string;
      expect(call).toContain('[ERROR]');
    });

    it('debug output contains [DEBUG] prefix', () => {
      logger.debug('my debug message');
      const call = consoleSpy.debug.mock.calls[0][0] as string;
      expect(call).toContain('[DEBUG]');
    });

    it('output contains the provided message', () => {
      logger.info('unique-message-abc123');
      const call = consoleSpy.log.mock.calls[0][0] as string;
      expect(call).toContain('unique-message-abc123');
    });

    it('output contains a valid ISO-8601 timestamp', () => {
      logger.info('timestamp test');
      const call = consoleSpy.log.mock.calls[0][0] as string;
      // ISO-8601: e.g. 2026-07-19T10:30:00.000Z
      const isoPattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z/;
      expect(call).toMatch(isoPattern);
    });
  });

  // ── Context serialisation ────────────────────────────────────────────────
  describe('context serialisation', () => {
    it('includes JSON-serialised object context', () => {
      logger.info('with context', { port: 3001 });
      const call = consoleSpy.log.mock.calls[0][0] as string;
      expect(call).toContain('"port":3001');
    });

    it('includes string context as-is', () => {
      logger.warn('with string context', 'extra-info');
      const call = consoleSpy.warn.mock.calls[0][0] as string;
      expect(call).toContain('extra-info');
    });

    it('includes numeric context as string', () => {
      logger.error('with numeric context', 42);
      const call = consoleSpy.error.mock.calls[0][0] as string;
      expect(call).toContain('42');
    });

    it('omits context section when context is undefined', () => {
      logger.info('no context message');
      const call = consoleSpy.log.mock.calls[0][0] as string;
      expect(call).not.toContain('context=');
    });

    it('handles nested object context correctly', () => {
      logger.debug('nested context', { route: '/api/chat', user: { role: 'fan' } });
      const call = consoleSpy.debug.mock.calls[0][0] as string;
      expect(call).toContain('fan');
    });
  });

  // ── Variadic args ─────────────────────────────────────────────────────────
  describe('variadic args', () => {
    it('forwards additional args to console.log', () => {
      logger.info('message', undefined, 'extra-arg-1', 'extra-arg-2');
      const args = consoleSpy.log.mock.calls[0];
      expect(args).toContain('extra-arg-1');
      expect(args).toContain('extra-arg-2');
    });
  });
});
