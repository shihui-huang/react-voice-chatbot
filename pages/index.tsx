import 'regenerator-runtime/runtime'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faQuoteLeft } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { METHODS } from '@/constants'
const defaultIntroduction = `Hey there! I'm Bob, your cute chat buddy who loves telling jokes. Right now, my specialty is making you
laugh with hilarious punchlines. But here's the exciting part: in the future, I'll be able to do so much
more than that!`

export default function Home() {
  const commands = [
    {
      command: ['*'],
      callback: (command: string) => handleSend(command),
    },
  ]

  const [speakButtonDisabled, setSpeakButtonDisabled] = useState(false)
  const { transcript, resetTranscript, listening, finalTranscript } = useSpeechRecognition({ commands })
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis>()
  const [messages, setMessages] = useState([
    {
      message: defaultIntroduction,
      sender: 'ChatGPT',
    },
  ])

  useEffect(() => {
    setSpeechSynthesis(window.speechSynthesis)
  }, [])

  const speak = (message: string) => {
    if (!speechSynthesis) {
      return
    }

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      speechSynthesis.speak(
        new SpeechSynthesisUtterance(
          'Your browser does not support speech recognition software! Try Chrome desktop, maybe?',
        ),
      )
      return
    }

    speechSynthesis.speak(new SpeechSynthesisUtterance(message))
  }

  const systemMessageToSetChatGptBehaviour = {
    role: 'system',
    content:
      'Your name is Bob. An incredibly intelligent and quick-thinking AI, that always replies with an enthusiastic and positive energy.',
  }

  const handleSend = async (message: string) => {
    if (!message) {
      return
    }
    const formattedMessage = {
      message,
      direction: 'outgoing',
      sender: 'user',
    }

    const updatedMessages = [...messages, formattedMessage]

    setMessages(updatedMessages)

    // Initial system message to determine ChatGPT functionality
    // How it responds, how it talks, etc.
    await getChatGptAnswer(updatedMessages)
  }

  async function getChatGptAnswer(messagesWithSender: { message: string; sender: string }[]) {
    const chatGptApiFormattedMessages = messagesWithSender.map((messageObject) => {
      return {
        role: messageObject.sender === 'ChatGPT' ? 'assistant' : 'user',
        content: messageObject.message,
      }
    })

    const chatGptApiMessages = [
      systemMessageToSetChatGptBehaviour, // The system message DEFINES the logic of our chatGPT
      ...chatGptApiFormattedMessages, // The messages from our chat with ChatGPT
    ]

    try {
      const response = await fetch(`/api/chat/message`, {
        method: METHODS.POST,
        body: JSON.stringify(chatGptApiMessages),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()

      const { choices } = data
      setMessages([
        ...messagesWithSender,
        {
          message: choices[0].message.content,
          sender: 'ChatGPT',
        },
      ])
      speak(choices[0].message.content)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const ask = () => {
    setSpeakButtonDisabled(true)
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      setMessages([
        ...messages,
        {
          message: 'Your browser does not support speech recognition software! Try Chrome desktop, maybe?',
          sender: 'ChatGPT',
        },
      ])
      return
    }
    SpeechRecognition.startListening()
    if (transcript !== '') {
      resetTranscript()
    }
    setSpeakButtonDisabled(false)
  }

  return (
    <main className='bg-[#45badd]'>
      <div className='h-screen w-screen lg:flex lg:flex-row lg:items-center lg:justify-center flex-col items-center justify-end lg:p-24 p-10 pt-0'>
        <div className='bg-[url(../public/Bob.gif)] lg:h-[600px] lg:w-[600px] md:h-[calc(100%-200px)] sm:h-[calc(100%-300px)] w-full bg-no-repeat bg-contain bg-center'></div>
        <div className='flex justify-center flex-col items-center lg:w-[calc(100%-600px)]'>
          <div className='text-xl text-[#433136] font-bold pb-4'>
            <FontAwesomeIcon
              icon={faQuoteLeft}
              style={{ color: 'black', fontSize: '35px', paddingRight: '12px' }}
            ></FontAwesomeIcon>
            {messages[messages.length - 1].message}
          </div>
          <button
            className='cursor-pointer outline-none w-[80px] h-[50px] md:text-lg text-white bg-[#ff3482] border-none border-r-5 shadow'
            onClick={ask}
            disabled={speakButtonDisabled}
          >
            <FontAwesomeIcon icon={faMicrophone} style={{ color: 'white', fontSize: 30 }}></FontAwesomeIcon>
          </button>
        </div>
      </div>
    </main>
  )
}
