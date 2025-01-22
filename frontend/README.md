# Market Intelligence Dashboard

A Next.js application for tracking market trends, competitors, and generating AI-powered insights.

## Features

- 🏢 Competitor Analysis
- 📈 Market Trends
- 🤖 AI-Powered Insights
- 📊 Lead Impact Analysis

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in your values
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API key for insights generation

## Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Prisma
- PostgreSQL
- OpenAI
- Tailwind CSS

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request 