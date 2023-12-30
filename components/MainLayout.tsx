import CallBob from './CallBob';
import LanguageDropdown from './LanguageDropdown';
import { Layout } from 'antd';
import LanguageManager from './LanguageManager';
import { Fragment } from 'react';
import { CallHistory } from './CallHistory';
import { GithubLink } from './GithubLink';
import ConversionIdeasModal from './ConversationIdeasModal';
import CallManager from './CallManager';
const { Header, Content } = Layout;
export default function MainLayout() {
  return (
    <Fragment>
      <Layout className="h-screen w-screen bg-[#45badd] lg:p-10 p-5 pt-0 lg:pr-15 ">
        <LanguageManager>
          <CallManager>
            <Header className="flex bg-[#45badd] items-center h-12 flex-row px-0 justify-between">
              <GithubLink />
              <div className="flex items-center">
                <ConversionIdeasModal />
                <CallHistory />
                <LanguageDropdown />
              </div>
            </Header>
            <Content>
              <CallBob />
            </Content>
          </CallManager>
        </LanguageManager>
      </Layout>
    </Fragment>
  );
}
