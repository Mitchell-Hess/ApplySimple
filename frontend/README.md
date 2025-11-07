# ApplySimple

A modern job application tracking platform with AI-powered insights to help you manage and optimize your job search.

## Features

- **Application Tracking**: Track all your job applications in one place with detailed status updates
- **AI-Powered Predictions**: Get success probability predictions for each application based on historical data
- **Smart Analytics**: Visualize your application trends, response rates, and success patterns
- **Dark Mode Support**: Beautiful light and dark themes for comfortable viewing
- **Secure Authentication**: Email/password authentication with password reset functionality
- **Data Import**: Bulk import applications from spreadsheets
- **Real-time Insights**: ML-powered recommendations to improve your application strategy

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **UI**: Chakra UI v3 with custom theming
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **ML Predictions**: Built-in TypeScript prediction engine
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Mitchell-Hess/ApplySimple.git
cd ApplySimple/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the frontend directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/applysimple"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Production URL
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Management

View and manage your database with Prisma Studio:
```bash
npx prisma studio
```

## Deployment

The application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── api/          # API routes
│   │   ├── auth/         # Authentication pages
│   │   └── page.tsx      # Main dashboard
│   ├── components/       # React components
│   ├── lib/              # Utilities and configurations
│   └── types/            # TypeScript type definitions
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## Features in Detail

### ML Predictions

The application uses a TypeScript-based prediction engine to analyze your applications and provide insights on:
- Success probability based on application source (referrals, LinkedIn, etc.)
- Impact of cover letters and customization
- Work type competitiveness (remote vs on-site)
- Interview readiness based on current status

### Data Import

Import your existing application data via spreadsheet upload. Supported fields:
- Company name
- Position title
- Location
- Work type (Remote/Hybrid/On-site)
- Application source
- Status
- Dates and notes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and not currently licensed for public use.
