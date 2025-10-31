import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeJobType, normalizeStatus, normalizeSource, normalizeCompany } from '@/lib/normalize';

/**
 * POST /api/normalize-data
 * Normalizes all existing data in the database
 * This endpoint should be called to clean up existing data after updating normalization rules
 */
export async function POST() {
  try {
    // Fetch all applications
    const applications = await prisma.application.findMany();

    let updatedCount = 0;

    // Update each application with normalized data
    for (const app of applications) {
      const updates: Record<string, string> = {};

      // Normalize job type if it exists
      if (app.jobType) {
        const normalized = normalizeJobType(app.jobType);
        if (normalized !== app.jobType) {
          updates.jobType = normalized;
        }
      }

      // Normalize status
      const normalizedStatus = normalizeStatus(app.status);
      if (normalizedStatus !== app.status) {
        updates.status = normalizedStatus;
      }

      // Normalize source
      const normalizedSource = normalizeSource(app.foundOn);
      if (normalizedSource !== app.foundOn) {
        updates.foundOn = normalizedSource;
      }

      // Normalize company
      const normalizedCompany = normalizeCompany(app.company);
      if (normalizedCompany !== app.company) {
        updates.company = normalizedCompany;
      }

      // Normalize other string fields
      if (app.jobTitle) {
        updates.jobTitle = app.jobTitle.trim();
      }
      if (app.salary) {
        updates.salary = app.salary.trim();
      }
      if (app.notes) {
        updates.notes = app.notes.trim();
      }

      // Only update if there are changes
      if (Object.keys(updates).length > 0) {
        await prisma.application.update({
          where: { id: app.id },
          data: updates,
        });
        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully normalized ${updatedCount} out of ${applications.length} applications`,
      total: applications.length,
      updated: updatedCount,
    });
  } catch (error) {
    console.error('Normalize data error:', error);
    return NextResponse.json(
      { error: 'Failed to normalize data' },
      { status: 500 }
    );
  }
}
