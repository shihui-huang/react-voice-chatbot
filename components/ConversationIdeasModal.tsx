import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Drawer, Button, List } from 'antd';
import { languageOptions, useLanguage } from './LanguageManager';
import { useCallManager } from './CallManager';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-regular-svg-icons';
import styled from 'styled-components';

const StyledDrawer = styled(Drawer)`
  .ant-drawer-body {
    padding: 0;
    background-color: rgb(17 24 39);
  }
  .ant-drawer-header {
    background-color: rgb(17 24 39);
  }
  .ant-drawer-title {
    display: flex;
    justify-content: center;
  }
  .ant-drawer-close {
    color: white;
  }
  .ant-list-item {
    display: flex;
    justify-content: center;
  }
`;

export default function ConversionIdeasModal() {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();
  const { handleSend } = useCallManager();
  const conversationIdeas: { key: string; title: string; prompt: string }[] = [
    {
      key: 'conversation.fitnessCoach',
      title: t('conversation.fitnessCoach.title'),
      prompt: t('conversation.fitnessCoach.prompt'),
    },
    {
      key: 'conversation.jobInterview',
      title: t('conversation.jobInterview.title'),
      prompt: t('conversation.jobInterview.prompt'),
    },
    {
      key: 'conversation.languagePractice',
      title: t('conversation.languagePractice.title'),
      prompt: t('conversation.languagePractice.prompt', {
        language: languageOptions[selectedLanguage],
      }),
    },
    {
      key: 'conversation.knowledgeQuiz',
      title: t('conversation.knowledgeQuiz.title'),
      prompt: t('conversation.knowledgeQuiz.prompt'),
    },
  ];

  return (
    <div className="flex mt-1 justify-center md:hidden items-center">
      <Button type="primary" onClick={() => setDrawerVisible(true)}>
        <FontAwesomeIcon
          icon={faMessage}
          style={{ color: 'black', fontSize: '18px' }}
        ></FontAwesomeIcon>
      </Button>

      <StyledDrawer
        title={<div className="text-white">{t('conversation.idea')}</div>}
        placement="bottom"
        height="50%"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
      >
        <List
          dataSource={conversationIdeas}
          renderItem={item => (
            <List.Item className="h-[50px] text-white bg-gray-500 my-1 mx-4 rounded-lg">
              <Button
                className="text-white text-base"
                type="link"
                onClick={() => {
                  handleSend(item.prompt);
                  setDrawerVisible(false);
                }}
              >
                {item.title}
              </Button>
            </List.Item>
          )}
        />
      </StyledDrawer>
    </div>
  );
}
