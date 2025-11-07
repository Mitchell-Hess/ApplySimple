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
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    // Fetch applications from database, filtered by user and ordered by most recent first
    const applications = await prisma.application.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: { dateApplied: 'desc' },
      take: limit ? parseInt(limit) : undefined,
      skip: offset ? parseInt(offset) : undefined,
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

    // Normalize data before saving
    const normalizedData = {
      userId: session.user.id,
      company: normalizeCompany(body.company),
      jobTitle: body.jobTitle?.trim(),
      salary: body.salary?.trim(),
      jobType: normalizeJobType(body.jobType),
      jobUrl: body.jobUrl?.trim(),
      dateApplied: new Date(body.dateApplied),
      foundOn: normalizeSource(body.foundOn),
      coverLetterUsed: body.coverLetterUsed || false,
      numberOfRounds: body.numberOfRounds,
      dateOfOutcome: body.dateOfOutcome ? new Date(body.dateOfOutcome) : null,
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
