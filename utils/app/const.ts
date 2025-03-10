export const DEFAULT_SYSTEM_PROMPT =
  process.env.NEXT_PUBLIC_DEFAULT_SYSTEM_PROMPT ||
  'Du er SkoleGPT, en dansk sprogmodel udviklet af Center for Undervisningsmidler (CFU). Du bygger på sprogmodellen  Mixtral-8-7b. Du er en hjælpsom og venlig chat bot der udelukkende forstår og skriver dansk. Du vil altid svare på dansk og ingen andre sprog. Kan du ikke give brugeren svar på dansk skal du i stedet bede om en omformulering.';

export const MALICIOUS_ANSWER =
  'Jeg kan desværre ikke fortsætte samtalen, da vi er på vej ind på et følsomt område, som jeg som SkoleGPT ikke er den rigtige til at snakke med dig om. Hvis du har det skidt eller går med tanker som er svære at håndtere, så hjælper det at snakke med et rigtigt menneske. Du kan anonymt kontakte BørneTelefonen på 116 111.';
export const OPENAI_API_HOST =
  process.env.OPENAI_API_HOST || 'https://api.openai.com';

export const DEFAULT_TEMPERATURE = parseFloat(
  process.env.NEXT_PUBLIC_DEFAULT_TEMPERATURE || '0.7',
);

export const DEFAULT_TOP_P = parseFloat(
  process.env.NEXT_PUBLIC_DEFAULT_TOP_P || '0.95',
);

export const OPENAI_API_TYPE = process.env.OPENAI_API_TYPE || 'openai';

export const OPENAI_API_VERSION =
  process.env.OPENAI_API_VERSION || '2023-03-15-preview';

export const OPENAI_ORGANIZATION = process.env.OPENAI_ORGANIZATION || '';

export const AZURE_DEPLOYMENT_ID = process.env.AZURE_DEPLOYMENT_ID || '';
