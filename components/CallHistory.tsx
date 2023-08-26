import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'antd'
import { useTranslation } from 'next-i18next'

import type { MenuProps } from 'antd'
import { Layout, Menu } from 'antd'

const { Sider } = Layout

export function CallHistory() {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation()

  //   useEffect(() => {
  //     const callHistory = localStorage.getItem('callHistory') ? JSON.parse(localStorage.getItem('callHistory')) : []
  //   }, [])

  const callHistories = [
    {
      date: '2021-10-01 09:20:23',
      messages: [
        {
          message:
            "Hey there! I'm Bob, your cute chat buddy who loves telling jokes. Let's have a blast talking about anything you like. Give me a call! 📞 Let's chat! ",
          sender: 'ChatGPT',
        },
        {
          message: 'Hey there, how was it going ? ',
          sender: 'assistant',
        },
        {
          message: "I'm doing good and you",
          direction: 'outgoing',
          sender: 'user',
        },
        {
          message: "I'm glad to hear that you're doing well! How can I assist you today?",
          sender: 'ChatGPT',
        },
        {
          message: "I'm going to Toulouse this week",
          direction: 'outgoing',
          sender: 'user',
        },
      ],
    },
    {
      date: '2021-10-02 05:30:30',
      messages: [
        {
          message:
            "Hey there! I'm Bob, your cute chat buddy who loves telling jokes. Let's have a blast talking about anything you like. Give me a call! 📞 Let's chat! ",
          sender: 'ChatGPT',
        },
        {
          message: 'Hey there, how was it going ? ',
          sender: 'assistant',
        },
        {
          message: 'ok',
          direction: 'outgoing',
          sender: 'user',
        },
        {
          message: "I'm glad to hear that you're doing well! How can I assist you today?",
          sender: 'ChatGPT',
        },
      ],
    },
  ]
  const defaultSelectedKey = callHistories[0]?.date
  const [selectedKey, setSelectedKey] = useState(defaultSelectedKey)

  const items: MenuProps['items'] = callHistories.map((history) => ({
    key: history.date,
    label: history.date,
  }))

  return (
    <>
      <Button type='link' className='text-black hover:!text-black' onClick={() => setOpen(true)}>
        {t('call.history')}
      </Button>
      <Modal
        title={t('call.history')}
        centered
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        className='xs:!w-full lg:!w-[calc(100%-100px)]'
      >
        <Layout hasSider>
          <Sider
            style={{
              overflow: 'auto',
              height: '100vh',
              left: 0,
              top: 0,
              bottom: 0,
              background: 'white',
            }}
          >
            <Menu
              theme='light'
              mode='inline'
              defaultSelectedKeys={[defaultSelectedKey]}
              items={items}
              onClick={(item) => setSelectedKey(item.key)}
              selectedKeys={[selectedKey]}
            />
          </Sider>
          <Layout className='site-layout'>
            <div style={{ padding: 24, textAlign: 'center', background: 'white' }}>
              {/* {selectedKey
                ? callHistories
                    .find((history) => history.date === selectedKey)
                    ?.messages.map((message) => <div>{message}</div>)
                : null} */}
                message
            </div>
          </Layout>
        </Layout>
      </Modal>
    </>
  )
}
