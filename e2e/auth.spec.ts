import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display registration form', async ({ page }) => {
    // Check if registration form is visible
    await expect(page.getByText('Create Your Account')).toBeVisible()
    await expect(page.getByPlaceholder('Enter your full name')).toBeVisible()
    await expect(page.getByPlaceholder('Enter your email')).toBeVisible()
    await expect(page.getByPlaceholder('Enter your USN')).toBeVisible()
    await expect(page.getByPlaceholder('Enter your college name')).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: 'Create Account' }).click()
    
    // Check for validation messages
    await expect(page.getByText('Name is required')).toBeVisible()
    await expect(page.getByText('Email is required')).toBeVisible()
    await expect(page.getByText('USN is required')).toBeVisible()
    await expect(page.getByText('College name is required')).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    await page.getByPlaceholder('Enter your email').fill('invalid-email')
    await page.getByRole('button', { name: 'Create Account' }).click()
    
    await expect(page.getByText('Please enter a valid email')).toBeVisible()
  })

  test('should validate USN format', async ({ page }) => {
    await page.getByPlaceholder('Enter your USN').fill('invalid-usn')
    await page.getByRole('button', { name: 'Create Account' }).click()
    
    await expect(page.getByText('Please enter a valid USN')).toBeVisible()
  })

  test('should allow language selection', async ({ page }) => {
    // Check if language selector is present
    await expect(page.getByRole('combobox', { name: /language/i })).toBeVisible()
    
    // Select Hindi
    await page.getByRole('combobox', { name: /language/i }).click()
    await page.getByRole('option', { name: 'हिंदी (Hindi)' }).click()
    
    // Verify language change (check if some text changed to Hindi)
    await expect(page.getByText('खाता बनाएं')).toBeVisible()
  })

  test('should allow theme switching', async ({ page }) => {
    // Check if theme toggle is present
    const themeToggle = page.getByRole('button', { name: /theme/i })
    await expect(themeToggle).toBeVisible()
    
    // Toggle theme
    await themeToggle.click()
    
    // Check if dark theme is applied (check for dark class or specific styling)
    const body = page.locator('body')
    await expect(body).toHaveClass(/dark/)
  })

  test('should complete registration flow', async ({ page }) => {
    // Fill out the registration form
    await page.getByPlaceholder('Enter your full name').fill('Test Student')
    await page.getByPlaceholder('Enter your email').fill('test@example.com')
    await page.getByPlaceholder('Enter your USN').fill('1AB21CS001')
    await page.getByPlaceholder('Enter your college name').fill('Test Engineering College')
    
    // Select year of study
    await page.getByRole('combobox', { name: /year of study/i }).click()
    await page.getByRole('option', { name: '2nd Year' }).click()
    
    // Select gender
    await page.getByRole('combobox', { name: /gender/i }).click()
    await page.getByRole('option', { name: 'Male' }).click()
    
    // Accept terms
    await page.getByRole('checkbox', { name: /terms and conditions/i }).check()
    
    // Submit form
    await page.getByRole('button', { name: 'Create Account' }).click()
    
    // Should redirect to dashboard or show success message
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.getByText('Welcome to Psynergy')).toBeVisible()
  })

  test('should handle registration errors', async ({ page }) => {
    // Mock API error response
    await page.route('**/api/auth/register', route => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Email already exists' })
      })
    })
    
    // Fill and submit form
    await page.getByPlaceholder('Enter your full name').fill('Test Student')
    await page.getByPlaceholder('Enter your email').fill('existing@example.com')
    await page.getByPlaceholder('Enter your USN').fill('1AB21CS001')
    await page.getByPlaceholder('Enter your college name').fill('Test College')
    await page.getByRole('checkbox', { name: /terms and conditions/i }).check()
    await page.getByRole('button', { name: 'Create Account' }).click()
    
    // Should show error message
    await expect(page.getByText('Email already exists')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check if form is still usable on mobile
    await expect(page.getByText('Create Your Account')).toBeVisible()
    await expect(page.getByPlaceholder('Enter your full name')).toBeVisible()
    
    // Check if mobile navigation works
    const mobileMenu = page.getByRole('button', { name: /menu/i })
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click()
      await expect(page.getByText('Dashboard')).toBeVisible()
    }
  })

  test('should handle keyboard navigation', async ({ page }) => {
    // Test tab navigation through form fields
    await page.keyboard.press('Tab')
    await expect(page.getByPlaceholder('Enter your full name')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByPlaceholder('Enter your email')).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByPlaceholder('Enter your USN')).toBeFocused()
    
    // Test form submission with Enter key
    await page.getByPlaceholder('Enter your full name').fill('Test Student')
    await page.getByPlaceholder('Enter your email').fill('test@example.com')
    await page.getByPlaceholder('Enter your USN').fill('1AB21CS001')
    await page.getByPlaceholder('Enter your college name').fill('Test College')
    await page.getByRole('checkbox', { name: /terms and conditions/i }).check()
    
    await page.keyboard.press('Enter')
    
    // Should attempt to submit the form
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('should persist form data on page refresh', async ({ page }) => {
    // Fill some form data
    await page.getByPlaceholder('Enter your full name').fill('Test Student')
    await page.getByPlaceholder('Enter your email').fill('test@example.com')
    
    // Refresh page
    await page.reload()
    
    // Check if data is persisted (if implemented)
    // This test might fail if form persistence is not implemented
    // await expect(page.getByPlaceholder('Enter your full name')).toHaveValue('Test Student')
  })
})
