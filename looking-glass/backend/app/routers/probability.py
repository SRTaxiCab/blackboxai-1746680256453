from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import numpy as np
from datetime import datetime, timedelta
from sklearn.preprocessing import MinMaxScaler
import random

router = APIRouter(
    prefix="/api/probability",
    tags=["probability"],
    responses={404: {"description": "Not found"}},
)

def generate_demo_probability_data(
    category: str,
    timeframe: int
) -> Dict[str, Any]:
    """Generate demo probability data for events"""
    # Simulate different event categories having different baseline probabilities
    category_baselines = {
        "Political": 0.4,
        "Economic": 0.6,
        "Social": 0.5,
        "Environmental": 0.3
    }
    
    baseline = category_baselines.get(category, 0.5)
    
    # Generate time series data
    dates = []
    probabilities = []
    factors = []
    
    base_date = datetime.now()
    for i in range(timeframe):
        current_date = base_date + timedelta(days=i)
        
        # Generate a probability that varies around the baseline
        noise = np.random.normal(0, 0.1)
        probability = min(max(baseline + noise, 0), 1)
        
        # Generate contributing factors
        num_factors = random.randint(2, 4)
        current_factors = []
        for j in range(num_factors):
            factor_impact = random.uniform(0.1, 0.4)
            current_factors.append({
                "name": f"Factor {j+1}",
                "impact": round(factor_impact, 2),
                "trend": random.choice(["increasing", "stable", "decreasing"])
            })
        
        dates.append(current_date.isoformat())
        probabilities.append(round(probability, 3))
        factors.append(current_factors)
    
    return {
        "category": category,
        "timeframe": timeframe,
        "dates": dates,
        "probabilities": probabilities,
        "contributing_factors": factors,
        "overall_probability": round(np.mean(probabilities), 3),
        "confidence_interval": {
            "lower": round(max(np.mean(probabilities) - np.std(probabilities), 0), 3),
            "upper": round(min(np.mean(probabilities) + np.std(probabilities), 1), 3)
        }
    }

@router.get("/analyze")
async def analyze_probability(
    category: str,
    timeframe: int = 30
) -> Dict[str, Any]:
    """
    Analyze probability for events in a given category over a timeframe
    """
    if timeframe < 1 or timeframe > 365:
        raise HTTPException(
            status_code=400,
            detail="Timeframe must be between 1 and 365 days"
        )
    
    return generate_demo_probability_data(category, timeframe)

@router.get("/categories")
async def get_categories() -> List[str]:
    """
    Get available event categories for probability analysis
    """
    return ["Political", "Economic", "Social", "Environmental"]

@router.get("/historical")
async def get_historical_probabilities(
    category: str,
    start_date: str = None,
    end_date: str = None
) -> List[Dict[str, Any]]:
    """
    Get historical probability data for a category
    """
    # Generate some historical data points
    data_points = []
    base_date = datetime.now() - timedelta(days=365)
    
    for i in range(365):
        current_date = base_date + timedelta(days=i)
        if start_date and current_date.isoformat() < start_date:
            continue
        if end_date and current_date.isoformat() > end_date:
            continue
            
        probability = random.uniform(0.2, 0.8)
        data_points.append({
            "date": current_date.isoformat(),
            "probability": round(probability, 3),
            "actual_occurrence": random.random() < probability
        })
    
    return data_points
