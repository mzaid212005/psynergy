# Deployment Guide

This comprehensive guide covers deploying Psynergy to production environments with security, scalability, and reliability considerations.

## 🏗️ Architecture Overview

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   Web Server    │    │    Database     │
│    (Nginx)      │────│   (Next.js)     │────│  (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │   File Storage  │              │
         └──────────────│   (S3/CDN)      │──────────────┘
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │   Monitoring    │
                        │   & Logging     │
                        └─────────────────┘
```

### Technology Stack
- **Frontend**: Next.js 14 with App Router
- **Database**: PostgreSQL with Supabase
- **File Storage**: AWS S3 or Supabase Storage
- **CDN**: CloudFront or Vercel Edge Network
- **Monitoring**: Vercel Analytics, Sentry
- **CI/CD**: GitHub Actions

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the easiest deployment with automatic scaling and edge optimization.

#### Prerequisites
- Vercel account
- GitHub repository
- Environment variables configured

#### Deployment Steps

1. **Connect Repository**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Configure Environment Variables**
   ```bash
   # In Vercel Dashboard > Settings > Environment Variables
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   ```

3. **Custom Domain Setup**
   - Add custom domain in Vercel dashboard
   - Configure DNS records
   - Enable automatic HTTPS

4. **Performance Optimization**
   - Enable Edge Functions
   - Configure caching headers
   - Set up analytics and monitoring

#### Vercel Configuration

Create `vercel.json`:
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### Option 2: Docker Deployment

For self-hosted or cloud provider deployment using Docker.

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set permissions
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=psynergy
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

#### Deployment Commands

```bash
# Build and deploy
docker-compose up -d --build

# View logs
docker-compose logs -f app

# Scale application
docker-compose up -d --scale app=3

# Update deployment
docker-compose pull
docker-compose up -d
```

### Option 3: AWS Deployment

For enterprise-grade deployment with full control and scalability.

#### AWS Services Used
- **EC2**: Application servers
- **RDS**: PostgreSQL database
- **S3**: File storage
- **CloudFront**: CDN
- **ALB**: Load balancer
- **Route 53**: DNS management
- **CloudWatch**: Monitoring

#### Infrastructure as Code (Terraform)

```hcl
# main.tf
provider "aws" {
  region = var.aws_region
}

# VPC and Networking
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "psynergy-vpc"
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "psynergy-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets           = aws_subnet.public[*].id

  enable_deletion_protection = false
}

# RDS PostgreSQL
resource "aws_db_instance" "main" {
  identifier     = "psynergy-db"
  engine         = "postgres"
  engine_version = "15.4"
  instance_class = "db.t3.micro"
  
  allocated_storage     = 20
  max_allocated_storage = 100
  storage_encrypted     = true
  
  db_name  = "psynergy"
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "sun:04:00-sun:05:00"
  
  skip_final_snapshot = true
}

# S3 Bucket for file storage
resource "aws_s3_bucket" "main" {
  bucket = "psynergy-storage-${random_string.bucket_suffix.result}"
}

resource "aws_s3_bucket_versioning" "main" {
  bucket = aws_s3_bucket.main.id
  versioning_configuration {
    status = "Enabled"
  }
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "main" {
  origin {
    domain_name = aws_lb.main.dns_name
    origin_id   = "psynergy-alb"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "psynergy-alb"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true
      headers      = ["Host", "Authorization"]
      cookies {
        forward = "all"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}
```

## 🔧 Environment Configuration

### Production Environment Variables

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/database
POSTGRES_PRISMA_URL=postgresql://user:password@host:5432/database?pgbouncer=true

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=https://your-domain.com

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Monitoring
SENTRY_DSN=your-sentry-dsn
VERCEL_ANALYTICS_ID=your-analytics-id

# Crisis Support
CRISIS_HELPLINE=91529-87821
EMERGENCY_NUMBER=112
```

### Security Configuration

#### SSL/TLS Setup

```nginx
# nginx.conf
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Firewall Configuration

```bash
# UFW (Ubuntu Firewall)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# AWS Security Groups
# Web tier: Allow 80, 443 from 0.0.0.0/0
# App tier: Allow 3000 from web tier security group
# DB tier: Allow 5432 from app tier security group
```

## 📊 Monitoring and Logging

### Application Monitoring

#### Sentry Integration

```typescript
// sentry.client.config.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})
```

#### Health Check Endpoint

```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check database connection
    // Check external services
    // Check system resources
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
      uptime: process.uptime(),
    })
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 503 }
    )
  }
}
```

### Log Management

#### Structured Logging

```typescript
// lib/logger.ts
import winston from 'winston'

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'psynergy' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
})

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }))
}

export default logger
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test:ci
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🚨 Disaster Recovery

### Backup Strategy

1. **Database Backups**
   - Automated daily backups
   - Point-in-time recovery
   - Cross-region replication

2. **File Storage Backups**
   - S3 versioning enabled
   - Cross-region replication
   - Lifecycle policies

3. **Application Backups**
   - Git repository backups
   - Environment configuration backups
   - Deployment artifact storage

### Recovery Procedures

1. **Database Recovery**
   ```bash
   # Restore from backup
   pg_restore -h hostname -U username -d database backup_file.sql
   ```

2. **Application Recovery**
   ```bash
   # Redeploy from last known good state
   vercel --prod --force
   ```

3. **Full System Recovery**
   - Provision new infrastructure
   - Restore database from backup
   - Deploy application
   - Update DNS records
   - Verify functionality

## 📋 Post-Deployment Checklist

### Immediate Verification
- [ ] Application loads successfully
- [ ] Database connections working
- [ ] Authentication functioning
- [ ] API endpoints responding
- [ ] SSL certificate valid
- [ ] Monitoring alerts configured

### Performance Testing
- [ ] Load testing completed
- [ ] Core Web Vitals optimized
- [ ] CDN caching configured
- [ ] Database queries optimized
- [ ] Error rates within acceptable limits

### Security Verification
- [ ] Security headers configured
- [ ] HTTPS enforced
- [ ] Input validation working
- [ ] Rate limiting enabled
- [ ] Vulnerability scan completed

### Monitoring Setup
- [ ] Application monitoring active
- [ ] Error tracking configured
- [ ] Performance monitoring enabled
- [ ] Uptime monitoring configured
- [ ] Alert notifications working

Remember: Always test deployments in a staging environment before deploying to production. Maintain comprehensive backups and have a rollback plan ready.
