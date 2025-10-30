-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "company" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "salary" TEXT,
    "jobType" TEXT,
    "jobUrl" TEXT,
    "dateApplied" TIMESTAMP(3) NOT NULL,
    "foundOn" TEXT NOT NULL,
    "coverLetterUsed" BOOLEAN NOT NULL DEFAULT false,
    "numberOfRounds" INTEGER,
    "dateOfOutcome" TIMESTAMP(3),
    "notes" TEXT,
    "predictedSuccess" DOUBLE PRECISION,
    "predictionDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'Applied',

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- CreateIndex
CREATE INDEX "applications_dateApplied_idx" ON "applications"("dateApplied");

-- CreateIndex
CREATE INDEX "applications_company_idx" ON "applications"("company");

-- CreateIndex
CREATE INDEX "applications_foundOn_idx" ON "applications"("foundOn");
