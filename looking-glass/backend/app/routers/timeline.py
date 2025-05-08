from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import pandas as pd
from datetime import datetime, timedelta
import random  # For demo data

router = APIRouter(
    prefix="/api/timeline",
    tags=["timeline"],
    responses={404: {"description": "Not found"}},
)

def generate_demo_timeline_data(days: int = 30) -> List[Dict[Any, Any]]:
    """Generate demo data for timeline visualization"""
    event_types = ["Political", "Economic", "Social", "Environmental"]
    events = []
    
    base_date = datetime.now() - timedelta(days=days)
    for i in range(days):
        current_date = base_date + timedelta(days=i)
        num_events = random.randint(1, 4)
        
        for _ in range(num_events):
            event_type = random.choice(event_types)
            impact = random.uniform(0, 1)
            events.append({
                "date": current_date.isoformat(),
                "type": event_type,
                "title": f"{event_type} Event {i}",
                "description": f"Sample {event_type.lower()} event description",
                "impact": round(impact, 2)
            })
    
    return sorted(events, key=lambda x: x["date"])

@router.get("/events")
async def get_timeline_events(
    start_date: str = None,
    end_date: str = None,
    event_type: str = None
) -> List[Dict[Any, Any]]:
    """
    Get timeline events with optional filtering
    """
    events = generate_demo_timeline_data()
    
    if start_date:
        events = [e for e in events if e["date"] >= start_date]
    if end_date:
        events = [e for e in events if e["date"] <= end_date]
    if event_type:
        events = [e for e in events if e["type"] == event_type]
    
    return events

@router.get("/summary")
async def get_timeline_summary() -> Dict[str, Any]:
    """
    Get summary statistics for timeline events
    """
    events = generate_demo_timeline_data()
    df = pd.DataFrame(events)
    
    return {
        "total_events": len(events),
        "events_by_type": df["type"].value_counts().to_dict(),
        "average_impact": round(df["impact"].mean(), 2),
        "date_range": {
            "start": min(df["date"]),
            "end": max(df["date"])
        }
    }
