'use client'

import { useState } from 'react'

import MessageComponent from '@/components/message'

export default function Home() {
  const [userOpenAIKey, setUserOpenAIKey] = useState<string>('') //
  const [promptMessage, setPromptMessage] = useState<any>(null)
  const [messages, setMessages] = useState<any>([
    {
      type: 'System',
      message: 'You can start using me by typing the prompt of what I will be.',
    },
  ])
  const [loading, setLoading] = useState<boolean>(false)

  const sendSystemPrompt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const userKey = e.currentTarget.openApiKey.value //
    setUserOpenAIKey(userKey) //

    const userPromptMessage = e.currentTarget.prompt.value
    setPromptMessage(userPromptMessage)

    setMessages([...messages, { type: 'User', message: userPromptMessage }])

    try {
      setLoading(true)

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          openAIApiKey: userKey, //
          prompt: userPromptMessage,
          messages: [
            ...messages.map((msg: any) => msg.message),
            userPromptMessage,
          ],
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.text()

      setMessages([
        ...messages,
        { type: 'User', message: userPromptMessage },
        { type: 'System', message: data },
      ])
    } catch (error) {
      console.error('sendSystemPrompt - Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendUserMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const userMessage = e.currentTarget.message.value
    e.currentTarget.message.value = ''

    setMessages([...messages, { type: 'User', message: userMessage }])

    try {
      setLoading(true)

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          openAIApiKey: userOpenAIKey, //
          messages: [...messages.map((msg: any) => msg.message), userMessage],
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.text()

      setMessages([
        ...messages,
        { type: 'User', message: userMessage },
        { type: 'System', message: data },
      ])
    } catch (error) {
      console.error('sendUserMessage - Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 w-full max-w-[95%] h-full max-h-[95%] flex flex-col gap-y-6 rounded-md bg-white border">
      <div className="text-center text-2xl font-medium">Chat Bot</div>

      <form onSubmit={sendSystemPrompt} className="flex gap-x-4">
        {/*  */}
        <input
          type="text"
          name="openApiKey"
          placeholder="OpenAI API Key"
          className="input"
          disabled={promptMessage !== null ? true : false}
        />
        {/*  */}

        <input
          type="text"
          name="prompt"
          placeholder="Prompt"
          className="input"
          disabled={promptMessage !== null ? true : false}
        />

        <button
          type="submit"
          className="button"
          disabled={promptMessage !== null ? true : false}
        >
          Set Prompt
        </button>
      </form>

      <div className="text-sm text-center">
        <span className="text-zinc-600">Sample Prompt:</span> You are a pirate
        named Patchy. All responses must be extremely verbose and in pirate
        dialect.
      </div>

      <div className="Messages flex flex-col gap-y-6 border rounded-md h-full p-4 overflow-y-auto">
        {messages.map((message: any, index: number) => (
          <MessageComponent index={index} message={message} />
        ))}

        {loading && (
          <div className="flex gap-x-4 items-center">
            <div className="h-10 w-full min-w-10 max-w-10 rounded-full border flex items-center justify-center">
              AI
            </div>
            <div>Loading...</div>
          </div>
        )}
      </div>

      <form onSubmit={sendUserMessage} className="flex gap-x-4">
        <input
          type="text"
          name="message"
          placeholder="Message"
          className="input"
          disabled={promptMessage !== null ? false : true}
        />

        <button
          type="submit"
          className="button"
          disabled={promptMessage !== null ? false : true}
        >
          Send Message
        </button>
      </form>
    </div>
  )
}
