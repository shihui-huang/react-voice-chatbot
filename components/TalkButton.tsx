import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { faMicrophone, faSquare } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'next-i18next'

interface TalkButtonProps {
  userCall: () => void
  userSpeak: () => void
  userStopSpeaking: () => void
  listening: boolean
  isCalling: boolean
  endCall: () => void
}

export default function TalkButton({
  userCall,
  userSpeak,
  userStopSpeaking,
  listening,
  isCalling,
  endCall,
}: TalkButtonProps) {
  const { t } = useTranslation()

  const startConversationButton = React.useMemo(() => {
    return (
      <button
        className='cursor-pointer outline-none w-[145px] h-[60px] md:text-lg text-white bg-[#ff3482] rounded-full border-none border-r-5 shadow'
        onClick={userCall}
      >
        {t('call.call')}
      </button>
    )
  }, [])

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
          className='cursor-pointer outline-none w-[145px] h-[60px] md:text-lg text-white bg-[#ff3482] rounded-full border-none border-r-5 shadow'
          onClick={endCall}
        >
          {t('call.hangUp')}
        </button>
      </React.Fragment>
    )
  }, [listening])

  return (
    <div className='flex justify-center flex-col items-center absolute bottom-7 lg:relative lg:bottom-0'>
      {!isCalling ? startConversationButton : callingButtons}
    </div>
  )
}
