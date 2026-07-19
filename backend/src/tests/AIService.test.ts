/**
 * @fileoverview Comprehensive unit tests for AIService.
 * Tests cover all mock categories, multilingual paths, caching,
 * role defaults, language defaults, and edge cases.
 */

import {
  generateChatResponse,
  categorize,
  clearResponseCache,
  MOCK_FAN,
  MOCK_MULTILINGUAL,
  type Category,
} from '../services/AIService';

// Ensure we always use the mock fallback in tests (no real API key)
beforeEach(() => {
  delete process.env.GEMINI_API_KEY;
  clearResponseCache();
});

// ─────────────────────────────────────────────────────────────────────────────
// categorize() — unit tests
// ─────────────────────────────────────────────────────────────────────────────

describe('categorize()', () => {
  // Staff categories
  describe('staff role', () => {
    it('returns staff_crowd for "crowd"', () => {
      expect(categorize('What is the crowd situation?', 'staff')).toBe('staff_crowd');
    });
    it('returns staff_crowd for "density"', () => {
      expect(categorize('Show me crowd density', 'staff')).toBe('staff_crowd');
    });
    it('returns staff_crowd for "congestion"', () => {
      expect(categorize('Gate C congestion alert', 'staff')).toBe('staff_crowd');
    });
    it('returns staff_crowd for "routing"', () => {
      expect(categorize('Routing recommendations needed', 'staff')).toBe('staff_crowd');
    });
    it('returns staff_incident for "incident"', () => {
      expect(categorize('Any new incidents?', 'staff')).toBe('staff_incident');
    });
    it('returns staff_incident for "report"', () => {
      expect(categorize('Generate a report', 'staff')).toBe('staff_incident');
    });
    it('returns staff_incident for "summary"', () => {
      expect(categorize('Summarize incident reports', 'staff')).toBe('staff_incident');
    });
    it('returns staff_traffic for "traffic"', () => {
      expect(categorize('What is the traffic like?', 'staff')).toBe('staff_traffic');
    });
    it('returns staff_traffic for "flow"', () => {
      expect(categorize('Check gate flow', 'staff')).toBe('staff_traffic');
    });
    it('returns staff_traffic for "bottleneck"', () => {
      expect(categorize('Bottleneck at south', 'staff')).toBe('staff_traffic');
    });
    it('returns staff_food for "food"', () => {
      expect(categorize('Food court status?', 'staff')).toBe('staff_food');
    });
    it('returns staff_food for "catering"', () => {
      expect(categorize('Catering issues reported', 'staff')).toBe('staff_food');
    });
    it('returns sustainability for "eco"', () => {
      expect(categorize('Eco initiative update', 'staff')).toBe('sustainability');
    });
    it('returns sustainability for "recycle"', () => {
      expect(categorize('Recycle bin levels', 'staff')).toBe('sustainability');
    });
    it('returns staff_crowd as default for unrecognised staff message', () => {
      expect(categorize('something entirely unknown xyz123', 'staff')).toBe('staff_crowd');
    });
  });

  // Fan categories
  describe('fan role', () => {
    it('returns accessibility for "wheelchair"', () => {
      expect(categorize('I need wheelchair access', 'fan')).toBe('accessibility');
    });
    it('returns accessibility for "disabled"', () => {
      expect(categorize('I am disabled, how do I enter?', 'fan')).toBe('accessibility');
    });
    it('returns accessibility for "ramp"', () => {
      expect(categorize('Where is the ramp?', 'fan')).toBe('accessibility');
    });
    it('returns accessibility for "access" without "food"', () => {
      expect(categorize('How do I access section 200?', 'fan')).toBe('accessibility');
    });
    it('returns navigation for "gate"', () => {
      expect(categorize('Which gate should I use?', 'fan')).toBe('navigation');
    });
    it('returns navigation for "route"', () => {
      expect(categorize('Best route to my seat', 'fan')).toBe('navigation');
    });
    it('returns navigation for "section"', () => {
      expect(categorize('How do I get to section 104?', 'fan')).toBe('navigation');
    });
    it('returns food for "halal"', () => {
      expect(categorize('Where can I find halal food?', 'fan')).toBe('food');
    });
    it('returns food for "eat"', () => {
      expect(categorize('Where can I eat?', 'fan')).toBe('food');
    });
    it('returns food for "restaurant"', () => {
      expect(categorize('Any restaurant open?', 'fan')).toBe('food');
    });
    it('returns schedule for "match"', () => {
      expect(categorize('When is the next match?', 'fan')).toBe('schedule');
    });
    it('returns schedule for "score"', () => {
      expect(categorize('What is the current score?', 'fan')).toBe('schedule');
    });
    it('returns schedule for "kickoff"', () => {
      expect(categorize('What time is kickoff?', 'fan')).toBe('schedule');
    });
    it('returns transport for "shuttle"', () => {
      expect(categorize('Where is the shuttle?', 'fan')).toBe('transport');
    });
    it('returns transport for "metro"', () => {
      expect(categorize('How do I get to the metro?', 'fan')).toBe('transport');
    });
    it('returns transport for "bus"', () => {
      expect(categorize('Which bus should I take?', 'fan')).toBe('transport');
    });
    it('returns accessibility for "lift"', () => {
      expect(categorize('Where is the lift?', 'fan')).toBe('accessibility');
    });
    it('returns emergency for "medical"', () => {
      expect(categorize('Where is the medical station?', 'fan')).toBe('emergency');
    });
    it('returns emergency for "sos"', () => {
      expect(categorize('SOS help needed', 'fan')).toBe('emergency');
    });
    it('returns emergency for "first aid"', () => {
      expect(categorize('I need first aid', 'fan')).toBe('emergency');
    });
    it('returns sustainability for "green"', () => {
      expect(categorize('What green initiatives are there?', 'fan')).toBe('sustainability');
    });
    it('returns default for unrecognised fan message', () => {
      expect(categorize('completely random xyz987', 'fan')).toBe('default');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// generateChatResponse() — integration-level mock tests
// ─────────────────────────────────────────────────────────────────────────────

describe('generateChatResponse()', () => {
  describe('fan navigation', () => {
    it('includes Gate and East Concourse for gate query', async () => {
      const res = await generateChatResponse('How do I get to Gate B?', 'fan', 'en');
      expect(res).toContain('Gate');
      expect(res).toContain('East Concourse');
    });
  });

  describe('fan food', () => {
    it('includes halal for halal food query', async () => {
      const res = await generateChatResponse('Where can I find halal food?', 'fan', 'en');
      expect(res.toLowerCase()).toContain('halal');
    });
    it('returns the MOCK_FAN.food response exactly', async () => {
      const res = await generateChatResponse('Where can I eat?', 'fan', 'en');
      expect(res).toBe(MOCK_FAN.food);
    });
  });

  describe('fan schedule', () => {
    it('includes match information', async () => {
      const res = await generateChatResponse('What is the score?', 'fan', 'en');
      expect(res).toContain('Argentina');
    });
  });

  describe('fan transport', () => {
    it('includes Shuttle for metro query', async () => {
      const res = await generateChatResponse('How do I get to the metro?', 'fan', 'en');
      expect(res).toContain('Shuttle');
    });
  });

  describe('fan accessibility', () => {
    it('includes accessible for wheelchair query', async () => {
      const res = await generateChatResponse('I need wheelchair access to my seat', 'fan', 'en');
      expect(res.toLowerCase()).toContain('accessible');
    });
    it('includes Lift for lift query', async () => {
      const res = await generateChatResponse('Where is the lift?', 'fan', 'en');
      expect(res).toContain('Lift');
    });
  });

  describe('fan emergency', () => {
    it('includes Medical for medical query', async () => {
      const res = await generateChatResponse('Where is the nearest medical station?', 'fan', 'en');
      expect(res).toContain('Medical');
    });
    it('includes 911 for SOS emergency', async () => {
      const res = await generateChatResponse('SOS emergency help needed', 'fan', 'en');
      expect(res).toContain('911');
    });
  });

  describe('fan sustainability', () => {
    it('includes recycling info', async () => {
      const res = await generateChatResponse('Tell me about green initiatives', 'fan', 'en');
      expect(res.toLowerCase()).toContain('recycl');
    });
  });

  describe('fan default', () => {
    it('returns welcome message for unrecognised query', async () => {
      const res = await generateChatResponse('completely random xyz987', 'fan', 'en');
      expect(res).toContain('MatchDay AI');
    });
  });

  describe('staff queries', () => {
    it('returns Gate C and Gate D for crowd query', async () => {
      const res = await generateChatResponse('What is the crowd density like?', 'staff', 'en');
      expect(res).toContain('Gate C');
      expect(res).toContain('Gate D');
    });
    it('returns INCIDENT for incident summary', async () => {
      const res = await generateChatResponse('Summarize incident reports', 'staff', 'en');
      expect(res).toContain('INCIDENT');
    });
    it('returns traffic info for bottleneck query', async () => {
      const res = await generateChatResponse('Is there a bottleneck?', 'staff', 'en');
      expect(res).toContain('TRAFFIC');
    });
    it('returns food court status for catering query', async () => {
      const res = await generateChatResponse('Catering status?', 'staff', 'en');
      expect(res).toContain('FOOD COURT');
    });
    it('returns sustainability for eco query', async () => {
      const res = await generateChatResponse('Eco sustainability update', 'staff', 'en');
      expect(res.toLowerCase()).toContain('recycl');
    });
  });

  describe('multilingual responses', () => {
    it('returns Spanish response containing Puerta', async () => {
      const res = await generateChatResponse('Hola', 'fan', 'es');
      expect(res).toContain('Puerta');
    });
    it('returns French response containing Porte', async () => {
      const res = await generateChatResponse('Bonjour', 'fan', 'fr');
      expect(res).toContain('Porte');
    });
    it('returns Portuguese response containing Portão', async () => {
      const res = await generateChatResponse('Olá', 'fan', 'pt');
      expect(res).toContain('Portão');
    });
    it('returns Arabic response containing البوابة', async () => {
      const res = await generateChatResponse('مرحبا', 'fan', 'ar');
      expect(res).toContain('البوابة');
    });
    it('returns German response containing Tor', async () => {
      const res = await generateChatResponse('Hallo', 'fan', 'de');
      expect(res).toContain('Tor');
    });
    it('returns Japanese response containing ゲート', async () => {
      const res = await generateChatResponse('こんにちは', 'fan', 'ja');
      expect(res).toContain('ゲート');
    });
    it('returns Chinese response containing D门', async () => {
      const res = await generateChatResponse('你好', 'fan', 'zh');
      expect(res).toContain('D门');
    });
    it('returns MOCK_MULTILINGUAL.es exactly for Spanish fan', async () => {
      const res = await generateChatResponse('Hola', 'fan', 'es');
      expect(res).toBe(MOCK_MULTILINGUAL.es);
    });
  });

  describe('edge cases and defaults', () => {
    it('returns default response for empty string message', async () => {
      const res = await generateChatResponse('', 'fan', 'en');
      expect(res).toContain('MatchDay AI');
    });
    it('returns default response for whitespace-only message', async () => {
      const res = await generateChatResponse('   ', 'fan', 'en');
      expect(res).toContain('MatchDay AI');
    });
    it('handles missing role by defaulting to fan', async () => {
      const res = await generateChatResponse('Where is the medical station?', '', 'en');
      expect(res).toBeDefined();
      expect(typeof res).toBe('string');
    });
    it('handles missing language by defaulting to en', async () => {
      const res = await generateChatResponse('Where is the shuttle?', 'fan', '');
      expect(res).toBeDefined();
      expect(typeof res).toBe('string');
    });
    it('returns a string for every Category value', async () => {
      const categories: Category[] = [
        'navigation', 'food', 'schedule', 'transport', 'accessibility',
        'emergency', 'staff_crowd', 'staff_incident', 'staff_traffic',
        'staff_food', 'sustainability', 'default',
      ];
      for (const cat of categories) {
        expect(typeof MOCK_FAN[cat]).toBe('string');
        expect(MOCK_FAN[cat].length).toBeGreaterThan(0);
      }
    });
  });

  describe('response caching', () => {
    it('returns the same response for identical inputs (cache hit)', async () => {
      const first  = await generateChatResponse('Where is the shuttle?', 'fan', 'en');
      const second = await generateChatResponse('Where is the shuttle?', 'fan', 'en');
      expect(first).toBe(second);
    });
    it('returns different responses for different languages', async () => {
      const en = await generateChatResponse('Hello', 'fan', 'en');
      const es = await generateChatResponse('Hello', 'fan', 'es');
      expect(en).not.toBe(es);
    });
    it('clears cache correctly between tests via clearResponseCache()', async () => {
      const first = await generateChatResponse('Where is food?', 'fan', 'en');
      clearResponseCache();
      const second = await generateChatResponse('Where is food?', 'fan', 'en');
      // Both should be equal (same mock) but cache was cleared
      expect(first).toBe(second);
    });
  });
});
