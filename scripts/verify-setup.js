#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const requiredFiles = [
  'package.json',
  'next.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/auth/register/page.tsx',
  'src/app/auth/login/page.tsx',
  'src/app/dashboard/page.tsx',
  'src/components/ui/theme-toggle.tsx',
  'src/components/forms/registration-form.tsx',
  'src/lib/utils.ts',
  'src/types/index.ts',
  'src/data/colleges.ts',
  'src/data/languages.ts',
]

const requiredDirectories = [
  'src/app',
  'src/components',
  'src/lib',
  'src/types',
  'src/data',
  'src/components/ui',
  'src/components/forms',
  'src/app/auth',
  'src/app/dashboard',
]

console.log('🔍 Verifying Psynergy project setup...\n')

// Check directories
console.log('📁 Checking directories:')
let missingDirs = 0
requiredDirectories.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}`)
  } else {
    console.log(`❌ ${dir} - MISSING`)
    missingDirs++
  }
})

console.log('')

// Check files
console.log('📄 Checking required files:')
let missingFiles = 0
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`)
  } else {
    console.log(`❌ ${file} - MISSING`)
    missingFiles++
  }
})

console.log('')

// Check package.json dependencies
console.log('📦 Checking key dependencies:')
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
  const requiredDeps = [
    'next',
    'react',
    'react-dom',
    'typescript',
    'tailwindcss',
    '@types/react',
    'framer-motion',
    'react-hook-form',
    'zod',
    'next-themes'
  ]
  
  const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies }
  
  requiredDeps.forEach(dep => {
    if (allDeps[dep]) {
      console.log(`✅ ${dep} (${allDeps[dep]})`)
    } else {
      console.log(`❌ ${dep} - MISSING`)
      missingFiles++
    }
  })
} catch (error) {
  console.log('❌ Error reading package.json')
  missingFiles++
}

console.log('')

// Summary
if (missingDirs === 0 && missingFiles === 0) {
  console.log('🎉 All checks passed! Your Psynergy project is properly set up.')
  console.log('')
  console.log('Next steps:')
  console.log('1. Install dependencies: npm install')
  console.log('2. Set up environment variables: cp .env.local.example .env.local')
  console.log('3. Configure Supabase and OpenAI API keys')
  console.log('4. Run the development server: npm run dev')
  console.log('')
  console.log('🌟 Happy coding!')
} else {
  console.log(`❌ Setup incomplete. Missing ${missingDirs} directories and ${missingFiles} files.`)
  console.log('')
  console.log('Please ensure all required files and directories are present.')
  process.exit(1)
}
