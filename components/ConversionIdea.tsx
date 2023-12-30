import { useTranslation } from 'next-i18next';
import { languageOptions, useLanguage } from './LanguageManager';

interface ConversionIdeaProps {
  onSelect: (prompt: string) => void;
}
export default function ConversionIdea({ onSelect }: ConversionIdeaProps) {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();
  const converSationIdeas: { key: string; title: string; prompt: string }[] = [
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
    <div className="xxs:mt-10 md:mt-0 w-full overflow-x-auto justify-center xxs:hidden md:flex">
      {converSationIdeas.map(idea => (
        <button
          className="bg-[#fdcfe1] border-2 border-[#e64683cf] mr-3 px-3 py-1 last:mr-0 text-black rounded"
          key={idea.key}
          onClick={() => onSelect(idea.prompt)}
        >
          {idea.title}
        </button>
      ))}
    </div>
  );
}
