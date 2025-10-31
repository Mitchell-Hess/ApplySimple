import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get total count
    const totalApplications = await prisma.application.count();

    // Get status counts
    const statusCounts = await prisma.application.groupBy({
      by: ['status'],
      _count: true,
    });

    // Get source counts
    const sourceCounts = await prisma.application.groupBy({
      by: ['foundOn'],
      _count: true,
      orderBy: {
        _count: {
          foundOn: 'desc',
        },
      },
    });

    // Get job type counts
    const jobTypeCounts = await prisma.application.groupBy({
      by: ['jobType'],
      _count: true,
      where: {
        jobType: {
          not: null,
        },
      },
    });

    // Get applications with outcomes
    const withOutcomes = await prisma.application.count({
      where: {
        dateOfOutcome: {
          not: null,
        },
      },
    });

    // Get applications with cover letters
    const withCoverLetters = await prisma.application.count({
      where: {
        coverLetterUsed: true,
      },
    });

    // Get interview stats
    const withInterviews = await prisma.application.count({
      where: {
        numberOfRounds: {
          gt: 0,
        },
      },
    });

    // Get recent applications (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentApplications = await prisma.application.count({
      where: {
        dateApplied: {
          gte: thirtyDaysAgo,
        },
      },
    });

    // Calculate average response time (days between application and outcome)
    const applicationsWithOutcomes = await prisma.application.findMany({
      where: {
        dateOfOutcome: {
          not: null,
        },
      },
      select: {
        dateApplied: true,
        dateOfOutcome: true,
      },
    });

    const avgResponseTime = applicationsWithOutcomes.length > 0
      ? applicationsWithOutcomes.reduce((sum, app) => {
          const days = Math.floor(
            (app.dateOfOutcome!.getTime() - app.dateApplied.getTime()) / (1000 * 60 * 60 * 24)
          );
          return sum + days;
        }, 0) / applicationsWithOutcomes.length
      : 0;

    return NextResponse.json({
      totalApplications,
      statusCounts: statusCounts.map(s => ({
        status: s.status,
        count: s._count,
      })),
      sourceCounts: sourceCounts.map(s => ({
        source: s.foundOn,
        count: s._count,
      })),
      jobTypeCounts: jobTypeCounts.map(j => ({
        jobType: j.jobType,
        count: j._count,
      })),
      withOutcomes,
      withCoverLetters,
      withInterviews,
      recentApplications,
      avgResponseTime: Math.round(avgResponseTime),
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
