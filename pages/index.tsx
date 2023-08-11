import CallBob from './CallBob'
import {GetStaticProps} from "next";
import {Props} from "next/script";
import {getServerTranslations} from "@/lib/i18n/getServerTranslations";

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { locale } = context;
  return {
    props: {
      ...(await getServerTranslations(locale, ['common'])),
    },
  };
};

export default function Home() {
  return <CallBob />
}
