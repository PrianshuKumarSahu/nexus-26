/**
 * @fileoverview Comprehensive unit tests for the input validation utilities.
 * Tests sanitizeInput, validateMessage, normalizeRole, and normalizeLanguage
 * across all boundary conditions, edge cases, and type variants.
 */

import {
  sanitizeInput,
  validateMessage,
  normalizeRole,
  normalizeLanguage,
} from '../utils/validation';

// ─────────────────────────────────────────────────────────────────────────────
// sanitizeInput()
// ─────────────────────────────────────────────────────────────────────────────

describe('sanitizeInput()', () => {
  describe('script tag removal', () => {
    it('removes a basic <script> tag and its content', () => {
      expect(sanitizeInput('<script>alert("xss")</script>Hello')).toBe('Hello');
    });

    it('removes <script> with type attribute', () => {
      expect(sanitizeInput('<script type="text/javascript">evil()</script>Safe')).toBe('Safe');
    });

    it('is case-insensitive for SCRIPT tags', () => {
      expect(sanitizeInput('<SCRIPT>evil()</SCRIPT>text')).toBe('text');
    });

    it('removes multiline script blocks', () => {
      const input = '<script>\nlet x = 1;\nalert(x);\n</script>clean';
      expect(sanitizeInput(input)).toBe('clean');
    });
  });

  describe('HTML tag removal', () => {
    it('removes <b> tags', () => {
      expect(sanitizeInput('<b>bold</b> text')).toBe('bold text');
    });

    it('removes <img> self-closing tags', () => {
      expect(sanitizeInput('before<img src="x" onerror="alert(1)"/>after')).toBe('beforeafter');
    });

    it('removes anchor tags', () => {
      expect(sanitizeInput('<a href="evil.com">click</a>')).toBe('click');
    });

    it('removes multiple tags in sequence', () => {
      expect(sanitizeInput('<p><em>text</em></p>')).toBe('text');
    });
  });

  describe('whitespace handling', () => {
    it('trims leading whitespace', () => {
      expect(sanitizeInput('  hello')).toBe('hello');
    });

    it('trims trailing whitespace', () => {
      expect(sanitizeInput('hello  ')).toBe('hello');
    });

    it('trims both sides', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('returns empty string for whitespace-only input', () => {
      expect(sanitizeInput('   ')).toBe('');
    });
  });

  describe('passthrough cases', () => {
    it('returns plain text unchanged (modulo trim)', () => {
      expect(sanitizeInput('Where is Gate D?')).toBe('Where is Gate D?');
    });

    it('preserves emoji', () => {
      expect(sanitizeInput('🚀 Hello!')).toBe('🚀 Hello!');
    });

    it('preserves non-Latin characters', () => {
      expect(sanitizeInput('مرحبا')).toBe('مرحبا');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// validateMessage()
// ─────────────────────────────────────────────────────────────────────────────

describe('validateMessage()', () => {
  describe('type validation', () => {
    it('returns invalid for undefined', () => {
      const result = validateMessage(undefined);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('string');
    });

    it('returns invalid for null', () => {
      expect(validateMessage(null).valid).toBe(false);
    });

    it('returns invalid for a number', () => {
      expect(validateMessage(42).valid).toBe(false);
    });

    it('returns invalid for a boolean', () => {
      expect(validateMessage(true).valid).toBe(false);
    });

    it('returns invalid for an object', () => {
      expect(validateMessage({ text: 'hello' }).valid).toBe(false);
    });

    it('returns invalid for an array', () => {
      expect(validateMessage(['hello']).valid).toBe(false);
    });
  });

  describe('content validation', () => {
    it('returns invalid for an empty string', () => {
      const result = validateMessage('');
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('returns invalid for a whitespace-only string', () => {
      expect(validateMessage('   ').valid).toBe(false);
    });

    it('returns invalid for a string that is only HTML tags', () => {
      expect(validateMessage('<b></b>').valid).toBe(false);
    });

    it('returns valid for a normal message', () => {
      const result = validateMessage('Where is Gate D?');
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('returns valid for a single character', () => {
      expect(validateMessage('a').valid).toBe(true);
    });
  });

  describe('length validation', () => {
    it('returns valid for exactly 500 characters (boundary)', () => {
      expect(validateMessage('a'.repeat(500)).valid).toBe(true);
    });

    it('returns invalid for 501 characters (over boundary)', () => {
      const result = validateMessage('a'.repeat(501));
      expect(result.valid).toBe(false);
      expect(result.error).toContain('500');
    });

    it('returns invalid for 1000 characters', () => {
      expect(validateMessage('a'.repeat(1000)).valid).toBe(false);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// normalizeRole()
// ─────────────────────────────────────────────────────────────────────────────

describe('normalizeRole()', () => {
  it('returns "staff" for exact string "staff"', () => {
    expect(normalizeRole('staff')).toBe('staff');
  });

  it('returns "fan" for exact string "fan"', () => {
    expect(normalizeRole('fan')).toBe('fan');
  });

  it('returns "fan" for undefined', () => {
    expect(normalizeRole(undefined)).toBe('fan');
  });

  it('returns "fan" for null', () => {
    expect(normalizeRole(null)).toBe('fan');
  });

  it('returns "fan" for unknown string "admin"', () => {
    expect(normalizeRole('admin')).toBe('fan');
  });

  it('returns "fan" for number input', () => {
    expect(normalizeRole(1)).toBe('fan');
  });

  it('returns "fan" for empty string', () => {
    expect(normalizeRole('')).toBe('fan');
  });

  it('returns "fan" for "STAFF" (case-sensitive)', () => {
    expect(normalizeRole('STAFF')).toBe('fan');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// normalizeLanguage()
// ─────────────────────────────────────────────────────────────────────────────

describe('normalizeLanguage()', () => {
  it('returns "es" for "es"', () => {
    expect(normalizeLanguage('es')).toBe('es');
  });

  it('returns "en" for "en"', () => {
    expect(normalizeLanguage('en')).toBe('en');
  });

  it('returns "en" for undefined', () => {
    expect(normalizeLanguage(undefined)).toBe('en');
  });

  it('returns "en" for null', () => {
    expect(normalizeLanguage(null)).toBe('en');
  });

  it('returns "en" for an empty string', () => {
    expect(normalizeLanguage('')).toBe('en');
  });

  it('returns "en" for a number', () => {
    expect(normalizeLanguage(42)).toBe('en');
  });

  it('passes through any non-empty language code', () => {
    expect(normalizeLanguage('zh')).toBe('zh');
    expect(normalizeLanguage('ar')).toBe('ar');
    expect(normalizeLanguage('pt')).toBe('pt');
  });

  it('preserves a custom BCP 47 tag (e.g. "zh-TW")', () => {
    expect(normalizeLanguage('zh-TW')).toBe('zh-TW');
  });
});
