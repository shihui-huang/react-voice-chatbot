import { render, screen, waitFor } from '@testing-library/react'
import Home from '../pages/index'
import '@testing-library/jest-dom'
import { useRouter } from 'next/router'
import userEvent from '@testing-library/user-event'
import SpeechRecognition from 'react-speech-recognition'
import { afterEach } from 'node:test'

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key) => key }),
}))

class MockSpeechSynthesisUtterance {
  constructor(text) {
    this.text = text
  }
  lang = ''
  onstart = null
  onend = null
}

// Mock speechSynthesis object and its speak function
const mockSpeak = jest.fn()
const mockSpeechSynthesis = {
  speak: mockSpeak,
}

// Temporarily replace window.speechSynthesis with the mock object
const originalSpeechSynthesis = window.speechSynthesis
window.speechSynthesis = mockSpeechSynthesis

// Mock the SpeechSynthesisUtterance object
const originalSpeechSynthesisUtterance = window.SpeechSynthesisUtterance
window.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance

describe('Call bob', () => {
  beforeAll(() => {
    useRouter.mockImplementation(() => ({
      pathname: '/',
      push: mockPush,
    }))
  })

  it("should show bob's self introduction when rendering home page", () => {
    render(<Home />)

    const introduction = screen.getByText('bob.introduction')
    expect(introduction).toBeInTheDocument()
  })

  it("should show browserSupportsSpeechRecognition message when browser doesn't support SpeechRecognition", async () => {
    const user = userEvent.setup()
    render(<Home />)
    const callButton = screen.getByRole('button', { name: 'call.call' })
    expect(callButton).toBeVisible()
    await user.click(callButton)

    const browserNotSupportSpeechRecognitionMessage = await screen.findByText(
      'bob.browserNotSupportSpeechRecognitionMessage',
    )
    expect(browserNotSupportSpeechRecognitionMessage).toBeVisible()
  })

  it('should update button UI when clicking call button and hang up button', async () => {
    jest.spyOn(SpeechRecognition, 'browserSupportsSpeechRecognition').mockReturnValue(true)

    const user = userEvent.setup()
    render(<Home />)
    const callButton = screen.getByRole('button', { name: 'call.call' })
    expect(callButton).toBeVisible()
    await user.click(callButton)

    const hangUpButton = await screen.findByRole('button', { name: 'call.hangUp' })
    expect(hangUpButton).toBeVisible()
    expect(screen.queryByRole('button', { name: 'call.call' })).not.toBeInTheDocument()

    user.click(hangUpButton)
    expect(callButton).toBeVisible()
    await waitFor(() => expect(screen.queryByRole('button', { name: 'call.hangUp' })).not.toBeInTheDocument())
  })

  it('chatbot should speak the first message when clicking call button', async () => {
    jest.spyOn(SpeechRecognition, 'browserSupportsSpeechRecognition').mockReturnValue(true)

    // Mock speechSynthesis object and its speak function
    const mockSpeak = jest.fn()
    const mockSpeechSynthesis = {
      speak: mockSpeak,
    }

    // Temporarily replace window.speechSynthesis with the mock object
    const originalSpeechSynthesis = window.speechSynthesis
    window.speechSynthesis = mockSpeechSynthesis

    const user = userEvent.setup()
    render(<Home />)
    const callButton = screen.getByRole('button', { name: 'call.call' })
    expect(callButton).toBeVisible()
    await user.click(callButton)
    await waitFor(() => {
      // Check if chatbot speaks his first message
      expect(mockSpeak).toHaveBeenCalledTimes(1)
      const utteredMessage = mockSpeak.mock.calls[0][0].text
      expect(utteredMessage).toBe('bob.firstMessage')
    })

    // Restore the original objects after tests
    window.speechSynthesis = originalSpeechSynthesis
    window.SpeechSynthesisUtterance = originalSpeechSynthesisUtterance
  })
})
