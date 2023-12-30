jest.mock('react-speech-recognition', () => ({
  startListening: jest.fn(),
  stopListening: jest.fn(),
  abortListening: jest.fn(),
  browserSupportsSpeechRecognition: jest.fn(() => true),
  useSpeechRecognition: jest.fn().mockReturnValue({
    transcript: '',
    resetTranscript: jest.fn(),
    listening: false,
  }),
}));

jest.mock('next-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}));

import { render, screen, waitFor } from '@testing-library/react';
import Home from '../pages/index';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import SpeechRecognition from 'react-speech-recognition';
import Router from 'next/router';
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

jest.mock('next/router', () => ({ push: jest.fn() }));

const mockHandleChatbotSpeechStart = jest.fn();
const mockHandleChatbotSpeechEnd = jest.fn();
class MockSpeechSynthesisUtterance {
  constructor(text) {
    this.text = text;
  }
  lang = '';
  onstart = mockHandleChatbotSpeechStart;
  onend = mockHandleChatbotSpeechEnd;
}

describe('Call bob', () => {
  let originalSpeechSynthesis;
  let originalSpeechSynthesisUtterance;

  beforeAll(() => {
    originalSpeechSynthesis = window.speechSynthesis;
    originalSpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
  });

  beforeEach(() => {
    SpeechRecognition.browserSupportsSpeechRecognition.mockReturnValue(true);
    // Mock the SpeechSynthesisUtterance object
    window.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  afterAll(() => {
    window.speechSynthesis = originalSpeechSynthesis;
    window.SpeechSynthesisUtterance = originalSpeechSynthesisUtterance;
  });

  it("should show bob's self introduction when rendering home page", () => {
    render(<Home />);

    const introduction = screen.getByText('bob.introduction');
    expect(introduction).toBeInTheDocument();
  });

  it("should show browserSupportsSpeechRecognition message when browser doesn't support SpeechRecognition", async () => {
    SpeechRecognition.browserSupportsSpeechRecognition.mockReturnValue(false);
    const user = userEvent.setup();
    render(<Home />);
    const callButton = screen.getByRole('button', { name: 'call.call' });
    expect(callButton).toBeVisible();
    await user.click(callButton);

    const browserNotSupportSpeechRecognitionMessage = await screen.findByText(
      'bob.browserNotSupportSpeechRecognitionMessage'
    );
    expect(browserNotSupportSpeechRecognitionMessage).toBeVisible();
  });

  it('should update button UI when clicking call button and hang up button', async () => {
    const user = userEvent.setup();
    render(<Home />);
    const callButton = screen.getByRole('button', { name: 'call.call' });
    expect(callButton).toBeVisible();
    await user.click(callButton);

    const hangUpButton = await screen.findByRole('button', {
      name: 'call.hangUp',
    });
    expect(hangUpButton).toBeVisible();
    expect(screen.queryByRole('button', { name: 'call.call' })).not.toBeInTheDocument();

    user.click(hangUpButton);
    expect(callButton).toBeVisible();
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'call.hangUp' })).not.toBeInTheDocument()
    );
  });

  it('chatbot should speak the first message when clicking call button', async () => {
    // Mock speechSynthesis object and its speak function
    const mockSpeak = jest.fn();
    const mockSpeechSynthesis = {
      speak: mockSpeak,
    };

    // Temporarily replace window.speechSynthesis with the mock object
    window.speechSynthesis = mockSpeechSynthesis;

    const user = userEvent.setup();
    render(<Home />);
    const callButton = screen.getByRole('button', { name: 'call.call' });
    expect(callButton).toBeVisible();
    await user.click(callButton);
    await waitFor(() => {
      // Check if chatbot speaks his first message
      expect(mockSpeak).toHaveBeenCalledTimes(1);
      const utteredMessage = mockSpeak.mock.calls[0][0].text;
      expect(utteredMessage).toBe('bob.firstMessage');
    });
    mockSpeak.mockReset();
  });

  it('chatbot should start to listen when finish speaking', async () => {
    // Mock speechSynthesis object and its speak and cancel function
    const mockSpeak = jest.fn(utterance => {
      utterance.onstart && utterance.onstart();
      // Simulate that the speech has ended after a delay
      setTimeout(() => {
        utterance.onend && utterance.onend();
      }, 100);
    });

    const mockCancel = jest.fn();
    const mockSpeechSynthesis = {
      speak: mockSpeak,
      cancel: mockCancel,
    };

    // Temporarily replace window.speechSynthesis with the mock object
    window.speechSynthesis = mockSpeechSynthesis;

    const user = userEvent.setup();
    render(<Home />);
    const callButton = screen.getByRole('button', { name: 'call.call' });
    expect(callButton).toBeVisible();
    await user.click(callButton);
    await waitFor(() => {
      expect(SpeechRecognition.startListening).toHaveBeenCalledTimes(1);
    });

    mockSpeak.mockReset();
    mockCancel.mockReset();
  });

  it('chatbot should stop talking when hang up', async () => {
    // Mock speechSynthesis object and its speak and cancel function
    const mockSpeak = jest.fn(utterance => {
      utterance.onstart && utterance.onstart();
    });

    const mockCancel = jest.fn();

    const mockSpeechSynthesis = {
      speak: mockSpeak,
      cancel: mockCancel,
    };

    // Temporarily replace window.speechSynthesis with the mock object
    window.speechSynthesis = mockSpeechSynthesis;

    const user = userEvent.setup();
    render(<Home />);
    const callButton = screen.getByRole('button', { name: 'call.call' });
    expect(callButton).toBeVisible();
    await user.click(callButton);

    const hangUpButton = await screen.findByRole('button', {
      name: 'call.hangUp',
    });
    expect(hangUpButton).toBeVisible();
    user.click(hangUpButton);

    // Wait for the onend event to fire
    await new Promise(resolve => setTimeout(resolve, 150));

    expect(mockCancel).toHaveBeenCalledTimes(1);
    mockSpeak.mockReset();
    mockCancel.mockReset();
  });

  it('should hang up when changing the language', async () => {
    const user = userEvent.setup();
    render(<Home />);
    const callButton = screen.getByRole('button', { name: 'call.call' });
    expect(callButton).toBeVisible();
    await user.click(callButton);

    // hangup button should be visible
    const hangUpButton = await screen.findByRole('button', {
      name: 'call.hangUp',
    });
    expect(hangUpButton).toBeVisible();
    expect(screen.queryByRole('button', { name: 'call.call' })).not.toBeInTheDocument();

    // change language
    const languageSelect = await screen.findByText(/English/i);
    userEvent.click(languageSelect);

    const frenchOption = await screen.findByText(/Français/i);
    userEvent.click(frenchOption);

    // check if we change the route
    await waitFor(() =>
      expect(Router.push).toHaveBeenCalledWith('/', undefined, {
        locale: 'fr-FR',
      })
    );
    // hangup button should not be visible
    await waitFor(() => expect(screen.queryByRole('button', { name: 'call.call' })).toBeVisible());
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'call.hangUp' })).not.toBeInTheDocument()
    );
  });

  it('should start calling when clicking on one of conversation idea', async () => {
    global.fetch.mockResolvedValue(
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            choices: [{ message: { content: 'Mocked message from ChatGPT' } }],
          }),
      })
    );

    render(<Home />);

    // click on Language Practice
    const languagePracticeButton = await screen.findByText('conversation.languagePractice.title');
    userEvent.click(languagePracticeButton);

    // Assert that the hangup button is visible after starting the call
    const hangUpButton = await screen.findByRole('button', {
      name: 'call.hangUp',
    });
    expect(hangUpButton).toBeVisible();

    // should show the right prompt
    const prompt = await screen.findByText('conversation.languagePractice.prompt');
    expect(prompt).toBeVisible();

    // should send right message to ChatGPT api
    expect(fetch).toHaveBeenCalledWith('/api/chat/message', {
      method: 'POST',
      body: '[{"role":"system"},{"role":"assistant","content":"bob.introduction"},{"role":"user","content":"conversation.languagePractice.prompt"}]',
    });

    // should show chatbot's response
    const chatGptResponse = await screen.findByText('Mocked message from ChatGPT');
    expect(chatGptResponse).toBeVisible();
  });

  it('should stock call history when call is ended', async () => {
    const mockDate = new Date('2023-09-03T10:40:00');
    global.Date = jest.fn().mockImplementation(() => mockDate); // mock Date "new" constructor

    const user = userEvent.setup();
    render(<Home />);

    const callHistoryButton = screen.getByRole('button', {
      name: 'callHistory',
    });
    expect(callHistoryButton).toBeVisible();
    user.click(callHistoryButton);

    const noHistoryMessage = await screen.findByText('callHistory.modal.noHistoryMessage');
    expect(screen.queryByText('2023-09-03T08:40:00.000Z')).not.toBeInTheDocument();
    expect(screen.queryByText('bob.firstMessage')).not.toBeInTheDocument();
    expect(noHistoryMessage).toBeInTheDocument();
    const historyModalCloseButton = await screen.findByTestId('history-modal-close-button-true');
    user.click(historyModalCloseButton);

    const callButton = await screen.findByRole('button', { name: 'call.call' });
    expect(callButton).toBeVisible();
    user.click(callButton);

    const hangUpButton = await screen.findByRole('button', {
      name: 'call.hangUp',
    });
    expect(hangUpButton).toBeVisible();
    expect(screen.queryByRole('button', { name: 'call.call' })).not.toBeInTheDocument();

    user.click(hangUpButton);
    expect(callButton).toBeVisible();
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'call.hangUp' })).not.toBeInTheDocument()
    );

    await user.click(callHistoryButton);
    await waitFor(() => expect(screen.getByText('2023-09-03T08:40:00.000Z')).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText('bob.firstMessage')).toBeVisible());
    expect(noHistoryMessage).not.toBeInTheDocument();
  });
});
