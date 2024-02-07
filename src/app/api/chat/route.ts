import { NextRequest, NextResponse } from 'next/server'

import { StreamingTextResponse } from 'ai'
import { ChatOpenAI } from '@langchain/openai'
import { PromptTemplate } from '@langchain/core/prompts'
import { StringOutputParser } from '@langchain/core/output_parsers'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const apiKey = body.openAIApiKey
    const promptInput = body.prompt
    const messages = body.messages ?? []

    const promptText = messages.join('\n') + '\n' + promptInput
    const prompt = PromptTemplate.fromTemplate(promptText)

    const model = new ChatOpenAI({
      temperature: 0.9,
      modelName: 'gpt-3.5-turbo',
      openAIApiKey: apiKey,
      maxTokens: 175,
    })

    const outputParser = new StringOutputParser()

    const chain = prompt.pipe(model).pipe(outputParser)

    const stream = await chain.stream({
      prompt: promptInput,
      input: messages,
    })

    return new StreamingTextResponse(stream)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 })
  }
}
