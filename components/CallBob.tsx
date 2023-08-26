import 'regenerator-runtime/runtime'

import React, { useEffect, useState } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { METHODS } from '@/constants'
import { useTranslation } from 'next-i18next'
import { useLanguage } from './LanguageContext'
import ConversionIdea from './ConversionIdea'
import MessageBox from './MessageBox'
import TalkButton from './TalkButton'

let isUserCalling = false
let isChatbotSpeaking = false

export default function CallBob() {
  const commands = [
    {
      command: ['*'],
      callback: (command: string) => handleSend(command),
    },
  ]
  let userSpeechSynthesis: SpeechSynthesis | undefined
  let userLocalStorage: Storage | undefined
  useEffect(() => {
    userSpeechSynthesis = window.speechSynthesis
    userLocalStorage = localStorage
  }, [])

  const [isCalling, setIsCalling] = useState(isUserCalling)
  const { transcript, resetTranscript, listening } = useSpeechRecognition({ commands })
  const { t } = useTranslation()
  const { selectedLanguage } = useLanguage()
  const defaultIntroduction = t('bob.introduction')
  const defaultMessage = [
    {
      message: defaultIntroduction,
      sender: 'ChatGPT',
    },
  ]
  const [messages, setMessages] = useState(defaultMessage)

  // if selectedLanguage changes, reset call
  useEffect(() => {
    endCall()
  }, [defaultIntroduction])

  const chatBotSpeak = (message: string) => {
    if (isChatbotSpeaking || !userSpeechSynthesis || !isUserCalling) {
      return
    }

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      userSpeechSynthesis.speak(new SpeechSynthesisUtterance(t('bob.browserNotSupportSpeechRecognitionMessage')))
      return
    }
    const utterance = new SpeechSynthesisUtterance(message)
    utterance.lang = selectedLanguage
    utterance.onstart = handleChatbotSpeechStart
    utterance.onend = handleChatbotSpeechEnd
    userSpeechSynthesis.speak(utterance)
    console.log('chatbot speak')
  }

  const handleChatbotSpeechStart = () => {
    isChatbotSpeaking = true
    SpeechRecognition.stopListening()
  }

  const handleChatbotSpeechEnd = () => {
    console.log('end speak')
    if (isUserCalling) {
      console.log('start lisening')
      SpeechRecognition.startListening({ language: selectedLanguage })
    }
    isChatbotSpeaking = false
  }
  const systemMessageToSetChatGptBehaviour = {
    role: 'system',
    content: t('bob.systemMessage'),
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

    // Call from conversation ideas
    if (!isUserCalling) {
      isUserCalling = true
      setIsCalling(isUserCalling)
    }
    if (isChatbotSpeaking) {
      userSpeechSynthesis?.cancel()
      isChatbotSpeaking = false
    }
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
    SpeechRecognition.startListening({ language: selectedLanguage })

    if (transcript !== '') {
      resetTranscript()
    }
  }
  const userStopSpeaking = () => {
    SpeechRecognition.stopListening()
  }

  const userCall = () => {
    isUserCalling = true
    setIsCalling(isUserCalling)

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
      setMessages([
        ...messages,
        {
          message: t('bob.browserNotSupportSpeechRecognitionMessage'),
          sender: 'ChatGPT',
        },
      ])
      isUserCalling = false
      setIsCalling(isUserCalling)
      return
    }

    const firstMessage = t('bob.firstMessage')
    const formattedMessage = {
      message: firstMessage,
      sender: 'assistant',
    }

    const updatedMessages = [...messages, formattedMessage]

    setMessages(updatedMessages)
    console.log('user has called')
    chatBotSpeak(firstMessage)
  }

  const resetConversation = () => {
    setMessages(defaultMessage)
  }

  const endCall = () => {
    SpeechRecognition.stopListening()
    resetConversation()
    isUserCalling = false
    setIsCalling(isUserCalling)
    if (isChatbotSpeaking) {
      userSpeechSynthesis?.cancel()
      isChatbotSpeaking = false
    }
    SpeechRecognition.abortListening()
    userLocalStorage?.setItem('callHistory', JSON.stringify({ messages, date: new Date() }))
    console.log(messages)
  }

  return (
    <div className='flex lg:flex-row lg:items-center lg:justify-center xs:h-full flex-col items-center justify-end overflow-auto'>
      <div className='bg-[url(../public/Bob.gif)] lg:h-[500px] lg:w-[500px] xs:h-0 w-full bg-no-repeat bg-contain bg-center'></div>
      <div className='flex justify-center flex-col items-center lg:w-[calc(100%-600px)] w-full xs:h-full'>
        <MessageBox message={messages[messages.length - 1].message} />
        <TalkButton
          userCall={userCall}
          userSpeak={userSpeak}
          userStopSpeaking={userStopSpeaking}
          listening={listening}
          isCalling={isCalling}
          endCall={endCall}
        />
        <ConversionIdea onSelect={handleSend} />
      </div>
    </div>
  )
}
