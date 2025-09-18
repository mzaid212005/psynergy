# Quick Deployment Guide

This guide provides quick deployment instructions for getting Psynergy running in production.

## 🚀 Quick Start Options

### Option 1: Vercel (Recommended - Easiest)

1. **Fork the repository** to your GitHub account

2. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

3. **Set environment variables** in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXTAUTH_SECRET`

4. **Configure custom domain** (optional) in Vercel dashboard

### Option 2: Docker (Self-hosted)

1. **Clone and configure**:
   ```bash
   git clone https://github.com/your-org/psynergy.git
   cd psynergy
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

2. **Deploy with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

3. **Access the application** at `http://localhost:3000`

### Option 3: Manual Deployment

1. **Build the application**:
   ```bash
   npm install
   npm run build
   npm start
   ```

2. **Set up reverse proxy** (nginx/Apache)

3. **Configure SSL certificate**

## 🔧 Environment Variables

### Required Variables
```env
OPENAI_API_KEY=your_openai_api_key
NEXTAUTH_SECRET=your_32_character_secret
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Optional Variables
```env
CRISIS_HELPLINE=91529-87821
EMERGENCY_NUMBER=112
SENTRY_DSN=your_sentry_dsn
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 📊 Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] Database connections working
- [ ] Authentication functioning
- [ ] AI chat responding
- [ ] Email notifications working (if configured)
- [ ] SSL certificate valid
- [ ] Monitoring configured

## 🆘 Support

For deployment issues:
- Check the [full deployment guide](docs/deployment.md)
- Review [troubleshooting guide](docs/troubleshooting.md)
- Contact support: support@psynergy.edu

## 🔒 Security Notes

- Always use HTTPS in production
- Keep environment variables secure
- Regularly update dependencies
- Monitor for security vulnerabilities
- Implement proper backup procedures

## 📈 Scaling

For high-traffic deployments:
- Use CDN for static assets
- Implement database read replicas
- Set up load balancing
- Configure auto-scaling
- Monitor performance metrics

See the [full deployment guide](docs/deployment.md) for detailed instructions.
