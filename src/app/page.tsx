'use client'

import { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import MessageComponent from '@/components/messages'

import { useChat } from 'ai/react'

export default function Home() {
  const [userOpenAIKey, setUserOpenAIKey] = useState<string>('')
  const [oaiKeyValueDisplayed, setOaiKeyValueDisplayed] = useState<string>('')
  const [isKeyValid, setIsKeyValid] = useState<boolean>(false)
  const [validatingKey, setValidatingKey] = useState<boolean>(false)
  const [display, setDisplay] = useState<boolean>(false)
  const [promptMessage, setPromptMessage] = useState<string>('')

  const {
    messages,
    input,
    setMessages,
    handleInputChange,
    handleSubmit,
    isLoading,
  } = useChat({
    body: {
      promptMessage: promptMessage,
      OAIKey: userOpenAIKey,
    },
  })

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

    if (userOpenAIKey.length > 50) {
      setValidatingKey(true)
      fetch(`/api/test_api?key=${userOpenAIKey}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status) {
            setIsKeyValid(true)
            setValidatingKey(false)
            setOaiKeyValueDisplayed(userOpenAIKey.replace(/./g, '*'))
          } else {
            setIsKeyValid(false)
            setOaiKeyValueDisplayed(userOpenAIKey)
          }
        })
        .catch((error) => console.error('Key Validation - Error:', error))
    } else {
      setIsKeyValid(false)
    }
  }, [userOpenAIKey])

  const setPrompt = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const promptMessage = e.currentTarget.prompt.value

    setPromptMessage(promptMessage)

    setDisplay(true)
  }

  return (
    <div className="Chat-Bot p-8 h-full flex flex-col gap-y-6">
      <div className="Title text-center text-4xl font-semibold">Chat Bot</div>

      <div className="flex gap-x-4">
        <div className="w-2/5 space-y-1">
          <small>OpenAI API Key:</small>

          <Input
            type="text"
            name="openApiKey"
            placeholder="Verify your OpenAI API Key"
            className={cn(
              'Key-Input px-4 h-12',
              isKeyValid ? 'border-green-400' : 'border-red-300',
              validatingKey && 'validatingKey'
            )}
            value={oaiKeyValueDisplayed}
            onChange={(e) => setUserOpenAIKey(e.target.value)}
            disabled={isKeyValid ? true : false}
          />
        </div>

        <div className="w-3/5 space-y-1">
          <small>Prompt:</small>

          <form onSubmit={setPrompt} className="Prompt-Form flex gap-x-4">
            <Input
              type="text"
              name="prompt"
              placeholder="Write your Prompt"
              className="Prompt-Input px-4 h-12"
              value={promptMessage}
              onChange={(e) => setPromptMessage(e.target.value)}
              disabled={!isKeyValid || display}
            />

            <Button
              variant="secondary"
              type="submit"
              className="Prompt-Button h-12"
              disabled={!isKeyValid || promptMessage === '' || display}
            >
              Set Prompt
            </Button>
          </form>
        </div>
      </div>

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

      <MessageComponent message={messages} />

      <form onSubmit={handleSubmit} className="Message-Form flex gap-x-4">
        <Input
          type="text"
          name="message"
          placeholder="Message"
          className="Message-Input px-4 h-12"
          value={input}
          onChange={handleInputChange}
          disabled={!display}
        />

        <Button
          variant="secondary"
          type="submit"
          className="Message-Button flex items-center gap-x-2.5 h-12"
          disabled={!display}
        >
          <div>Send Message</div>
          <div
            className={cn(
              'inline-block w-5 h-5 border-[3px] border-zinc-300 border-t-zinc-700 rounded-full animate-spin duration-700',
              { hidden: !isLoading }
            )}
          ></div>
        </Button>
      </form>
    </div>
  )
}
