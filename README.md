# ApplySimple

A modern full-stack job application tracker with AI-powered insights to help optimize your job search strategy.

[![Vercel](https://img.shields.io/badge/deployed%20on-Vercel-black?logo=vercel)](https://applysimpleapp.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)

## Features

- **Smart Analytics** - Visual dashboards with pie charts, ML insights, and success metrics
- **AI Predictions** - ML-powered success probability predictions for each application
- **Secure Auth** - Email/password authentication with password reset via Resend
- **CSV Import** - Bulk import applications from spreadsheets
- **Dark Mode** - Beautiful light and dark themes
- **Responsive** - Mobile-friendly design with Chakra UI v3
- **Email Integration** - Professional password reset emails with custom domain support

## Tech Stack

### Frontend
- **Framework**: Next.js 15.1 (App Router, React 19, TypeScript 5)
- **UI Library**: Chakra UI v3.28 with Emotion styling
- **Data Viz**: Recharts for charts and analytics
- **Forms**: React Hook Form + Zod validation
- **State**: TanStack Query (React Query) for data fetching
- **Animation**: Framer Motion

### Backend
- **Database**: PostgreSQL 16 with Prisma ORM
- **Auth**: NextAuth.js v5 (beta) with credentials provider
- **Email**: Resend for transactional emails
- **Deployment**: Vercel (frontend) + Neon (database)
- **CI/CD**: GitHub Actions for testing and Docker builds

### ML Service
- **Framework**: FastAPI (Python 3.12)
- **ML Libraries**: scikit-learn, pandas, numpy
- **Deployment**: Railway (optional)

## Project Structure

```
applysimple/
├── frontend/                    # Next.js application
│   ├── src/
│   │   ├── app/                # App router
│   │   │   ├── api/            # API routes
│   │   │   │   ├── applications/
│   │   │   │   ├── auth/       # Auth endpoints (signup, signin, password reset)
│   │   │   │   ├── predict/    # ML predictions
│   │   │   │   └── stats/      # Analytics
│   │   │   ├── auth/           # Auth pages (signin, signup, reset-password)
│   │   │   ├── page.tsx        # Main dashboard
│   │   │   └── layout.tsx      # Root layout
│   │   ├── components/         # React components
│   │   │   ├── ApplicationCard.tsx
│   │   │   ├── ImportCSV.tsx
│   │   │   ├── MLInsights.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── StatusChart.tsx
│   │   ├── lib/                # Utilities
│   │   │   ├── auth.ts         # NextAuth config
│   │   │   ├── color-mode.tsx  # Dark mode
│   │   │   └── prisma.ts       # Prisma client
│   │   └── types/              # TypeScript types
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── migrations/         # Migration history
│   ├── Dockerfile              # Production Docker image
│   └── package.json
│
├── ml_service/                 # FastAPI ML service
│   ├── main.py                 # Prediction API
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md
│
├── .github/
│   └── workflows/
│       ├── ci-cd.yml           # CI/CD pipeline
│       └── docker-publish.yml  # Docker image publishing
│
└── README.md                   # This file
```

## Quick Start

### Prerequisites

- Node.js 22+
- PostgreSQL 16+ (or use Neon/Supabase for cloud)
- Python 3.12+ (for ML service)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/Mitchell-Hess/ApplySimple.git
cd ApplySimple
```

2. **Set up PostgreSQL**
```bash
# Start PostgreSQL
sudo service postgresql start

# Create database
sudo -u postgres psql -c "CREATE DATABASE applysimple;"
```

3. **Configure environment variables**

Create `frontend/.env`:
```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/applysimple"

# Auth (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Email (optional for local dev)
RESEND_API_KEY="re_..."
EMAIL_FROM="ApplySimple <noreply@yourdomain.com>"
```

4. **Install and run frontend**
```bash
cd frontend
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Frontend runs on http://localhost:3000

5. **Set up ML service (optional)**
```bash
cd ml_service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
```

ML service runs on http://localhost:8000

## Database Schema

### User
- Email/password authentication
- Secure password hashing with bcrypt
- Password reset token management

### Application
- Company, position, location, work type
- Application source (LinkedIn, referral, company website, etc.)
- Status tracking (Applied, Screening, Interview, Offer, Rejected, Withdrawn)
- Dates (applied, outcome)
- Notes and metadata
- ML prediction scores

### PasswordResetToken
- Secure token generation
- 1-hour expiration
- One-time use enforcement

## Features in Detail

### Application Tracking
Track all your job applications in one centralized dashboard with comprehensive details:
- Company name, position title, location, and work type
- Application source tracking (LinkedIn, referral, company website, etc.)
- Status updates (Applied, Screening, Interview, Offer, Rejected, Withdrawn)
- Application and outcome dates
- Custom notes and follow-up reminders
- Resume and cover letter version tracking
- Recruiter contact information

### Analytics Dashboard
Visualize your job search progress with interactive charts and metrics:
- Real-time application statistics
- Status distribution pie charts with dynamic colors
- Success rate tracking
- Application source effectiveness analysis
- Custom status support from CSV imports

### ML-Powered Predictions
Get intelligent insights for each application with the prediction engine:
- Success probability scores (0-1 scale) based on multiple factors
- Confidence scores indicating prediction reliability
- Factor analysis explaining what influences each prediction
- Actionable recommendations to improve application success

Prediction factors include:
- Application source (referrals receive +25% boost)
- Cover letter usage (+10% boost)
- Work type competitiveness (remote positions are more competitive)
- Current application status
- Application age and follow-up patterns

### CSV Import
Bulk import your existing application data from spreadsheets:
- Drag-and-drop CSV file upload
- Automatic field mapping
- Support for custom status values
- Validation and error reporting
- Preserves all application metadata

### Authentication & Security
Secure user authentication with comprehensive features:
- Email/password registration and login
- Bcrypt password hashing
- Password reset via email (powered by Resend)
- Secure session management with NextAuth.js
- Protected routes with middleware
- One-time use reset tokens with 1-hour expiration

### Dark Mode
Beautiful themes for comfortable viewing in any environment:
- System-aware color mode detection
- Manual theme toggle
- Persistent preference storage
- SSR-safe hydration to prevent flashing
- Comprehensive theme coverage across all components

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/signout` - Sign out current user
- `POST /api/auth/forgot-password` - Request password reset email
- `POST /api/auth/reset-password` - Reset password with token

### Applications
- `GET /api/applications` - Fetch all applications for current user
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `DELETE /api/applications/:id` - Delete application

### Analytics
- `GET /api/stats` - Get application statistics and metrics

### ML Predictions
- `POST /api/predict` - Get ML prediction for an application

### ML Service API (FastAPI - Optional)
- `GET /` - Health check
- `GET /health` - Detailed health check with version info
- `POST /predict` - Predict single application success probability
- `POST /batch-predict` - Predict multiple applications at once

Full ML service API documentation available at http://localhost:8000/docs when running.

## Development

### Development Workflow

1. **Start the development server**:
```bash
cd frontend
npm run dev
```

2. **Run database migrations** (after schema changes):
```bash
npx prisma migrate dev --name your_migration_name
npx prisma generate
```

3. **View database with Prisma Studio**:
```bash
npx prisma studio
```

4. **Lint code**:
```bash
npm run lint
```

5. **Build for production**:
```bash
npm run build
```

### Adding New Features

1. **Frontend Components**: Add React components to `frontend/src/components/`
2. **API Routes**: Add API endpoints to `frontend/src/app/api/`
3. **Pages**: Add new pages to `frontend/src/app/`
4. **Database Models**: Update `frontend/prisma/schema.prisma` and run `npx prisma migrate dev`
5. **ML Features**: Update prediction logic in `ml_service/main.py`

### CI/CD Pipeline

The project uses GitHub Actions for continuous integration:

**On Push/Pull Request**:
- Lints frontend code
- Builds Next.js application
- Tests Python ML service
- Validates database migrations
- Builds Docker images

**On Push to Main**:
- Vercel automatically deploys the frontend
- All CI checks must pass

View workflow files in [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml)

## Deployment

### Production Stack
- **Frontend**: Vercel
- **Database**: Neon PostgreSQL
- **Email**: Resend with custom domain
- **ML Service**: Railway (optional)

### Vercel Deployment

The frontend is deployed on Vercel with automatic Git integration:

1. **Initial Setup**:
   - Connect your GitHub repository to Vercel
   - Set root directory to `frontend`
   - Framework preset: Next.js

2. **Environment Variables** (set in Vercel dashboard):
   ```env
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   NEXTAUTH_SECRET=your-generated-secret
   NEXTAUTH_URL=https://your-app.vercel.app
   RESEND_API_KEY=re_your_api_key
   EMAIL_FROM=ApplySimple <noreply@yourdomain.com>
   ```

3. **Generate NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
   ```

4. **Database Setup**:
   - Create a Neon PostgreSQL database at https://neon.tech
   - Copy the connection string to `DATABASE_URL`
   - Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

5. **Email Configuration**:
   - Sign up for Resend at https://resend.com
   - Verify your domain by adding DNS records
   - Create an API key and add to `RESEND_API_KEY`

6. **Deploy**:
   - Push to main branch
   - Vercel automatically builds and deploys
   - Monitor deployment at https://vercel.com/dashboard

### Docker Deployment (Alternative)

Build and run with Docker:

```bash
# Build frontend
docker build -t applysimple-frontend ./frontend

# Run frontend
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_SECRET="..." \
  applysimple-frontend

# Build ML service
docker build -t applysimple-ml ./ml_service

# Run ML service
docker run -p 8000:8000 applysimple-ml
```

### ML Service Deployment (Optional)

Deploy to Railway:
1. Connect Railway to your GitHub repository
2. Create a new project from `ml_service/` directory
3. Railway auto-detects Python and uses the Dockerfile
4. No environment variables needed for ML service
5. Note the deployment URL and update frontend if needed

## Troubleshooting

### Local Development Issues

**PostgreSQL Connection Failed**
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Start PostgreSQL if not running
sudo service postgresql start

# Verify database exists
psql -U postgres -l

# Recreate database if needed
sudo -u postgres psql -c "CREATE DATABASE applysimple;"
```

**Port 3000 Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

**Prisma Client Not Generated**
```bash
# Regenerate Prisma client
cd frontend
npx prisma generate
```

**Build Fails**
```bash
# Clear Next.js cache
rm -rf frontend/.next

# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Production Issues

**Authentication Not Working on Vercel**
- Verify `NEXTAUTH_SECRET` is set in Vercel environment variables
- Ensure `NEXTAUTH_URL` matches your exact Vercel deployment URL
- Redeploy after changing environment variables

**Database Connection Failed on Vercel**
- Check Neon database is active (not in sleep mode)
- Verify `DATABASE_URL` includes `?sslmode=require`
- Ensure connection string in Vercel matches Neon dashboard
- Check Neon database IP allowlist if enabled

**Password Reset Emails Not Sending**
- Verify `RESEND_API_KEY` is set correctly
- Check domain is verified in Resend dashboard
- Ensure `EMAIL_FROM` matches verified domain
- Check Resend logs for delivery status

**GitHub Actions Failing**
- Ensure all tests pass locally first
- Check Node.js version matches workflow (v22)
- Verify Prisma migrations are committed to git

## Roadmap

### Completed Features
- Email/password authentication with NextAuth.js
- Password reset via email with Resend
- Application CRUD operations
- CSV import for bulk data
- Status tracking and analytics dashboard
- ML-powered success predictions
- Dark mode with SSR-safe hydration
- Responsive design with Chakra UI v3
- Production deployment on Vercel
- CI/CD pipeline with GitHub Actions
- Docker support for containerized deployment

### Planned Features
- Google OAuth authentication
- Application filtering and sorting
- Advanced search functionality
- Timeline view for application history
- Success rate trend charts over time
- Email notifications for follow-ups
- Google Sheets sync for real-time import
- Mobile app (React Native)
- Train ML model with actual user data
- Application templates and presets
- Browser extension for quick job capture
- Interview preparation resources
- Salary negotiation tracker
- Automated job board scraping

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is for personal use.

## Contact

Mitchell Hess - GitHub: [@Mitchell-Hess](https://github.com/Mitchell-Hess)

Project Link: [https://github.com/Mitchell-Hess/ApplySimple](https://github.com/Mitchell-Hess/ApplySimple)
