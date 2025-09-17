# Psynergy - Digital Psychological Intervention System

A comprehensive mental health platform designed specifically for Indian college students, providing AI-guided support, counseling services, educational resources, and peer community features.

## 🌟 Features

### Core Functionality
- **AI-Guided Psychological First Aid**: Interactive chatbot with screening tools (PHQ-9, GAD-7, GHQ)
- **Confidential Counseling**: Secure appointment booking with verified professionals
- **Resource Hub**: Multilingual educational content and wellness guides
- **Peer Support**: Moderated community forums and support groups
- **Admin Dashboard**: Analytics and trend detection for college authorities

### Technical Features
- **Multi-language Support**: 13+ Indian regional languages
- **Dark/Light Theme**: Accessible design with smooth transitions
- **Responsive Design**: Mobile-first approach with PWA capabilities
- **Real-time Chat**: WebSocket-based AI counselor integration
- **Secure Authentication**: College-specific registration with USN validation
- **Privacy-First**: Anonymous options and encrypted data storage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for database and auth)
- OpenAI API key (for AI chatbot)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/psynergy.git
   cd psynergy
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Registration System

The registration system includes comprehensive validation and multi-step form:

### Required Fields
- **Full Name**: Student's complete name
- **College Name**: Searchable dropdown with 30+ Indian colleges
- **USN**: University Seat Number with format validation (e.g., 1RV21CS099)
- **Year of Study**: Academic year selection
- **Email**: Validated email address
- **Preferred Language**: Choice from 13+ regional languages
- **Password**: Strong password with strength indicator

### Optional Fields
- **Phone Number**: Indian mobile number validation
- **Gender**: Inclusive options including non-binary
- **Pronouns**: Respectful pronoun selection

### Features
- **Real-time Validation**: Instant feedback on USN, email, and phone formats
- **College Search**: Auto-complete with 30+ pre-loaded Indian colleges
- **Password Strength**: Visual indicator with security recommendations
- **Multi-step Form**: Progressive disclosure for better UX
- **Theme Toggle**: Dark/light mode with smooth animations
- **Accessibility**: WCAG 2.1 AA compliant design

## 🎨 Design System

### Color Palette
- **Light Theme**: Soft blues, greens, and whites for calming effect
- **Dark Theme**: Deep blues and grays with high contrast
- **Wellness Colors**: Therapeutic greens, calming blues, warm oranges

### Typography
- **Primary**: Inter (clean, readable)
- **Display**: Poppins (friendly, approachable)

### Animations
- **Micro-interactions**: Smooth hover states and transitions
- **Loading States**: Gentle pulse and fade animations
- **Form Validation**: Slide-in error messages
- **Theme Switching**: Seamless color transitions

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: Headless UI, Heroicons, Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: OpenAI GPT-4
- **Deployment**: Vercel (recommended)

### Project Structure
```
src/
├── app/                 # Next.js app router
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # User dashboard
│   ├── resources/      # Educational content
│   ├── support/        # Counseling and chat
│   └── admin/          # Admin panel
├── components/         # Reusable components
│   ├── ui/            # Base UI components
│   ├── forms/         # Form components
│   ├── layout/        # Layout components
│   └── features/      # Feature-specific components
├── lib/               # Utilities and configurations
├── types/             # TypeScript type definitions
├── hooks/             # Custom React hooks
├── utils/             # Helper functions
└── data/              # Static data (colleges, languages)
```

## 🔒 Security & Privacy

- **Data Encryption**: All sensitive data encrypted at rest and in transit
- **Anonymous Options**: Users can access support without revealing identity
- **GDPR Compliance**: Right to data deletion and export
- **Secure Authentication**: Multi-factor authentication support
- **Privacy by Design**: Minimal data collection with explicit consent

## 🌍 Internationalization

### Supported Languages
- English, Hindi, Kannada, Tamil, Telugu, Malayalam
- Marathi, Gujarati, Bengali, Punjabi, Odia, Assamese, Urdu

### Implementation
- Dynamic language switching
- RTL support for Urdu
- Culturally appropriate content
- Regional mental health resources

## 📊 Analytics & Monitoring

### For Students
- Personal wellness tracking
- Progress visualization
- Goal setting and achievements

### For Colleges
- Anonymous aggregate analytics
- Trend identification
- Resource utilization metrics
- Early warning systems

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test              # Run all tests
npm run test:watch        # Watch mode for development
npm run test:coverage     # Generate coverage report
npm run test:ci           # CI-optimized test run

# End-to-end tests
npm run test:e2e          # Run E2E tests
npm run test:e2e:ui       # Interactive test runner
npm run test:e2e:headed   # Run with browser UI
npm run test:e2e:debug    # Debug mode with breakpoints

# Quality checks
npm run lint              # Code linting
npm run type-check        # TypeScript validation
npm run format:check      # Format validation
npm run audit:security    # Security vulnerability scan
```

### Test Coverage
- **Unit Tests**: 70%+ coverage across all components and utilities
- **E2E Tests**: Complete user journey validation
- **Accessibility**: WCAG 2.1 AA compliance testing
- **Performance**: Lighthouse audits with 80%+ scores

## 🚀 Deployment

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel** (Recommended)
   ```bash
   npm install -g vercel
   vercel --prod
   ```

3. **Docker Deployment**
   ```bash
   docker build -t psynergy .
   docker run -p 3000:3000 psynergy
   ```

### Environment Setup
- **Development**: Local development with hot reload
- **Staging**: Pre-production testing environment
- **Production**: Live deployment with monitoring

## 📖 Documentation

### User Guides
- [Student User Guide](docs/user-guide.md) - Complete guide for students
- [Admin Guide](docs/admin-guide.md) - Administrative dashboard usage
- [Counselor Guide](docs/counselor-guide.md) - Counselor platform features

### Technical Documentation
- [API Documentation](docs/api.md) - REST API endpoints and usage
- [Component Library](docs/components.md) - UI component documentation
- [Deployment Guide](docs/deployment.md) - Production deployment instructions
- [Contributing Guide](docs/contributing.md) - Development contribution guidelines

### Setup Guides
- [College Setup Guide](docs/college-setup.md) - Institution onboarding
- [Counselor Onboarding](docs/counselor-onboarding.md) - Professional setup
- [System Administration](docs/system-admin.md) - Technical administration

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](docs/contributing.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### For Users
- **Crisis Hotline**: 91529-87821 (24/7)
- **Email Support**: support@psynergy.in
- **Documentation**: [docs.psynergy.in](https://docs.psynergy.in)

### For Developers
- **GitHub Issues**: Report bugs and request features
- **Discord**: Join our developer community
- **Email**: dev@psynergy.in

## 🙏 Acknowledgments

- Mental health professionals who provided guidance
- College counseling centers for feedback
- Open source community for amazing tools
- Students who participated in user testing

---

**Made with ❤️ for the mental health and wellbeing of Indian college students**
"# off" 
#   o f f - b y - o n e - e r r o r  
 