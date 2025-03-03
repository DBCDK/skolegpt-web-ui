import {
  DEFAULT_SYSTEM_PROMPT,
  DEFAULT_TEMPERATURE,
  DEFAULT_TOP_P,
  GUIDELINES_PROMPT,
} from '@/utils/app/const';
import { HFModelNotReady } from '@/utils/server/huggingface';
import { HuggingFaceStream } from '@/utils/server/huggingface';

import { ChatBody, Message } from '@/types/chat';

import postfilterStop from './post-filter-stopord.json';
import prefilterStop from './pre-filter-stopord.json';

// @ts-ignore
import mistralTokenizer from 'mistral-tokenizer-js';

const llamaTokenizer = require('llama-tokenizer-js').default;

export const config = {
  runtime: 'edge',
};

// Message format:
//
// <s>[INST] <<SYS>>
// {{ system_prompt }}
// <</SYS>>

// {{ user_msg_1 }} [/INST] {{ model_answer_1 }} </s><s>[INST] {{ user_msg_2 }} [/INST]

const PREFILTER_STRINGS = prefilterStop?.map((entry) =>
  entry.Stopord?.toLowerCase(),
);
const POST_FILTER_STRINGS = postfilterStop?.map((entry) =>
  entry.Stopord?.toLowerCase(),
);
const preFilterMessage =
  'Du har overtrådt vores retningslinjer. Jeg kan desværre ikke hjælpe dig videre med denne samtale. Start evt. en ny samtale';

function prefilter(content: string): boolean {
  const contentLower = content.toLowerCase();
  const res = PREFILTER_STRINGS.some((filter) =>
    contentLower.includes(filter.toLowerCase()),
  );
  return res;
}
function postfilter(content: string): boolean {
  // Disable for now
  return false;
  const contentLower = content.toLowerCase();
  const res = POST_FILTER_STRINGS.some((filter) =>
    contentLower.includes(filter.toLowerCase()),
  );
  return res;
}

const llmFormat = (sysPrompt: string, msgs: Message[]): string => {
  let result = '<s>[INST] <<SYS>>\n';
  result += sysPrompt;
  result += '\n<</SYS>>\n\n';

  for (const msg of msgs) {
    result += msg.content;
    result += msg.role === 'assistant' ? '</s><s>[INST]' : '[/INST]';
  }
  return result;
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { model, messages, prompt, temperature, topP } =
      (await req.json()) as ChatBody;
    let promptToSend = (prompt || DEFAULT_SYSTEM_PROMPT) + GUIDELINES_PROMPT; //prompt; prompt here

    // if (!promptToSend) {
    //   promptToSend = DEFAULT_SYSTEM_PROMPT;
    // }
    let temperatureToUse = temperature;
    if (temperatureToUse == null) {
      temperatureToUse = DEFAULT_TEMPERATURE;
    }
    let topPToUse = topP;
    if (topPToUse == null) {
      topPToUse = DEFAULT_TOP_P;
    }

    let messagesToSend: Message[] = [];
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      const tokens = mistralTokenizer.encode(
        llmFormat(promptToSend, [message, ...messagesToSend]),
      );
      //const tokens = llamaTokenizer.encode(llmFormat(promptToSend, [message, ...messagesToSend]))
      if (tokens.length > model.tokenLimit - 25) {
        break;
      }
      messagesToSend = [message, ...messagesToSend];
    }
    if (messagesToSend.length === 0) {
      throw new RangeError(
        'Den sendte besked er for lang. Forsøg igen med en kortere tekst',
      );
    }

    if (
      prefilter(
        prompt +
          messages
            .filter((m) => m.role === 'user')
            .map((m) => m.content)
            .join(' '),
      )
    ) {
      return new Response(preFilterMessage);
    }
    // console.log({model, promptToSend, temperatureToUse, key, messagesToSend})

    // console.log("FROM THE FORMATTER::::")
    // console.log(llmFormat(promptToSend, messagesToSend))
    const formattedMessages = llmFormat(promptToSend, messagesToSend);
    console.log('Sending request of token length:', formattedMessages.length);
    const stream = await HuggingFaceStream(
      temperatureToUse,
      topPToUse,
      formattedMessages,
    );

    const maxWindowLength = 200;
    const textDecoder = new TextDecoder();
    const textEncoder = new TextEncoder();

    // Wrap the original stream.
    const interceptedStream = new ReadableStream({
      async start(controller) {
        const reader = stream.getReader();
        let slidingWindow = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }

            // Decode the current chunk and add it to the accumulated text.
            const chunkText = textDecoder.decode(value, { stream: true });
            slidingWindow += chunkText?.toLocaleLowerCase();
            slidingWindow = slidingWindow.slice(-maxWindowLength);

            // Check for the keyword. (You might want a more robust check if keywords can span chunks.)
            if (postfilter(slidingWindow)) {
              await reader.cancel();
              controller.enqueue(value);
              const customResponse =
                '\n\nJeg bliver desværre nødt til at stoppe samtalen her.';
              controller.enqueue(textEncoder.encode(customResponse));
              break;
            }

            // Enqueue the original chunk.
            controller.enqueue(value);
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(interceptedStream);

    return new Response(stream);
  } catch (error) {
    console.log('Encountered the following error in skole.ts');
    console.log(error);
    if (error instanceof HFModelNotReady || error instanceof RangeError) {
      return new Response('Error', { status: 500, statusText: error.message });
    } else if (error instanceof Error) {
      const errText = error?.message || 'Error with no message';
      return new Response('Error', { status: 500, statusText: errText });
    } else {
      return new Response('Error', { status: 500 });
    }
  }
};

export default handler;
