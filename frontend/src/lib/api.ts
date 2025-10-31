import { Application, PredictionRequest, PredictionResponse, Stats } from '@/types/application';

const API_BASE = '/api';

export async function fetchApplications(): Promise<Application[]> {
  const response = await fetch(`${API_BASE}/applications`);
  if (!response.ok) {
    throw new Error('Failed to fetch applications');
  }
  return response.json();
}

export async function fetchStats(): Promise<Stats> {
  const response = await fetch(`${API_BASE}/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  return response.json();
}

export async function createApplication(data: Partial<Application>): Promise<Application> {
  const response = await fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create application');
  }
  return response.json();
}

export async function predictSuccess(data: PredictionRequest): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to get prediction');
  }
  return response.json();
}

// Helper function to convert Application to PredictionRequest
export function applicationToPredictionRequest(app: Application): PredictionRequest {
  return {
    company: app.company,
    position: app.jobTitle,
    workType: app.jobType as 'Remote' | 'Hybrid' | 'On-site' | undefined,
    source: app.foundOn,
    status: app.status as 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn',
    dateApplied: app.dateApplied,
    coverLetterUsed: app.coverLetterUsed,
  };
}

// Generate predictions for multiple applications
export async function generatePredictions(applications: Application[]): Promise<Map<string, PredictionResponse>> {
  const predictions = new Map<string, PredictionResponse>();

  // Process in batches to avoid overwhelming the API
  const batchSize = 5;
  for (let i = 0; i < applications.length; i += batchSize) {
    const batch = applications.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (app) => {
        try {
          const predictionRequest = applicationToPredictionRequest(app);
          const prediction = await predictSuccess(predictionRequest);
          predictions.set(app.id, prediction);
        } catch (error) {
          console.error(`Failed to get prediction for application ${app.id}:`, error);
          // Continue with other predictions even if one fails
        }
      })
    );
  }

  return predictions;
}
