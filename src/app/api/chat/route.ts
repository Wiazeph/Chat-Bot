import { NextRequest, NextResponse } from 'next/server'

import { Message as VercelChatMessage, StreamingTextResponse } from 'ai'
import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { HttpResponseOutputParser } from 'langchain/output_parsers'

export const runtime = 'edge'

const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`
}

const TEMPLATE = `{prompt}

Current conversation:
{chat_history}

User: {input}
AI:`

export async function POST(req: NextRequest) {
  try {
    const { messages, promptMessage, OAIKey } = await req.json()

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage)
    const currentMessageContent = messages[messages.length - 1].content

    const prompt = PromptTemplate.fromTemplate(TEMPLATE)

    const model = new ChatOpenAI({
      temperature: 0.9,
      modelName: 'gpt-3.5-turbo',
      openAIApiKey: OAIKey,
      maxTokens: 175,
      streaming: true,
    })

    const outputParser = new HttpResponseOutputParser()

    const chain = prompt.pipe(model).pipe(outputParser)

    const stream = await chain.stream({
      prompt: promptMessage,
      chat_history: formattedPreviousMessages.join('\n'),
      input: currentMessageContent,
    })

    return new StreamingTextResponse(stream)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 })
  }
}
