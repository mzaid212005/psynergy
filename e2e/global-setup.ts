import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup...')
  
  // Launch browser for setup
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  try {
    // Wait for the development server to be ready
    console.log('⏳ Waiting for development server...')
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
    console.log('✅ Development server is ready')
    
    // Perform any global setup tasks here
    // For example, seed test data, authenticate test users, etc.
    
    // Check if the app loads correctly
    await page.waitForSelector('body', { timeout: 10000 })
    console.log('✅ Application loaded successfully')
    
    // You can add more setup tasks here:
    // - Create test users
    // - Seed database with test data
    // - Set up test environment variables
    // - Clear any existing test data
    
  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }
  
  console.log('✅ Global setup completed')
}

export default globalSetup
