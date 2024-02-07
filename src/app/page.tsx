'use client'

import { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

import MessageComponent from '@/components/message'
import TypingComponent from '@/components/typing'

import { useChat } from 'ai/react'
import type { AgentStep } from 'langchain/schema'

export default function Home() {
  const { messages, input, handleInputChange, setMessages, setInput } =
    useChat()

  const [userOpenAIKey, setUserOpenAIKey] = useState<string>('')
  const [isKeyValid, setIsKeyValid] = useState<boolean>(false)
  const [oaiKeyValueDisplayed, setOaiKeyValueDisplayed] = useState<any>('')
  const [validatingKey, setValidatingKey] = useState<boolean>(false)
  const [promptMessage, setPromptMessage] = useState<any>('')
  const [display, setDisplay] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    console.log('messages:', messages)
  }, [messages])

  useEffect(() => {
    setMessages([
      ...messages,
      {
        id: '0',
        role: 'system',
        content:
          'You can start using me by typing the prompt of what I will be.',
      },
    ])
  }, [])

  useEffect(() => {
    setOaiKeyValueDisplayed(userOpenAIKey)

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

  const sendPrompt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const systemPromptMessage = messages.concat({
      id: messages.length.toString(),
      role: 'user',
      content: promptMessage,
    })

    setMessages(systemPromptMessage)

    setDisplay(true)

    try {
      setLoading(true)

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          openAIApiKey: userOpenAIKey,
          prompt: promptMessage,
          messages: systemPromptMessage,
        }),
        headers: {
          'Content-Type': 'text/plain',
        },
      })

      const data = await response.text()

      if (response.status === 200) {
        setMessages([
          ...systemPromptMessage,
          {
            id: (messages.length + 1).toString(),
            role: 'system',
            content: data,
          },
        ])
      }
    } catch (error) {
      console.error('sendPrompt - Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendUserMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setInput('')

    const userMessage = messages.concat({
      id: messages.length.toString(),
      role: 'user',
      content: input,
    })

    setMessages(userMessage)

    try {
      setLoading(true)

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({
          openAIApiKey: userOpenAIKey,
          messages: userMessage,
        }),
        headers: {
          'Content-Type': 'text/plain',
        },
      })

      const data = await response.text()

      if (response.status === 200) {
        setMessages([
          ...userMessage,
          {
            id: (messages.length + 1).toString(),
            role: 'system',
            content: data,
          },
        ])
      }
    } catch (error) {
      console.error('sendUserMessage - Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 w-full max-w-[95%] h-full max-h-[95%] flex flex-col gap-y-6 rounded-md bg-white border">
      <div className="text-center text-2xl font-medium">Chat Bot</div>

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
        disabled={isKeyValid ? true : false}
      />

      <form onSubmit={sendPrompt} className="flex gap-x-4">
        <Input
          type="text"
          name="prompt"
          placeholder="Prompt"
          disabled={!isKeyValid || display}
          value={promptMessage}
          onChange={(e) => setPromptMessage(e.target.value)}
        />

        <Button
          type="submit"
          disabled={!isKeyValid || promptMessage === '' || display}
        >
          Send Prompt
        </Button>
      </form>

      <div className="Sample-Prompts text-sm text-center flex flex-col items-center gap-y-2 border rounded-md p-4">
        <div className="flex items-center gap-x-2">
          <div className="font-medium select-none">Sample Prompt:</div>
          <div>You are an ai assistant.</div>
        </div>

        <div className="flex items-center gap-x-2">
          <div className="font-medium select-none">Sample Prompt:</div>
          <div>
            You are a pirate named Patchy. All responses must be extremely
            verbose and in pirate dialect.
          </div>
        </div>
      </div>

      <ScrollArea className="Messages h-full rounded-md border p-4">
        <div className="flex flex-col gap-y-6">
          {messages.map((message: any, index: number) => (
            <MessageComponent index={index} message={message} />
          ))}

          {loading && <TypingComponent />}
        </div>
        <div
          ref={(scrollAreaRef) =>
            scrollAreaRef?.scrollIntoView({ behavior: 'smooth' })
          }
        />
      </ScrollArea>

      <form onSubmit={sendUserMessage} className="Send-Message flex gap-x-4">
        <Input
          type="text"
          name="message"
          placeholder="Message"
          disabled={!display}
          value={input}
          onChange={handleInputChange}
        />

        <Button variant="outline" type="submit" disabled={!display}>
          Send Message
        </Button>
      </form>
    </div>
  )
}
