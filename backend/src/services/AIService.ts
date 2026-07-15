/**
 * AIService — FIFA 26 Smart Assist GenAI Backend
 *
 * Primary: Google Gemini 1.5 Flash via @google/generative-ai SDK
 * Fallback: High-quality mock engine (used when no API key is configured)
 *
 * The service is role-aware (fan / staff), multilingual, and domain-scoped
 * to FIFA World Cup 2026 stadium operations.
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// ── Gemini client (lazy-initialised so missing key doesn't crash the server) ──
let geminiModel: ReturnType<InstanceType<typeof GoogleGenerativeAI>['getGenerativeModel']> | null = null;

const initGemini = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === 'YOUR_GEMINI_API_KEY_HERE') return null;
  try {
    const genAI = new GoogleGenerativeAI(key);
    return genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT,        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      ],
    });
  } catch {
    return null;
  }
};

// ── System prompt that scopes Gemini to FIFA stadium context ──────────────────
const buildSystemPrompt = (role: string, language: string): string => `
You are MatchDay AI, the official FIFA World Cup 2026 Smart Assistant embedded in the Smart Assist platform.

CONTEXT:
- Current event: FIFA World Cup 2026, hosted across USA, Canada & Mexico
- Current venue: SoFi Stadium, Los Angeles (capacity 70,240)
- Live match: Argentina vs France — Final — Score: 2-1 (68th minute)
- Gate status: Gate A 38% | Gate B 54% | Gate C 85% (CONGESTED) | Gate D 42% | Gate E 61% | Gate F 29%
- Next FIFA shuttle: #7 at 14:40 from South Plaza (low crowd)
- Nearest medical: Medical Point 3, Level 1 East Corridor

ROLE: You are assisting a ${role === 'staff' ? 'STADIUM STAFF MEMBER / OPERATIONS OFFICER' : 'FAN / SPECTATOR'}.

${role === 'staff' ? `
STAFF MODE INSTRUCTIONS:
- Provide concise, actionable operational intelligence
- Use data-driven recommendations (reference gate %, crowd flows)
- Prioritise safety and crowd management above all else
- Format responses with clear sections: ALERT / RECOMMENDATION / ACTION
` : `
FAN MODE INSTRUCTIONS:
- Be friendly, helpful and conversational
- Provide clear directions with landmarks
- Include estimated times and crowd conditions
- Respond in ${language !== 'en' ? `the user's language (${language}) — ENTIRE response must be in ${language}` : 'English'}
`}

RULES:
- Keep responses under 200 words
- Be specific with gate letters, section numbers, and timings
- Never make up information outside the provided context
- If asked something out of scope, gently redirect to stadium topics
`.trim();

// ── Mock fallback engine ──────────────────────────────────────────────────────
type Category = 'navigation' | 'food' | 'schedule' | 'transport' | 'accessibility' |
                'emergency' | 'staff_crowd' | 'staff_incident' | 'staff_traffic' |
                'staff_food' | 'sustainability' | 'default';

const MOCK_FAN: Record<Category, string> = {
  navigation:    '🗺️ To avoid Gate C (85% congested), head to **Gate D** — currently at 42% with < 2 min wait.\n\nRoute: Take the East Concourse via the green-lit tunnel → Lift B → your section.\n\nEstimated time: 6 minutes.',
  food:          '🍔 Nearest food options near you:\n• **Global Kitchen** (Halal) — Section 112 · ⭐ 4.7 · 5 min wait\n• **Dubai Bites** (Halal) — Section 204 · ⭐ 4.5 · 3 min wait\n• **Green Zone** (Vegetarian) — Section 108\n\nAll accept FIFA Pay & contactless payments.',
  schedule:      '⚽ **LIVE NOW: Argentina 🇦🇷 2–1 France 🇫🇷**\n📍 MetLife Stadium, New York · 68\' — 2nd Half\n\n🗓️ Next: Spain vs Germany — 3rd Place — July 18, 15:00\n📍 AT&T Stadium, Dallas',
  transport:     '🚌 Best routes right now:\n1. **FIFA Shuttle #7** → 14:40 · Low crowd · 18 min ✅ Recommended\n2. **Metro Line 7 Blue** → 14:45 · Moderate · 22 min\n3. **Pedestrian Green Route** → 3.8 km · 45 min · ♻️ Eco\n\nShuttle #7 departs South Plaza — board now to avoid peak.',
  accessibility: '♿ Accessible route to Section 114:\nGate D West → **Lift D1** (Ground → Level 2) → Section 400-420 → Blue signs.\n\n⏱️ Est. 8 min · Lift wait: < 1 min\n📞 Companion assistance: Gate D Info Desk\n🆘 Hotline: +1-800-ACCESS-26',
  emergency:     '🆘 **Nearest Medical Station: Point 3**\n📍 Level 1, East Corridor (near Section 130)\n🚶 ~150m from Gate B\n📞 Emergency: +1-800-FIFA-SOS\n\nAll points staffed 24/7 with paramedics and AED units.\n\n⚠️ For immediate life-threatening emergencies, call **911**.',
  staff_crowd:   '⚠️ **ALERT: Gate C — 85% capacity**\n\n✅ RECOMMENDATION:\n• Redirect South Plaza fans → Gate D (42%) or Gate F (29%)\n• Deploy 2 stewards to South Concourse redirect point\n• Update LED signage: Gates D & F preferred\n\n⏱️ Expected relief: 12–15 minutes',
  staff_incident:'📋 **INCIDENT LOG — Last 30 min:**\n1. [MEDIUM] Gate C congestion — Redirect initiated ✓\n2. [MINOR] Spill — Restroom Block 4, West Wing — Janitorial dispatched ✓\n3. [MINOR] VIP Section E — 3 stewards reassigned ✓\n\n🔴 Priority: Gate C + Section 300 monitoring',
  staff_traffic:  '🚦 **TRAFFIC FLOW:**\n• North Concourse: 38% — Normal ✅\n• East Concourse: 62% — Monitor 🟡\n• South Concourse: 88% — ⚠️ Bottleneck Risk\n\nACTION: Open SE overflow gate → reduces south load ~25% in 10 min.',
  staff_food:     '🍔 **FOOD COURT STATUS:**\n• Section A: 65% capacity · 7 stalls open\n• Section B: 40% capacity · 5 stalls open (3 restocking)\n• VIP Lounge: Normal\n\nACTION: Move 2 volunteers from B → reinforce Section A before kickoff.',
  sustainability: '♻️ **SUSTAINABILITY DASHBOARD:**\n• Waste Recycled: 94% ↑ (↑6% vs last match)\n• Renewable Energy: 78% of total power\n• Single-use plastics: 97% eliminated\n• Carbon offset: 1,240 kg CO₂ earned\n\n🏆 On track for FIFA Green Stadium Gold!',
  default:        '👋 I\'m **MatchDay AI** — your FIFA World Cup 2026 Smart Assistant!\n\nI can help with:\n🗺️ Stadium navigation & crowd routing\n🍔 Food & beverage locations\n⚽ Live scores & match schedule\n🚌 Transport & shuttle timings\n♿ Accessible routes & services\n🆘 Emergency & medical assistance\n\nWhat do you need? Just ask in any language!',
};

const MOCK_MULTILINGUAL: Record<string, string> = {
  es: '¡Hola! Para evitar la congestión en la Puerta C (85%), te recomiendo la **Puerta D** (42%, espera < 2 min). Sigue las señales verdes hacia el corredor Este. El transbordador #7 sale a las 14:40 desde la Plaza Sur. ¿En qué más puedo ayudarte?',
  fr: 'Bonjour! Pour éviter la Porte C (85%), utilisez la **Porte D** (42%, attente < 2 min). Suivez les panneaux verts vers le couloir Est. La navette #7 part à 14h40 depuis la Plaza Sud. Comment puis-je vous aider?',
  pt: 'Olá! Para evitar o Portão C (85%), use o **Portão D** (42%, espera < 2 min). Siga as placas verdes para o corredor Leste. O ônibus #7 sai às 14:40 da Praça Sul. Como posso ajudar?',
  ar: 'مرحبًا! لتجنب البوابة C (85%)، استخدم **البوابة D** (42%، انتظار < دقيقتين). اتبع اللافتات الخضراء نحو الممر الشرقي. الحافلة #7 تغادر في 14:40 من الساحة الجنوبية.',
  de: 'Hallo! Um Tor C (85%) zu vermeiden, nutzen Sie **Tor D** (42%, Wartezeit < 2 Min). Folgen Sie den grünen Schildern zum Ost-Korridor. Shuttle #7 fährt um 14:40 vom Südplatz ab.',
  ja: 'こんにちは！ゲートC（85%）を避けるため、**ゲートD**（42%、2分未満）をご利用ください。緑の案内板に従って東通路へ。シャトル#7は14:40に南プラザから出発します。',
  zh: '您好！为避开C门（85%），请前往**D门**（42%，等待<2分钟）。沿绿色标志走东走廊。7号班车14:40从南广场发车。有什么需要帮助的？',
};

/**
 * Categorises a user message to select the best mock response.
 */
