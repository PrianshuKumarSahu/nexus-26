import { generateChatResponse } from '../services/AIService';

describe('AIService', () => {
  it('should return navigation info for fans asking about gates', async () => {
    const response = await generateChatResponse('How do I get to Gate B?', 'fan', 'en');
    // Navigation responses should include gate/route guidance
    expect(response).toContain('Gate');
    expect(response).toContain('East Concourse');
  });

  it('should return Spanish response when language is "es"', async () => {
    const response = await generateChatResponse('Hola', 'fan', 'es');
    // Spanish response should include the localised gate reference
    expect(response).toContain('Puerta');
    expect(response).toContain('congestión');
  });

  it('should return operational intelligence for staff crowd queries', async () => {
    const response = await generateChatResponse('What is the crowd density like?', 'staff', 'en');
    // Staff response should include actionable alerts with gate info
    expect(response).toContain('Gate C');
    expect(response).toContain('Gate D');
  });

  it('should return food information for fan food queries', async () => {
    const response = await generateChatResponse('Where can I find halal food?', 'fan', 'en');
    expect(response.toLowerCase()).toContain('halal');
  });

  it('should return transport options for fan transport queries', async () => {
    const response = await generateChatResponse('How do I get to the metro?', 'fan', 'en');
    expect(response).toContain('Shuttle');
  });

  it('should return accessibility info for wheelchair queries', async () => {
    const response = await generateChatResponse('I need wheelchair access to my seat', 'fan', 'en');
    expect(response.toLowerCase()).toContain('accessible');
  });

  it('should return incident summary for staff incident queries', async () => {
    const response = await generateChatResponse('Summarize incident reports', 'staff', 'en');
    expect(response).toContain('INCIDENT');
  });
});
