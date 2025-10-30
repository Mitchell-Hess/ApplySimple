# ApplySimple ML Service

FastAPI microservice for predicting job application success probability.

## Setup

1. Create virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the service:
```bash
python main.py
# Or use uvicorn directly:
uvicorn main:app --reload --port 8000
```

The service will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- API docs: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc

## Endpoints

### POST /predict
Predict success probability for a single application.

### POST /batch-predict
Predict for multiple applications at once.

### GET /health
Health check endpoint.
