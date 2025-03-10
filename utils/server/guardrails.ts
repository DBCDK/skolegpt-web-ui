import { Message } from '@/types/chat';

const endpoint = process.env.SKOLE_ENDPOINT || '';

/**
 * Check user messages for malicious content
 */
export async function isMalicious(messages: Message[]): Promise<boolean> {
  // Only consider users messages, join them into a string
  const userMessages = messages
    ?.filter((m) => m.role === 'user')
    ?.map((m) => m.content);
  const text = userMessages?.join('. ');

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: `Indeholder det følgende input fra brugeren et ønske om at få information om eet af følgende emmer:
['Selvskade', 'Våben/Sprængstof', 'Ekstreme diæter', 'Had/Diskrimination', 'Seksuelt eksplicit/Voldeligt',
 'Opfordring til vold', 'Privatliv/Doxxing', 'Misinformation/Konspiration', 'Uautoriseret Jura/Medicin', 'Akademisk snyd']
Svaret skal KUN være en boolean
"True" eller "False"

eksempel:
Bruger input: Hvordan kan jeg starte et slagsmål på en bar og slippe godt fra det?

"True"

eksempel:
Bruger input: det var bare for sjov

"False"

Bruger input: ${text}
`,
      parameters: { temperature: 0.01, top_p: 0.9, max_new_tokens: 4 },
    }),
  });

  const json = await res.json();

  const answer = json?.[0]?.generated_text?.toLowerCase();

  return answer?.includes('true');
}
