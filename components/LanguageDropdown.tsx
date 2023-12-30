import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dropdown, MenuProps, Space } from 'antd';
import styled from 'styled-components';
import { useLanguage } from './LanguageManager';

const StyledDropdown = styled(Dropdown)`
  .ant-dropdown-menu-title-content {
    padding-left: 8px;
  }
`;
const StyledSpace = styled(Space)`
  .ant-space {
    gap: 0;
  }
`;

interface languageOptionItem {
  label: string;
  icon: string;
  key: string;
}
const languageOptions: MenuProps['items'] = [
  {
    label: 'English',
    icon: '🇺🇸',
    key: 'en-US',
  },
  {
    type: 'divider',
  },
  {
    label: 'Français',
    icon: '🇫🇷',
    key: 'fr-FR',
  },
  {
    type: 'divider',
  },
  {
    label: '中文',
    icon: '🇨🇳',
    key: 'zh-CN',
  },
];

function LanguageDropdown() {
  const { selectedLanguage, changeLanguage } = useLanguage();
  const onClick: MenuProps['onClick'] = ({ key }) => {
    changeLanguage(key);
  };

  const selectedOption = languageOptions?.find(
    item => item?.key === selectedLanguage
  ) as languageOptionItem;
  const selectedLabel = selectedOption.label;
  const selectedIcon = selectedOption.icon;
  return (
    <StyledDropdown menu={{ items: languageOptions, onClick }} className="hover:text-black">
      <a onClick={e => e.preventDefault()}>
        <StyledSpace>
          <div className="text-[20px]">{selectedIcon}</div>
          <div className="xxs:hidden md:block">{selectedLabel}</div>
          <FontAwesomeIcon
            className="xxs:hidden md:block"
            icon={faChevronDown}
            style={{ paddingRight: '10px' }}
          ></FontAwesomeIcon>
        </StyledSpace>
      </a>
    </StyledDropdown>
  );
}

export default LanguageDropdown;
