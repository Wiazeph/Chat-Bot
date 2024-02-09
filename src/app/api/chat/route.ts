import { NextRequest, NextResponse } from 'next/server'

import { Message as VercelChatMessage, StreamingTextResponse } from 'ai'
import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'

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
    const { messages, prompt, api_key } = await req.json()

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage)
    const messageContent = messages[messages.length - 1].content

    const prompTemplate = PromptTemplate.fromTemplate(TEMPLATE)

    const model = new ChatOpenAI({
      temperature: 0.9,
      modelName: 'gpt-3.5-turbo',
      openAIApiKey: api_key,
      maxTokens: 175,
      streaming: true,
    })

    const outputParser = new StringOutputParser()

    const chain = prompTemplate.pipe(model).pipe(outputParser)

    const stream = await chain.stream({
      prompt: prompt,
      chat_history: formattedPreviousMessages.join('\n'),
      input: messageContent,
    })

    return new StreamingTextResponse(stream)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 })
  }
}
