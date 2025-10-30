export interface Application {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;

  // Job Information (matches your spreadsheet)
  company: string;
  jobTitle: string;              // Your column: "Job Title"
  salary?: string;               // Your column: "Salary"
  jobType?: string;              // Your column: "Job Type"
  jobUrl?: string;               // Your column: "Link to Job Posting"

  // Application Details
  dateApplied: Date;             // Your column: "Date Applied"
  foundOn: string;               // Your column: "Found On?"
  coverLetterUsed?: boolean;     // Your column: "Cover Letter?"

  // Interview Process
  numberOfRounds?: number;       // Your column: "Number of Rounds"
  dateOfOutcome?: Date;          // Your column: "Date of Offer/Rejection"

  // Notes
  notes?: string;                // Your column: "Notes"

  // Status (computed)
  status: 'Applied' | 'Interview' | 'Rejected' | 'Offer';

  // ML Predictions
  predictedSuccess?: number;
  predictionDate?: Date;
}

export interface PredictionRequest {
  company: string;
  position: string;
  location?: string;
  workType?: 'Remote' | 'Hybrid' | 'On-site';
  source: string;
  status: 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn';
  dateApplied: Date;
  resumeVersion?: string;
  coverLetterUsed?: boolean;
  hasReferral?: boolean;
}

export interface PredictionResponse {
  success_probability: number;
  confidence: number;
  factors: Record<string, string>;
  recommendation: string;
}
