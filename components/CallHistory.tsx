import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'antd'
import { useTranslation } from 'next-i18next'

import type { MenuProps } from 'antd'
import { Layout, Menu } from 'antd'
import { MessageType } from './CallBob'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot, faUser } from '@fortawesome/free-solid-svg-icons'
import styled from 'styled-components'

const { Sider } = Layout

export interface CallHistoryType {
  date: string
  messages: MessageType[]
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
    justify-content: center;
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
`

export function CallHistory() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()
  const [callHistories, setCallHistories] = useState<CallHistoryType[]>([])
  const [selectedKey, setSelectedKey] = useState('')

  useEffect(() => {
    const useCallHistories: CallHistoryType[] = localStorage.getItem('callHistory')
      ? JSON.parse(localStorage.getItem('callHistory') as string)
      : []
    setCallHistories(useCallHistories)
  }, [open])

  useEffect(() => {
    setSelectedKey(callHistories[0]?.date)
  }, [])

  const items: MenuProps['items'] = callHistories.map((history) => ({
    key: history.date,
    label: history.date,
  }))

  return (
    <>
      <Button type='link' className='text-black hover:!text-black' onClick={() => setOpen(true)}>
        {t('call.history')}
      </Button>
      <StyledModal
        title={t('call.history')}
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        className='rounded-lg xs:!w-full lg:!w-[calc(100%-100px)] overflow-y-auto'
        footer={null}
      >
        <Layout hasSider className='flex rounded-lg'>
          <Sider className=' !bg-gray-900 shadow-inner'>
            <Menu
              items={items}
              onClick={(item) => setSelectedKey(item.key)}
              selectedKeys={[selectedKey]}
              className='!bg-gray-900  text-white'
              itemProp=''
            />
          </Sider>
          <Layout className='w-full overflow-y-auto'>
            <div className='bg-white '>
              {selectedKey && callHistories.length > 0
                ? callHistories
                    .find((history) => history.date === selectedKey)
                    ?.messages.map((message, index) => (
                      <div
                        key={index}
                        className={`p-4 justify-center text-base md:gap-6 md:py-6 m-auto ${
                          message.sender !== 'user' ? 'bg-gray-50' : 'bg-[rgba(217,217,227,.8)]'
                        }`}
                      >
                        <div className='flex text-base mx-auto md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl'>
                          <div className='flex'>
                            <div
                              className={`w-9 h-9 flex justify-center items-center ${
                                message.sender !== 'user' ? 'bg-[#FC4189]' : ' bg-[#45BADD]'
                              }`}
                            >
                              {message.sender === 'user' ? (
                                <FontAwesomeIcon
                                  icon={faUser}
                                  style={{ color: 'white', fontSize: '18px' }}
                                ></FontAwesomeIcon>
                              ) : (
                                <FontAwesomeIcon
                                  icon={faRobot}
                                  style={{ color: 'white', fontSize: '18px' }}
                                ></FontAwesomeIcon>
                              )}
                            </div>
                            <div className='ml-7 w-fit'>{message.message}</div>
                          </div>
                        </div>
                      </div>
                    ))
                : null}
            </div>
          </Layout>
        </Layout>
      </StyledModal>
    </>
  )
}
