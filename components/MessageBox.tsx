import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface MessageBoxProps {
  message: string
}
export default function MessageBox({ message }: MessageBoxProps) {
  return (
    <div className='text-xl text-[#433136] font-bold pb-4'>
      <FontAwesomeIcon
        icon={faQuoteLeft}
        style={{ color: 'black', fontSize: '35px', paddingRight: '12px' }}
      ></FontAwesomeIcon>
      {message}
    </div>
  )
}
