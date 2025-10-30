# ApplySimple

A modern full-stack web application that transforms your job application tracking into an intelligent analytics dashboard with ML-powered outcome predictions.

## Overview

ApplySimple helps you track, analyze, and predict job application outcomes using:
- **Next.js 16** frontend with React 19
- **FastAPI** ML microservice for predictions
- **PostgreSQL** database with Prisma ORM
- **Chakra UI v3** for beautiful, accessible components
- **Recharts** for data visualization

## Tech Stack

### Frontend
- **Framework**: Next.js 16.0.1 (App Router, TypeScript)
- **UI Library**: Chakra UI v3.28
- **Styling**: Emotion 11.14
- **Animation**: Framer Motion 12
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts

### Backend
- **ORM**: Prisma
- **Database**: PostgreSQL 16
- **ML Service**: FastAPI (Python 3.12)
- **ML Libraries**: scikit-learn, pandas, numpy

### Environment
- **Node**: 22.21.0
- **Python**: 3.12.3
- **PostgreSQL**: 16.10
- **Platform**: WSL Ubuntu / Linux

## Project Structure

```
applysimple/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   │   ├── api/         # API routes
│   │   │   ├── layout.tsx   # Root layout
│   │   │   └── page.tsx     # Dashboard page
│   │   ├── components/      # React components
│   │   ├── lib/             # Utilities & configs
│   │   └── types/           # TypeScript types
│   └── package.json
│
├── ml_service/              # FastAPI ML microservice
│   ├── main.py             # FastAPI app
│   ├── requirements.txt    # Python dependencies
│   └── README.md
│
├── prisma/                  # Database schema
│   └── schema.prisma
│
├── .env                     # Environment variables
├── .env.example            # Example env file
└── README.md               # This file
```

## Getting Started

### Prerequisites

1. **Node.js 22+** and npm
2. **Python 3.12+**
3. **PostgreSQL 16+**

### 1. Clone and Install

```bash
git clone https://github.com/Mitchell-Hess/ApplySimple.git
cd applysimple
```

### 2. Set Up PostgreSQL

Start PostgreSQL:
```bash
sudo service postgresql start
```

Create the database:
```bash
sudo -u postgres psql -c "CREATE DATABASE applysimple;"
```

### 3. Configure Environment

Copy the example environment file:
```bash
cp .env.example .env
```

Update `.env` with your database credentials if different from defaults.

### 4. Set Up Frontend

```bash
cd frontend
npm install
```

### 5. Set Up Database

From the root directory:
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
```

### 6. Set Up ML Service

```bash
cd ml_service
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Running the Application

You'll need **three terminal windows**:

### Terminal 1: Frontend (Next.js)
```bash
cd frontend
npm run dev
```
Runs on http://localhost:3000

### Terminal 2: ML Service (FastAPI)
```bash
cd ml_service
source venv/bin/activate  # Activate virtual environment
python main.py
```
Runs on http://localhost:8000

### Terminal 3: Database (if needed)
```bash
sudo service postgresql start  # If not already running
```

## Features

### Current Features
- Dashboard with real-time application statistics
- Visual analytics with pie charts showing application status distribution
- ML-powered success predictions for each application
- Responsive design with dark mode support
- RESTful API for application management

### Database Schema

The `Application` model includes:
- Job information (company, position, location, work type)
- Application details (date applied, source, status)
- Tracking (follow-up dates, notes)
- Resume/cover letter tracking
- Recruiter contact information
- ML predictions (success probability)
- Outcome tracking (offers, rejections)

### ML Predictions

The ML service provides:
- Success probability (0-1 scale)
- Confidence score
- Factor analysis (what influences the prediction)
- Action recommendations

Current prediction factors:
- Application source (referrals have +25% boost)
- Cover letter usage (+10%)
- Work type (remote is more competitive)
- Current application status
- And more...

## API Endpoints

### Frontend API (Next.js)

- `GET /api/applications` - Fetch all applications
- `POST /api/applications` - Create new application
- `POST /api/predict` - Get ML prediction for an application

### ML Service API (FastAPI)

- `GET /` - Health check
- `GET /health` - Detailed health check
- `POST /predict` - Predict single application
- `POST /batch-predict` - Predict multiple applications

Full API documentation available at http://localhost:8000/docs when running.

## Development

### Adding New Features

1. **Frontend Components**: Add to `frontend/src/components/`
2. **API Routes**: Add to `frontend/src/app/api/`
3. **Database Models**: Update `prisma/schema.prisma` and run `npx prisma migrate dev`
4. **ML Features**: Update `ml_service/main.py`

### Testing the Build

```bash
cd frontend
npm run build
```

## Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```

### ML Service (Railway)
1. Connect Railway to your GitHub repo
2. Set up environment variables
3. Deploy from `ml_service/` directory

### Database (Railway/Supabase)
1. Create a PostgreSQL instance
2. Update `DATABASE_URL` in production environment
3. Run `npx prisma migrate deploy`

## Troubleshooting

### PostgreSQL Connection Issues
```bash
# Check if PostgreSQL is running
sudo service postgresql status

# Start PostgreSQL
sudo service postgresql start

# Check database exists
psql -U postgres -l
```

### Frontend Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### ML Service Issues
```bash
# Verify Python version
python3 --version

# Reinstall dependencies
pip install -r ml_service/requirements.txt --upgrade
```

## Next Steps

- [ ] Implement Google OAuth authentication
- [ ] Add Google Sheets sync for importing existing applications
- [ ] Train actual ML model with historical data
- [ ] Add more chart types (timeline, success rate trends)
- [ ] Implement filtering and sorting in dashboard
- [ ] Add application form with validation
- [ ] Set up automated tests
- [ ] Deploy to production

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
