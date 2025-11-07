import { NextRequest, NextResponse } from 'next/server';

interface ApplicationData {
  company: string;
  position: string;
  location?: string;
  workType?: 'Remote' | 'Hybrid' | 'On-site';
  source: string;
  status: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn';
  dateApplied: string;
  resumeVersion?: string;
  coverLetterUsed: boolean;
  hasReferral?: boolean;
}

interface PredictionResponse {
  success_probability: number;
  confidence: number;
  factors: Record<string, string>;
  recommendation: string;
}

function calculatePrediction(data: ApplicationData): PredictionResponse {
  // Base probability
  let baseProbability = 0.35;
  const factors: Record<string, string> = {};

  // Source impact
  const sourceLower = data.source.toLowerCase();
  if (sourceLower === 'referral') {
    baseProbability += 0.25;
    factors.referral = '+25% (strong referral advantage)';
  } else if (sourceLower === 'linkedin') {
    baseProbability += 0.05;
    factors.source = '+5% (LinkedIn application)';
  } else {
    factors.source = '0% (standard application)';
  }

  // Cover letter impact
  if (data.coverLetterUsed) {
    baseProbability += 0.10;
    factors.coverLetter = '+10% (customized cover letter)';
  } else {
    baseProbability -= 0.05;
    factors.coverLetter = '-5% (no cover letter)';
  }

  // Work type impact
  if (data.workType === 'Remote') {
    baseProbability -= 0.05;
    factors.workType = '-5% (remote = more competitive)';
  } else if (data.workType === 'On-site') {
    baseProbability += 0.05;
    factors.workType = '+5% (on-site = less competitive)';
  } else {
    factors.workType = '0% (hybrid)';
  }

  // Status impact
  if (data.status === 'Interview') {
    baseProbability += 0.30;
    factors.status = '+30% (already in interview stage)';
  } else if (data.status === 'Screening') {
    baseProbability += 0.15;
    factors.status = '+15% (passed initial screening)';
  }

  // Clamp between 0.05 and 0.95
  const finalProbability = Math.max(0.05, Math.min(0.95, baseProbability));

  // Mock confidence based on available data
  let confidence = 0.70;
  if (data.location && data.workType && data.resumeVersion) {
    confidence = 0.85;
  }

  // Generate recommendation
  let recommendation: string;
  if (finalProbability >= 0.7) {
    recommendation = 'Strong candidate! Follow up in 3-5 days if no response.';
  } else if (finalProbability >= 0.5) {
    recommendation = 'Good chances. Prepare for potential interview.';
  } else if (finalProbability >= 0.3) {
    recommendation = 'Average odds. Continue applying to similar roles.';
  } else {
    recommendation = 'Low probability. Focus efforts on stronger opportunities.';
  }

  return {
    success_probability: Math.round(finalProbability * 1000) / 1000,
    confidence: Math.round(confidence * 1000) / 1000,
    factors,
    recommendation,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ApplicationData;

    // Validate required fields
    if (!body.company || !body.position || !body.source || !body.status || !body.dateApplied) {
      return NextResponse.json(
        { error: 'Missing required fields: company, position, source, status, dateApplied' },
        { status: 422 }
      );
    }

    // Calculate prediction
    const prediction = calculatePrediction(body);

    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Prediction API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate prediction' },
      { status: 500 }
    );
  }
}
