import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faMicrophone, faMicrophoneSlash, faSquare } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'next-i18next';

interface TalkButtonProps {
  userCall: () => void;
  userSpeak: () => void;
  userStopSpeaking: () => void;
  listening: boolean;
  isCalling: boolean;
  endCall: () => void;
  isChatbotSpeaking: boolean;
}

export default function TalkButton({
  userCall,
  userSpeak,
  userStopSpeaking,
  listening,
  isCalling,
  endCall,
  isChatbotSpeaking,
}: TalkButtonProps) {
  const { t } = useTranslation();
  if (!isCalling) {
    return (
      <button
        className="cursor-pointer outline-none  md:text-base text-white bg-[#ff3482] rounded-full border-none border-r-5 shadow md:mb-10"
        onClick={userCall}
      >
        <div className="w-[120px] h-[50px] flex justify-center items-center">{t('call.call')}</div>
      </button>
    );
  }

  return (
    <div className="flex justify-center flex-col items-center absolute bottom-7 md:relative lg:bottom-0">
      {listening ? (
        <button className="py-4" onClick={userStopSpeaking}>
          <span className="relative flex h-[50px] w-[50px]">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5797] "></span>
            <span className="relative inline-flex rounded-full h-[50px] w-[50px] bg-[#fc4189] opacity-15 justify-center items-center">
              <FontAwesomeIcon
                icon={faSquare}
                style={{ color: 'white', fontSize: '20px' }}
              ></FontAwesomeIcon>
            </span>
          </span>
        </button>
      ) : (
        <button
          className={`py-4 ${isChatbotSpeaking ? 'pointer-events-none' : ''}`}
          onClick={userSpeak}
        >
          <span className="relative flex h-[50px] w-[50px]">
            <span className="absolute inline-flex h-full w-full rounded-full bg-gray-300"></span>
            <span
              className={`relative inline-flex rounded-full h-[50px] w-[50px] opacity-15 justify-center items-center ${
                isChatbotSpeaking ? 'bg-gray-400' : 'bg-[#fc4189]'
              }`}
            >
              <FontAwesomeIcon
                icon={isChatbotSpeaking ? faMicrophoneSlash : faMicrophone}
                style={{ color: 'white', fontSize: '20px' }}
              ></FontAwesomeIcon>
            </span>
          </span>
        </button>
      )}

      <button
        className="cursor-pointer outline-none w-[120px] h-[50px] md:text-base text-white bg-[#ff3482] rounded-full border-none border-r-5 shadow md:mb-10"
        onClick={endCall}
      >
        {t('call.hangUp')}
      </button>
    </div>
  );
}
