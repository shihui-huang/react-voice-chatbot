import CallBob from './CallBob'
import LanguageDropdown from './LanguageDropdown'
import { Layout } from 'antd'
import LanguageProvider from './LanguageContext'
import { Fragment } from 'react'
import { CallHistory } from './CallHistory'
const { Header, Content } = Layout
export default function MainLayout() {
  return (
    <Fragment>
      <Layout className='h-screen w-screen bg-[#45badd] lg:p-10 p-5 pt-0 lg:pr-15 '>
        <LanguageProvider>
          <Header className='flex bg-[#45badd] items-center h-12 flex-row-reverse'>
            <CallHistory />
            <LanguageDropdown />
          </Header>

          <Content>
            <CallBob />
          </Content>
        </LanguageProvider>
      </Layout>
    </Fragment>
  )
}
