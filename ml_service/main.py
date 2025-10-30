"""
ApplySimple ML Service
FastAPI microservice for predicting job application outcomes
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
import random

app = FastAPI(
    title="ApplySimple ML Service",
    description="Machine Learning predictions for job application outcomes",
    version="1.0.0"
)

# Configure CORS to allow requests from Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ApplicationData(BaseModel):
    """Input data for prediction"""
    company: str
    position: str
    location: Optional[str] = None
    workType: Optional[Literal["Remote", "Hybrid", "On-site"]] = None
    source: str = Field(description="Application source: LinkedIn, Company Site, Referral, etc.")
    status: Literal["Applied", "Screening", "Interview", "Offer", "Rejected", "Withdrawn"]
    dateApplied: datetime
    resumeVersion: Optional[str] = None
    coverLetterUsed: bool = False
    hasReferral: bool = False


class PredictionResponse(BaseModel):
    """Prediction output"""
    success_probability: float = Field(ge=0.0, le=1.0, description="Probability of getting an interview/offer (0-1)")
    confidence: float = Field(ge=0.0, le=1.0, description="Model confidence (0-1)")
    factors: dict = Field(description="Key factors influencing the prediction")
    recommendation: str = Field(description="Action recommendation")


def calculate_mock_prediction(data: ApplicationData) -> PredictionResponse:
    """
    Mock prediction logic - will be replaced with actual ML model

    This uses heuristics to simulate realistic predictions based on:
    - Application source (referrals are better)
    - Work type (remote often more competitive)
    - Cover letter usage
    - Current status
    """

    # Base probability
    base_prob = 0.35

    # Adjust based on factors
    factors = {}

    # Source impact
    if data.source.lower() == "referral":
        base_prob += 0.25
        factors["referral"] = "+25% (strong referral advantage)"
    elif data.source.lower() == "linkedin":
        base_prob += 0.05
        factors["source"] = "+5% (LinkedIn application)"
    else:
        factors["source"] = "0% (standard application)"

    # Cover letter impact
    if data.coverLetterUsed:
        base_prob += 0.10
        factors["coverLetter"] = "+10% (customized cover letter)"
    else:
        factors["coverLetter"] = "-5% (no cover letter)"
        base_prob -= 0.05

    # Work type impact
    if data.workType == "Remote":
        base_prob -= 0.05
        factors["workType"] = "-5% (remote = more competitive)"
    elif data.workType == "On-site":
        base_prob += 0.05
        factors["workType"] = "+5% (on-site = less competitive)"
    else:
        factors["workType"] = "0% (hybrid)"

    # Status impact
    if data.status == "Interview":
        base_prob += 0.30
        factors["status"] = "+30% (already in interview stage)"
    elif data.status == "Screening":
        base_prob += 0.15
        factors["status"] = "+15% (passed initial screening)"

    # Clamp between 0 and 1
    final_prob = max(0.05, min(0.95, base_prob))

    # Mock confidence based on available data
    confidence = 0.70
    if data.location and data.workType and data.resumeVersion:
        confidence = 0.85

    # Generate recommendation
    if final_prob >= 0.7:
        recommendation = "Strong candidate! Follow up in 3-5 days if no response."
    elif final_prob >= 0.5:
        recommendation = "Good chances. Prepare for potential interview."
    elif final_prob >= 0.3:
        recommendation = "Average odds. Continue applying to similar roles."
    else:
        recommendation = "Low probability. Focus efforts on stronger opportunities."

    return PredictionResponse(
        success_probability=round(final_prob, 3),
        confidence=round(confidence, 3),
        factors=factors,
        recommendation=recommendation
    )


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "ApplySimple ML Service",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/health")
async def health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "model_loaded": True  # Will be True when actual model is loaded
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict(data: ApplicationData):
    """
    Predict the success probability for a job application

    Args:
        data: Application details

    Returns:
        Prediction with probability, confidence, factors, and recommendation
    """
    try:
        prediction = calculate_mock_prediction(data)
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@app.post("/batch-predict")
async def batch_predict(applications: list[ApplicationData]):
    """
    Predict success probability for multiple applications

    Args:
        applications: List of application details

    Returns:
        List of predictions
    """
    try:
        predictions = [calculate_mock_prediction(app) for app in applications]
        return predictions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch prediction failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
