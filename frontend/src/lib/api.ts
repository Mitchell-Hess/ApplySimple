import { Application, PredictionRequest, PredictionResponse } from '@/types/application';

const API_BASE = '/api';

export async function fetchApplications(): Promise<Application[]> {
  const response = await fetch(`${API_BASE}/applications`);
  if (!response.ok) {
    throw new Error('Failed to fetch applications');
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
