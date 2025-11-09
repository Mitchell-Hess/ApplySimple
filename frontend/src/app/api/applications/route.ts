import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeJobType, normalizeStatus, normalizeSource, normalizeCompany } from '@/lib/normalize';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    // Validate and sanitize pagination parameters
    let limit: number | undefined;
    let offset: number | undefined;

    if (limitParam) {
      const parsedLimit = parseInt(limitParam, 10);
      if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 1000) {
        return NextResponse.json(
          { error: 'Invalid limit parameter. Must be between 1 and 1000.' },
          { status: 400 }
        );
      }
      limit = parsedLimit;
    }

    if (offsetParam) {
      const parsedOffset = parseInt(offsetParam, 10);
      if (isNaN(parsedOffset) || parsedOffset < 0) {
        return NextResponse.json(
          { error: 'Invalid offset parameter. Must be a non-negative number.' },
          { status: 400 }
        );
      }
      offset = parsedOffset;
    }

    // Fetch applications from database, filtered by user and ordered by most recent first
    const applications = await prisma.application.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: { dateApplied: 'desc' },
      take: limit,
      skip: offset,
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
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.company || typeof body.company !== 'string' || !body.company.trim()) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    if (!body.jobTitle || typeof body.jobTitle !== 'string' || !body.jobTitle.trim()) {
      return NextResponse.json(
        { error: 'Job title is required' },
        { status: 400 }
      );
    }

    if (!body.dateApplied) {
      return NextResponse.json(
        { error: 'Date applied is required' },
        { status: 400 }
      );
    }

    // Validate date format
    const dateApplied = new Date(body.dateApplied);
    if (isNaN(dateApplied.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format for dateApplied' },
        { status: 400 }
      );
    }

    // Validate optional date if provided
    let dateOfOutcome: Date | null = null;
    if (body.dateOfOutcome) {
      dateOfOutcome = new Date(body.dateOfOutcome);
      if (isNaN(dateOfOutcome.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format for dateOfOutcome' },
          { status: 400 }
        );
      }
    }

    if (!body.foundOn || typeof body.foundOn !== 'string') {
      return NextResponse.json(
        { error: 'Application source (foundOn) is required' },
        { status: 400 }
      );
    }

    // Normalize data before saving
    const normalizedData = {
      userId: session.user.id,
      company: normalizeCompany(body.company),
      jobTitle: body.jobTitle.trim(),
      salary: body.salary?.trim(),
      jobType: normalizeJobType(body.jobType),
      jobUrl: body.jobUrl?.trim(),
      dateApplied,
      foundOn: normalizeSource(body.foundOn),
      coverLetterUsed: body.coverLetterUsed || false,
      numberOfRounds: body.numberOfRounds,
      dateOfOutcome,
      notes: body.notes?.trim(),
      status: normalizeStatus(body.status),
    };

    // Create new application in database
    const application = await prisma.application.create({
      data: normalizedData,
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

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Verify that the application belongs to the user
    const existingApp = await prisma.application.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingApp || existingApp.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Application not found or unauthorized' },
        { status: 404 }
      );
    }

    // Normalize data before updating
    const normalizedData: Record<string, unknown> = {};

    if (updateData.company !== undefined) normalizedData.company = normalizeCompany(updateData.company);
    if (updateData.jobTitle !== undefined) normalizedData.jobTitle = updateData.jobTitle?.trim();
    if (updateData.salary !== undefined) normalizedData.salary = updateData.salary?.trim();
    if (updateData.jobType !== undefined) normalizedData.jobType = normalizeJobType(updateData.jobType);
    if (updateData.jobUrl !== undefined) normalizedData.jobUrl = updateData.jobUrl?.trim();
    if (updateData.dateApplied !== undefined) normalizedData.dateApplied = new Date(updateData.dateApplied);
    if (updateData.foundOn !== undefined) normalizedData.foundOn = normalizeSource(updateData.foundOn);
    if (updateData.coverLetterUsed !== undefined) normalizedData.coverLetterUsed = updateData.coverLetterUsed;
    if (updateData.numberOfRounds !== undefined) normalizedData.numberOfRounds = updateData.numberOfRounds;
    if (updateData.dateOfOutcome !== undefined) normalizedData.dateOfOutcome = updateData.dateOfOutcome ? new Date(updateData.dateOfOutcome) : null;
    if (updateData.notes !== undefined) normalizedData.notes = updateData.notes?.trim();
    if (updateData.status !== undefined) normalizedData.status = normalizeStatus(updateData.status);

    // Update application in database
    const application = await prisma.application.update({
      where: { id },
      data: normalizedData,
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error('Update application error:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const deleteAll = searchParams.get('deleteAll');

    // Handle delete all applications
    if (deleteAll === 'true') {
      const result = await prisma.application.deleteMany({
        where: { userId: session.user.id },
      });

      return NextResponse.json({
        success: true,
        deletedCount: result.count,
        message: `Successfully deleted ${result.count} application(s)`
      });
    }

    // Handle single application deletion
    if (!id) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // Verify that the application belongs to the user
    const existingApp = await prisma.application.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingApp || existingApp.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Application not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete application from database
    await prisma.application.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete application error:', error);
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    );
  }
}
