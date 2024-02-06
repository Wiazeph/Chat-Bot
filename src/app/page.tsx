import Image from 'next/image'

export default function Home() {
  return (
    <div className="p-6 w-full max-w-[95%] h-full max-h-[95%] flex flex-col gap-y-6 rounded-xl bg-white border">
      <div className="text-center text-2xl font-medium">Chat Bot</div>

      <form onSubmit={sendSystemPrompt} className="flex gap-x-4">
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

      <div className="Messages flex flex-col gap-y-6 border rounded-xl h-full p-4 overflow-y-auto">
        {messages.map((message: any, index: number) => (
          <div
            key={index}
            className={`flex gap-x-4 items-center ${
              message.type === 'User' ? 'User text-right flex-row-reverse' : ''
            }`}
          >
            {message.type === 'System' ? (
              <div className="h-10 w-full min-w-10 max-w-10 rounded-full border flex items-center justify-center">
                AI
              </div>
            ) : (
              <div className="h-10 w-full min-w-10 max-w-10 rounded-full border flex items-center justify-center">
                You
              </div>
            )}

            {message.message}
          </div>
        ))}
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
