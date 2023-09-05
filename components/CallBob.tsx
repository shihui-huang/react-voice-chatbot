import 'regenerator-runtime/runtime'

import React from 'react'

import ConversionIdea from './ConversionIdea'
import MessageBox from './MessageBox'
import TalkButton from './TalkButton'
import { useCallManager } from './CallManager'

export default function CallBob() {
  const { userCall, userSpeak, userStopSpeaking, listening, isCalling, endCall, handleSend, messages } =
    useCallManager()
  return (
    <div className='flex lg:flex-row lg:items-center lg:justify-center xxs:h-full flex-col items-center justify-end overflow-auto'>
      <div className='bg-[url(../public/assets/Bob.gif)] lg:h-[500px] lg:w-[500px] xxs:h-0 w-full bg-no-repeat bg-contain bg-center'></div>
      <div className='flex justify-center flex-col items-center lg:w-[calc(100%-600px)] w-full xxs:h-full'>
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
