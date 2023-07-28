import 'regenerator-runtime/runtime'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faQuoteLeft, faSquare } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { METHODS } from '@/constants'
const defaultIntroduction = `Hey there! I'm Bob, your cute chat buddy who loves telling jokes. Let's have a blast talking about anything you like. Give me a call! 📞 Let's chat! `

export default function CallBob() {
  const commands = [
    {
      command: ['*'],
      callback: (command: string) => handleSend(command),
    },
  ]

  const defaultMessage = [
    {
      message: defaultIntroduction,
      sender: 'ChatGPT',
    },
  ]
  const [isCalling, setIsCalling] = useState(false)
  const { transcript, resetTranscript, listening } = useSpeechRecognition({ commands })
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis>()
  const [isChatbotSpeaking, setIsChatBotSpeaking] = useState(false)
  const [messages, setMessages] = useState(defaultMessage)

  useEffect(() => {
    setSpeechSynthesis(window.speechSynthesis)
  }, [])

  const chatBotSpeak = (message: string) => {
    if (isChatbotSpeaking || !speechSynthesis) {
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
    const utterance = new SpeechSynthesisUtterance(message)
    utterance.onstart = handleChatbotSpeechStart
    utterance.onend = handleChatbotSpeechEnd
    speechSynthesis.speak(utterance)
  }

  const handleChatbotSpeechStart = () => {
    setIsChatBotSpeaking(true)
    SpeechRecognition.stopListening()
  }

  const handleChatbotSpeechEnd = () => {
    if (isCalling) {
      SpeechRecognition.startListening()
    }
    setIsChatBotSpeaking(false)
  }
  const systemMessageToSetChatGptBehaviour = {
    role: 'system',
    content:
      'My name is Bob. I am good at finding chat topics and always reply in a friendly and sweet way, and keep my answer as short as possible, I do not like sending emoji',
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
      chatBotSpeak(choices[0].message.content)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const userSpeak = () => {
    SpeechRecognition.startListening()
    if (transcript !== '') {
      resetTranscript()
    }
  }
  const userStopSpeaking = () => {
    SpeechRecognition.stopListening()
  }

  const userCall = () => {
    setIsCalling(true)
    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      setMessages([
        ...messages,
        {
          message: 'Your browser does not support speech recognition software! Try Chrome desktop, maybe?',
          sender: 'ChatGPT',
        },
      ])
      setIsCalling(false)
      return
    }

    const firstMessage = 'Hey there, how was it going ?'
    const formattedMessage = {
      message: firstMessage,
      sender: 'assistant',
    }

    const updatedMessages = [...messages, formattedMessage]

    setMessages(updatedMessages)
    chatBotSpeak(firstMessage)
    setTimeout(() => userSpeak(), 2000)
  }

  const resetConversation = () => {
    setMessages(defaultMessage)
  }

  const endCall = () => {
    SpeechRecognition.stopListening()
    resetConversation()
    setIsCalling(false)
    if (isChatbotSpeaking) {
      speechSynthesis?.cancel()
    }
    setIsChatBotSpeaking(false)
  }

  const callingButtons = React.useMemo(() => {
    return (
      <React.Fragment>
        {listening ? (
          <button className='pb-10 pt-5' onClick={userStopSpeaking}>
            <span className='relative flex h-[60px] w-[60px]'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5797] '></span>
              <span className='relative inline-flex rounded-full h-[60px] w-[60px] bg-[#fc4189] opacity-15 justify-center items-center'>
                <FontAwesomeIcon icon={faSquare} style={{ color: 'white', fontSize: '25px' }}></FontAwesomeIcon>
              </span>
            </span>
          </button>
        ) : (
          <button className='pb-10 pt-5' onClick={userSpeak}>
            <span className='relative flex h-[60px] w-[60px]'>
              <span className='absolute inline-flex h-full w-full rounded-full bg-gray-300'></span>
              <span className='relative inline-flex rounded-full h-[60px] w-[60px] bg-[#fc4189] opacity-15 justify-center items-center'>
                <FontAwesomeIcon icon={faMicrophone} style={{ color: 'white', fontSize: '25px' }}></FontAwesomeIcon>
              </span>
            </span>
          </button>
        )}

        <button
          className='cursor-pointer outline-none w-[120px] h-[50px] md:text-lg text-white bg-[#ff3482] rounded-full border-none border-r-5 shadow'
          onClick={endCall}
        >
          Hang up
        </button>
      </React.Fragment>
    )
  }, [listening])

  return (
    <main className='bg-[#45badd]'>
      <div className='h-screen w-screen lg:flex lg:flex-row lg:items-center lg:justify-center flex-col items-center justify-end lg:p-24 p-10 pt-0 overflow-auto'>
        <div className='bg-[url(../public/Bob.gif)] lg:h-[600px] lg:w-[600px] md:h-[calc(100%-200px)] xs:h-[calc(100%-300px)] w-full bg-no-repeat bg-contain bg-center'></div>
        <div className='flex justify-center flex-col items-center lg:w-[calc(100%-600px)]'>
          <div className='text-xl text-[#433136] font-bold pb-4'>
            <FontAwesomeIcon
              icon={faQuoteLeft}
              style={{ color: 'black', fontSize: '35px', paddingRight: '12px' }}
            ></FontAwesomeIcon>
            {messages[messages.length - 1].message}
          </div>
          {!isCalling ? (
            <button
              className='cursor-pointer outline-none w-[120px] h-[50px] md:text-lg text-white bg-[#ff3482] rounded-full border-none border-r-5 shadow'
              onClick={userCall}
            >
              Call Bob 📞
            </button>
          ) : (
            callingButtons
          )}
        </div>
      </div>
    </main>
  )
}
