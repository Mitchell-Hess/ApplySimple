import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Fetch all applications from database, ordered by most recent first
    const applications = await prisma.application.findMany({
      orderBy: { dateApplied: 'desc' },
      take: 100, // Limit to most recent 100 for performance
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error('Applications API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Create new application in database
    const application = await prisma.application.create({
      data: {
        company: body.company,
        jobTitle: body.jobTitle,
        salary: body.salary,
        jobType: body.jobType,
        jobUrl: body.jobUrl,
        dateApplied: new Date(body.dateApplied),
        foundOn: body.foundOn,
        coverLetterUsed: body.coverLetterUsed || false,
        numberOfRounds: body.numberOfRounds,
        dateOfOutcome: body.dateOfOutcome ? new Date(body.dateOfOutcome) : null,
        notes: body.notes,
        status: body.status || 'Applied',
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Create application error:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}