const categorize = (message: string, role: string): Category => {
  const m = message.toLowerCase();
  if (role === 'staff') {
    if (m.includes('crowd') || m.includes('density') || m.includes('congestion') || m.includes('routing')) return 'staff_crowd';
    if (m.includes('incident') || m.includes('report') || m.includes('summary'))                          return 'staff_incident';
    if (m.includes('traffic') || m.includes('flow') || m.includes('bottleneck'))                          return 'staff_traffic';
    if (m.includes('food') || m.includes('court') || m.includes('catering'))                              return 'staff_food';
    if (m.includes('sustain') || m.includes('eco') || m.includes('recycle'))                              return 'sustainability';
    return 'staff_crowd';
  }
  if (m.includes('wheelchair') || m.includes('disabled') || m.includes('ramp') || (m.includes('access') && !m.includes('food'))) return 'accessibility';
  if (m.includes('gate') || m.includes('navigate') || m.includes('route') || m.includes('crowd') || m.includes('section'))       return 'navigation';
  if (m.includes('food') || m.includes('eat') || m.includes('halal') || m.includes('drink') || m.includes('restaurant'))         return 'food';
  if (m.includes('match') || m.includes('schedule') || m.includes('time') || m.includes('kickoff') || m.includes('score'))       return 'schedule';
  if (m.includes('bus') || m.includes('metro') || m.includes('transport') || m.includes('shuttle') || m.includes('train'))       return 'transport';
  if (m.includes('lift'))                                                                                                          return 'accessibility';
  if (m.includes('medical') || m.includes('emergency') || m.includes('help') || m.includes('sos') || m.includes('first aid'))    return 'emergency';
  if (m.includes('sustain') || m.includes('eco') || m.includes('recycle') || m.includes('green'))                                return 'sustainability';
  return 'default';
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Generates a contextual, role-aware AI response using Gemini or the mock fallback.
 * @param message  - The user's raw message.
 * @param role     - 'fan' | 'staff'
 * @param language - ISO 639-1 code ('en', 'es', 'fr', ...)
 */
export const generateChatResponse = async (
  message: string,
  role: string,
  language: string,
): Promise<string> => {
  // Lazy-init Gemini model
  if (!geminiModel) geminiModel = initGemini();

  // ── GEMINI PATH ────────────────────────────────────────────────────────────
  if (geminiModel) {
    try {
      const systemPrompt = buildSystemPrompt(role, language);
      const userPrompt = language !== 'en'
        ? `[User message in ${language}]: ${message}\n\nIMPORTANT: Reply entirely in ${language}.`
        : message;

      const result = await geminiModel.generateContent(`${systemPrompt}\n\nUser: ${userPrompt}`);
      const text = result.response.text().trim();
      if (text) return text;
    } catch (err) {
      // Log and fall through to mock
      console.warn('[AIService] Gemini call failed, using mock fallback:', (err as Error).message);
    }
  }

  // ── MOCK FALLBACK PATH ────────────────────────────────────────────────────
  // Return localised mock for non-English fan queries
  if (role === 'fan' && language !== 'en' && MOCK_MULTILINGUAL[language]) {
    return MOCK_MULTILINGUAL[language]!;
  }
  const category = categorize(message, role);
  return MOCK_FAN[category];
};
