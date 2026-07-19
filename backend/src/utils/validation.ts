/**
 * @fileoverview Input validation and sanitisation utilities.
 *
 * Provides pure, side-effect-free functions for validating and cleaning
 * user-provided strings before they reach service or persistence layers.
 * All functions are individually unit-testable and reusable across controllers.
 *
 * @module validation
 */

import { MAX_MESSAGE_LENGTH } from '../constants';

/** Represents the result of a validation check. */
export interface ValidationResult {
  /** Whether the value passed validation. */
  readonly valid: boolean;
  /** Human-readable error description, or undefined when valid. */
  readonly error?: string;
}

/**
 * Sanitises a raw string by removing `<script>` blocks (including their
 * content), stripping remaining HTML tags, and trimming surrounding whitespace.
 *
 * This prevents XSS payload injection into the AI prompt pipeline.
 *
 * @param input - The raw string to sanitise.
 * @returns The sanitised, whitespace-trimmed string.
 *
 * @example
 * sanitizeInput('<script>alert("xss")</script>Hello'); // → 'Hello'
 * sanitizeInput('<b>Bold</b> text');                   // → 'Bold text'
 */
export const sanitizeInput = (input: string): string =>
  input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();

/**
 * Validates that a chat message string is present, is a string type,
 * is non-empty after sanitisation, and does not exceed the maximum length.
 *
 * @param raw - The raw value from the request body.
 * @returns A {@link ValidationResult} indicating whether the value is valid.
 *
 * @example
 * validateMessage('Hello');          // → { valid: true }
 * validateMessage('');               // → { valid: false, error: '...' }
 * validateMessage('a'.repeat(501));  // → { valid: false, error: '...' }
 */
export const validateMessage = (raw: unknown): ValidationResult => {
  if (raw === null || raw === undefined || typeof raw !== 'string') {
    return { valid: false, error: 'Message is required and must be a string.' };
  }

  const sanitized = sanitizeInput(raw);

  if (!sanitized) {
    return { valid: false, error: 'Message cannot be empty after sanitisation.' };
  }

  if (sanitized.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: `Message exceeds maximum allowed length of ${MAX_MESSAGE_LENGTH} characters.`,
    };
  }

  return { valid: true };
};

/**
 * Validates and normalises the `role` field from a request body.
 * Accepts only 'fan' or 'staff'; defaults to 'fan' for any other value.
 *
 * @param raw - The raw role value from the request body.
 * @returns The normalised role: 'fan' | 'staff'.
 *
 * @example
 * normalizeRole('staff');  // → 'staff'
 * normalizeRole('admin');  // → 'fan'
 * normalizeRole(undefined); // → 'fan'
 */
export const normalizeRole = (raw: unknown): 'fan' | 'staff' =>
  raw === 'staff' ? 'staff' : 'fan';

/**
 * Validates and normalises the `language` field from a request body.
 * Accepts any non-empty string as a language code; defaults to 'en'.
 *
 * @param raw - The raw language value from the request body.
 * @returns The ISO 639-1 language code, defaulting to 'en'.
 *
 * @example
 * normalizeLanguage('es');      // → 'es'
 * normalizeLanguage('');        // → 'en'
 * normalizeLanguage(undefined); // → 'en'
 */
export const normalizeLanguage = (raw: unknown): string =>
  typeof raw === 'string' && raw.length > 0 ? raw : 'en';
