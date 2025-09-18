module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/chat',
        'http://localhost:3000/appointments',
        'http://localhost:3000/resources',
        'http://localhost:3000/community',
        'http://localhost:3000/admin'
      ],
      startServerCommand: 'npm start',
      startServerReadyPattern: 'ready on',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        preset: 'desktop',
        onlyCategories: ['accessibility', 'best-practices', 'performance', 'seo'],
        skipAudits: [
          'uses-http2',
          'redirects-http',
          'uses-long-cache-ttl',
          'efficient-animated-content'
        ]
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.8 }],
        'categories:seo': ['warn', { minScore: 0.8 }],
        
        // Performance assertions
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        
        // Accessibility assertions
        'color-contrast': 'error',
        'heading-order': 'error',
        'html-has-lang': 'error',
        'image-alt': 'error',
        'label': 'error',
        'link-name': 'error',
        'list': 'error',
        'meta-description': 'error',
        'meta-viewport': 'error',
        
        // Best practices assertions
        'is-on-https': 'off', // Disabled for local testing
        'uses-responsive-images': 'warn',
        'efficient-animated-content': 'warn',
        'no-document-write': 'error',
        'external-anchors-use-rel-noopener': 'error',
        
        // SEO assertions
        'document-title': 'error',
        'meta-description': 'error',
        'robots-txt': 'off', // Disabled for local testing
        'tap-targets': 'warn',
        'hreflang': 'off'
      }
    },
    upload: {
      target: 'temporary-public-storage'
    },
    server: {
      port: 9001,
      storage: './lighthouse-reports'
    }
  }
}
