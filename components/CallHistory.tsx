import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { useTranslation } from 'next-i18next';

import type { MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faClose, faPhone, faRobot, faUser } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { MessageType } from './CallManager';

const { Sider } = Layout;

export interface CallHistoryType {
  date: string;
  messages: MessageType[];
}

const StyledModal = styled(Modal)`
  .ant-modal-content {
    padding: 0;
    height: 100vh;
  }
  .ant-modal-header {
    padding: 16px;
    height: 56px;
    margin: 0;
    display: flex;
    @media (mix-width: 640px) {
      justify-content: center;
    }
  }
  .ant-modal-title {
    width: 100%;
  }
  .ant-modal-body {
    height: calc(100% - 56px);
  }
  .ant-layout-has-sider {
    height: 100%;
  }
  .ant-menu-item-selected,
  .ant-menu-item:hover {
    background: rgba(52, 53, 65);
    color: white !important;
  }
  .ant-layout-sider-children {
    overflow-y: auto;
  }
`;

export function CallHistory() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const [callHistories, setCallHistories] = useState<CallHistoryType[]>([]);
  const [selectedKey, setSelectedKey] = useState('');
  const [showHistoryLayout, setShowHistoryLayout] = useState(false); // to manage sider and history layout visibility on small screens

  useEffect(() => {
    const useCallHistories: CallHistoryType[] = localStorage.getItem('callHistory')
      ? JSON.parse(localStorage.getItem('callHistory') as string)
      : [];
    setCallHistories(useCallHistories);
    setShowHistoryLayout(false);
  }, [open]);

  useEffect(() => {
    setSelectedKey(callHistories[callHistories.length - 1]?.date);
  }, [callHistories]);

  const handleSidebarClick = (key: string) => {
    setSelectedKey(key);
    setShowHistoryLayout(true);
  };

  const handleBackClick = () => {
    setShowHistoryLayout(false);
  };

  const items: MenuProps['items'] = callHistories.map(history => ({
    key: history.date,
    label: history.date,
  }));

  const modalCloseButton = (
    <div data-testid={`history-modal-close-button-${open}`}>
      <FontAwesomeIcon
        icon={faClose}
        style={{ fontSize: '18px', color: 'black' }}
      ></FontAwesomeIcon>
    </div>
  );

  const noHistoryDom = (
    <div className="h-full flex justify-center items-center ">
      {t('callHistory.modal.noHistoryMessage')}
    </div>
  );
  return (
    <>
      <Button
        type="link"
        className="text-black hover:!text-black mr-3"
        onClick={() => setOpen(true)}
      >
        <div className="xxs:hidden md:block">{t('callHistory')}</div>
        <div className="xxs:block md:hidden">
          <FontAwesomeIcon icon={faPhone} style={{ fontSize: '18px' }}></FontAwesomeIcon>
        </div>
      </Button>
      <StyledModal
        title={
          showHistoryLayout ? (
            <div className="flex w-full">
              <div className="flex-1 md:opacity-0">
                <FontAwesomeIcon
                  icon={faAngleLeft}
                  style={{ fontSize: '18px' }}
                  onClick={handleBackClick}
                ></FontAwesomeIcon>
              </div>
              <div className="flex-1 flex justify-center">{t('callHistory.modal.title')}</div>
              <div className="flex-1">{''}</div>
            </div>
          ) : (
            <div className="justify-center flex">{t('callHistory.modal.title')}</div>
          )
        }
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        className="rounded-lg xxs:!w-full xxs:max-w-none md:!w-[calc(100%-100px)] overflow-y-auto"
        footer={null}
        closeIcon={modalCloseButton}
      >
        <Layout hasSider className={`flex rounded-lg`}>
          <Sider
            className={`!bg-gray-900 md:block md:!grow-0 md:!shrink-0 md:!basis-[200px] md:max-w-[200px] md:w-[200px] ${
              showHistoryLayout
                ? 'xxs:hidden'
                : 'xxs:block xxs:!w-full xxs:!max-w-none xxs:!flex-initial'
            }`}
          >
            <Menu
              items={items}
              onClick={item => handleSidebarClick(item.key)}
              selectedKeys={[selectedKey]}
              className="!bg-gray-900  text-white"
              itemProp=""
            />
          </Sider>
          <Layout className={`w-full md:block ${showHistoryLayout ? 'xxs:block' : 'xxs:hidden'}`}>
            <div className="bg-white md:h-full overflow-y-auto">
              {selectedKey && callHistories.length > 0
                ? callHistories
                    .find(history => history.date === selectedKey)
                    ?.messages.map((message, index) => (
                      <div
                        key={index}
                        className={`p-4 justify-center text-base md:gap-6 md:py-6 m-auto ${
                          message.sender !== 'user' ? 'bg-gray-50' : 'bg-[rgba(217,217,227,.8)]'
                        }`}
                      >
                        <div className="flex text-base mx-auto md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl">
                          <div className="flex">
                            <div
                              className={`w-9 h-9 flex justify-center items-center ${
                                message.sender !== 'user' ? 'bg-[#FC4189]' : ' bg-[#45BADD]'
                              }`}
                            >
                              {message.sender === 'user' ? (
                                <FontAwesomeIcon
                                  icon={faUser}
                                  style={{
                                    color: 'white',
                                    fontSize: '18px',
                                  }}
                                ></FontAwesomeIcon>
                              ) : (
                                <FontAwesomeIcon
                                  icon={faRobot}
                                  style={{
                                    color: 'white',
                                    fontSize: '18px',
                                  }}
                                ></FontAwesomeIcon>
                              )}
                            </div>
                            <div className="ml-7 w-fit">{message.message}</div>
                          </div>
                        </div>
                      </div>
                    ))
                : noHistoryDom}
            </div>
          </Layout>
        </Layout>
      </StyledModal>
    </>
  );
}
