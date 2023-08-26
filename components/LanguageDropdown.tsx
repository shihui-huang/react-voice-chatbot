import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Dropdown, MenuProps, Space } from 'antd'
import { useLanguage } from './LanguageContext'

function LanguageDropdown() {
  const { selectedLanguage, changeLanguage } = useLanguage()
  const onClick: MenuProps['onClick'] = ({ key }) => {
    changeLanguage(key)
  }

  const languageOptions: MenuProps['items'] = [
    {
      label: '🇺🇸 English',
      key: 'en-US',
    },
    {
      type: 'divider',
    },
    {
      label: '🇫🇷 Français',
      key: 'fr-FR',
    },
    {
      type: 'divider',
    },
    {
      label: '🇨🇳 中文',
      key: 'zh-CN',
    },
  ]
  //@ts-ignore
  const selectedLabel = languageOptions.find((item) => item?.key === selectedLanguage)?.label
  return (
    <Dropdown menu={{ items: languageOptions, onClick }} className='hover:text-black'>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          {selectedLabel}
          <FontAwesomeIcon icon={faChevronDown} style={{ paddingRight: '12px' }}></FontAwesomeIcon>
        </Space>
      </a>
    </Dropdown>
  )
}

export default LanguageDropdown
