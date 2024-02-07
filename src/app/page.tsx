'use client'

import { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

import MessageComponent from '@/components/message'
import TypingComponent from '@/components/typing'

export default function Home() {
  const [userOpenAIKey, setUserOpenAIKey] = useState<string>('')
  const [promptMessage, setPromptMessage] = useState<any>(null)
  const [messages, setMessages] = useState<any>([
    {
      type: 'System',
      message: 'You can start using me by typing the prompt of what I will be.',
    },
  ])
  const [loading, setLoading] = useState<boolean>(false)

  //////////////////////////////////////////

  const [oaiKeyValueDisplayed, setOaiKeyValueDisplayed] = useState<any>('')
  const [isKeyValid, setIsKeyValid] = useState<boolean>(false)
  const [validatingKey, setValidatingKey] = useState<boolean>(false)

  useEffect(() => {
    setOaiKeyValueDisplayed(userOpenAIKey)
  }, [userOpenAIKey])

  useEffect(() => {
    if (userOpenAIKey.length > 49) {
      setValidatingKey(true)
      fetch(`/api/test_api?key=${userOpenAIKey}`)
        .then((response) => response.json())
        .then((data) => {
          setIsKeyValid(data.status)
          if (data.status) {
            setValidatingKey(false)
            setOaiKeyValueDisplayed(userOpenAIKey.replace(/./g, '*'))
          } else {
            setOaiKeyValueDisplayed(userOpenAIKey)
          }
        })
        .catch((error) => console.error('Key Validation - Error:', error))
    } else {
      setIsKeyValid(false)
    }
  }, [userOpenAIKey])

  //////////////////////////////////////////

  const sendSystemPrompt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const userPromptMessage = e.currentTarget.prompt.value
    setPromptMessage(userPromptMessage)

    setMessages([...messages, { type: 'User', message: userPromptMessage }])

    try {
      setLoading(true)

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          openAIApiKey: userOpenAIKey,
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
          openAIApiKey: userOpenAIKey,
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
        <Input
          type="text"
          name="openApiKey"
          placeholder="OpenAI API Key"
          className={cn(
            isKeyValid
              ? 'border-green-400 bg-green-400'
              : 'border-red-300 bg-red-300',
            validatingKey && 'validatingKey'
          )}
          value={oaiKeyValueDisplayed}
          onChange={(e) => setUserOpenAIKey(e.target.value)}
          disabled={isKeyValid || promptMessage !== null ? true : false}
        />

        <Input
          type="text"
          name="prompt"
          placeholder="Prompt"
          disabled={promptMessage !== null ? true : false}
        />

        <Button
          type="submit"
          disabled={!isKeyValid || promptMessage !== null ? true : false}
        >
          Send Prompt
        </Button>
      </form>

      <div className="text-sm text-center">
        <span className="text-zinc-600">Sample Prompt:</span> You are a pirate
        named Patchy. All responses must be extremely verbose and in pirate
        dialect.
      </div>

      <ScrollArea className="h-full rounded-md border p-4">
        <div className="flex flex-col gap-y-6">
          {messages.map((message: any, index: number) => (
            <MessageComponent index={index} message={message} />
          ))}

          {loading && <TypingComponent />}
        </div>
      </ScrollArea>

      <form onSubmit={sendUserMessage} className="flex gap-x-4">
        <Input
          type="text"
          name="message"
          placeholder="Message"
          disabled={promptMessage !== null ? false : true}
        />

        <Button
          variant="outline"
          type="submit"
          disabled={promptMessage !== null ? false : true}
        >
          Send Message
        </Button>
      </form>
    </div>
  )
}
