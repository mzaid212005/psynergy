import { test, expect } from '@playwright/test'

test.describe('AI Chat System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to chat page (assuming user is authenticated)
    await page.goto('/chat')
  })

  test('should display chat interface', async ({ page }) => {
    await expect(page.getByText('AI Mental Health Support')).toBeVisible()
    await expect(page.getByPlaceholder('Type your message...')).toBeVisible()
    await expect(page.getByRole('button', { name: /send/i })).toBeVisible()
  })

  test('should send and receive messages', async ({ page }) => {
    // Mock AI response
    await page.route('**/api/chat', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'I understand you\'re feeling stressed about exams. Here are some strategies that might help...',
          riskLevel: 'low'
        })
      })
    })

    const messageInput = page.getByPlaceholder('Type your message...')
    const sendButton = page.getByRole('button', { name: /send/i })

    // Send a message
    await messageInput.fill('I am feeling stressed about my upcoming exams')
    await sendButton.click()

    // Check if user message appears
    await expect(page.getByText('I am feeling stressed about my upcoming exams')).toBeVisible()

    // Check if AI response appears
    await expect(page.getByText('I understand you\'re feeling stressed about exams')).toBeVisible()

    // Check if input is cleared
    await expect(messageInput).toHaveValue('')
  })

  test('should handle crisis situations', async ({ page }) => {
    // Mock crisis response
    await page.route('**/api/chat', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'I\'m very concerned about what you\'ve shared. Your safety is the top priority right now.',
          riskLevel: 'high',
          crisisResources: {
            helplines: ['91529-87821'],
            emergency: '112',
            message: 'Please contact emergency services immediately.'
          }
        })
      })
    })

    const messageInput = page.getByPlaceholder('Type your message...')
    await messageInput.fill('I want to hurt myself')
    await page.getByRole('button', { name: /send/i }).click()

    // Check if crisis alert appears
    await expect(page.getByText('Crisis Support Alert')).toBeVisible()
    await expect(page.getByText('91529-87821')).toBeVisible()
    await expect(page.getByText('112')).toBeVisible()

    // Check if emergency contact buttons are present
    await expect(page.getByRole('button', { name: /call helpline/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /emergency/i })).toBeVisible()
  })

  test('should trigger assessment modal', async ({ page }) => {
    // Click on assessment button
    await page.getByRole('button', { name: /take assessment/i }).click()

    // Check if assessment modal opens
    await expect(page.getByText('Mental Health Assessment')).toBeVisible()
    await expect(page.getByText('PHQ-9 Depression Assessment')).toBeVisible()
  })

  test('should handle typing indicators', async ({ page }) => {
    // Mock delayed response to test typing indicator
    await page.route('**/api/chat', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Thank you for sharing that with me.',
            riskLevel: 'low'
          })
        })
      }, 2000)
    })

    const messageInput = page.getByPlaceholder('Type your message...')
    await messageInput.fill('Hello')
    await page.getByRole('button', { name: /send/i }).click()

    // Check if typing indicator appears
    await expect(page.getByText('AI is typing...')).toBeVisible()

    // Wait for response and check if typing indicator disappears
    await expect(page.getByText('Thank you for sharing that with me.')).toBeVisible()
    await expect(page.getByText('AI is typing...')).not.toBeVisible()
  })

  test('should handle message history', async ({ page }) => {
    // Mock multiple responses
    let messageCount = 0
    await page.route('**/api/chat', route => {
      messageCount++
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: `Response ${messageCount}`,
          riskLevel: 'low'
        })
      })
    })

    const messageInput = page.getByPlaceholder('Type your message...')

    // Send first message
    await messageInput.fill('First message')
    await page.getByRole('button', { name: /send/i }).click()
    await expect(page.getByText('Response 1')).toBeVisible()

    // Send second message
    await messageInput.fill('Second message')
    await page.getByRole('button', { name: /send/i }).click()
    await expect(page.getByText('Response 2')).toBeVisible()

    // Check if both messages are still visible
    await expect(page.getByText('First message')).toBeVisible()
    await expect(page.getByText('Second message')).toBeVisible()
    await expect(page.getByText('Response 1')).toBeVisible()
    await expect(page.getByText('Response 2')).toBeVisible()
  })

  test('should handle API errors', async ({ page }) => {
    // Mock API error
    await page.route('**/api/chat', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      })
    })

    const messageInput = page.getByPlaceholder('Type your message...')
    await messageInput.fill('Test message')
    await page.getByRole('button', { name: /send/i }).click()

    // Check if error message appears
    await expect(page.getByText(/experiencing technical difficulties/i)).toBeVisible()
  })

  test('should support keyboard shortcuts', async ({ page }) => {
    const messageInput = page.getByPlaceholder('Type your message...')
    
    // Test Enter to send
    await messageInput.fill('Test message')
    await messageInput.press('Enter')

    // Should send the message (check if input is cleared)
    await expect(messageInput).toHaveValue('')
  })

  test('should be accessible', async ({ page }) => {
    // Check for proper ARIA labels
    await expect(page.getByRole('textbox', { name: /message input/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /send message/i })).toBeVisible()

    // Check for proper heading structure
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    // Test keyboard navigation
    await page.keyboard.press('Tab')
    await expect(page.getByPlaceholder('Type your message...')).toBeFocused()
  })

  test('should handle long messages', async ({ page }) => {
    const longMessage = 'This is a very long message that should test how the chat interface handles lengthy text input and whether it properly wraps and displays without breaking the layout. '.repeat(10)

    const messageInput = page.getByPlaceholder('Type your message...')
    await messageInput.fill(longMessage)
    await page.getByRole('button', { name: /send/i }).click()

    // Check if long message is displayed properly
    await expect(page.getByText(longMessage)).toBeVisible()
  })

  test('should handle special characters and emojis', async ({ page }) => {
    const specialMessage = 'Hello! 😊 How are you? I have some questions: 1) What is 2+2? 2) Can you help with stress? #mentalhealth @support'

    const messageInput = page.getByPlaceholder('Type your message...')
    await messageInput.fill(specialMessage)
    await page.getByRole('button', { name: /send/i }).click()

    // Check if special characters and emojis are displayed properly
    await expect(page.getByText(specialMessage)).toBeVisible()
  })

  test('should maintain scroll position', async ({ page }) => {
    // Mock multiple responses to create scrollable content
    await page.route('**/api/chat', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'This is a response message that helps create scrollable content in the chat interface.',
          riskLevel: 'low'
        })
      })
    })

    const messageInput = page.getByPlaceholder('Type your message...')

    // Send multiple messages to create scroll
    for (let i = 1; i <= 10; i++) {
      await messageInput.fill(`Message ${i}`)
      await page.getByRole('button', { name: /send/i }).click()
      await page.waitForTimeout(500) // Wait for response
    }

    // Check if chat scrolls to bottom with new messages
    const lastMessage = page.getByText('Message 10')
    await expect(lastMessage).toBeInViewport()
  })
})
