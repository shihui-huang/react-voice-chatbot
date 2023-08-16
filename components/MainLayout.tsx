import CallBob from './CallBob'
import LanguageDropdown from './LanguageDropdown'
import { Layout } from 'antd'
import LanguageProvider from './LanguageContext'
const { Header, Content } = Layout
export default function MainLayout() {
  return (
    <main>
      <Layout className='h-screen w-screen bg-[#45badd] p-10 pt-0 lg:pr-15 '>
        <LanguageProvider>
          <Header className='flex bg-[#45badd] items-center h-12'>
            <LanguageDropdown />
          </Header>

          <Content>
            <CallBob />
          </Content>
        </LanguageProvider>
      </Layout>
    </main>
  )
}
