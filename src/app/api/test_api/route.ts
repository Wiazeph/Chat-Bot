import { NextRequest } from 'next/server'
import OpenAI from 'openai'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')

  const openai = new OpenAI({
    apiKey: key as string,
  })

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'system', content: 'This is a test' }],
    })

    if (completion.choices && completion.choices[0]) {
      return new Response(JSON.stringify({ status: true }), { status: 200 })
    } else {
      return new Response(
        JSON.stringify({ status: true, message: 'No response from AI.' }),
        { status: 200 }
      )
    }
  } catch (error) {
    return new Response(JSON.stringify({ status: false }), { status: 400 })
  }
}
