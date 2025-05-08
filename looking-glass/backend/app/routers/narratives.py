from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from datetime import datetime, timedelta
import numpy as np
from sklearn.cluster import KMeans
import random

router = APIRouter(
    prefix="/api/narratives",
    tags=["narratives"],
    responses={404: {"description": "Not found"}},
)

def generate_demo_narrative_clusters(num_clusters: int = 5) -> List[Dict[str, Any]]:
    """Generate demo narrative cluster data"""
    themes = [
        "Technology Impact", "Global Politics", "Climate Change",
        "Economic Trends", "Social Movements", "Healthcare Innovation",
        "Education Reform", "Urban Development"
    ]
    
    clusters = []
    used_themes = random.sample(themes, num_clusters)
    
    # Generate random 2D coordinates for visualization
    points = np.random.rand(num_clusters, 2)
    
    for i in range(num_clusters):
        # Generate narratives within this cluster
        num_narratives = random.randint(5, 15)
        narratives = []
        
        cluster_center = points[i]
        
        for j in range(num_narratives):
            # Generate points near the cluster center
            point = cluster_center + np.random.normal(0, 0.1, 2)
            point = np.clip(point, 0, 1)  # Keep within bounds
            
            narratives.append({
                "id": f"narrative_{i}_{j}",
                "title": f"Narrative {j+1}",
                "summary": f"Sample narrative summary for cluster {i+1}, narrative {j+1}",
                "sentiment": random.uniform(-1, 1),
                "coordinates": {
                    "x": float(point[0]),
                    "y": float(point[1])
                }
            })
        
        clusters.append({
            "id": f"cluster_{i}",
            "theme": used_themes[i],
            "size": len(narratives),
            "center": {
                "x": float(cluster_center[0]),
                "y": float(cluster_center[1])
            },
            "narratives": narratives,
            "sentiment_score": round(random.uniform(-1, 1), 2),
            "growth_rate": round(random.uniform(-0.5, 0.5), 2)
        })
    
    return clusters

@router.get("/clusters")
async def get_narrative_clusters(
    min_size: int = 5,
    max_clusters: int = 10
) -> List[Dict[str, Any]]:
    """
    Get narrative clusters with their associated data points
    """
    if min_size < 1:
        raise HTTPException(
            status_code=400,
            detail="Minimum cluster size must be at least 1"
        )
    
    if max_clusters < 1 or max_clusters > 20:
        raise HTTPException(
            status_code=400,
            detail="Number of clusters must be between 1 and 20"
        )
    
    return generate_demo_narrative_clusters(max_clusters)

@router.get("/trends")
async def get_narrative_trends(
    timeframe: str = "7d"
) -> Dict[str, Any]:
    """
    Get trending narratives and their evolution over time
    """
    # Parse timeframe
    days = {
        "7d": 7,
        "30d": 30,
        "90d": 90
    }.get(timeframe, 7)
    
    # Generate trend data
    base_date = datetime.now() - timedelta(days=days)
    trend_data = []
    
    themes = ["Technology", "Politics", "Environment", "Economy", "Society"]
    theme_trends = {theme: [] for theme in themes}
    
    for i in range(days):
        current_date = base_date + timedelta(days=i)
        
        # Generate random strength values for each theme
        for theme in themes:
            # Add some randomness but maintain a trend
            base_value = random.uniform(0.3, 0.7)
            noise = random.uniform(-0.1, 0.1)
            theme_trends[theme].append({
                "date": current_date.isoformat(),
                "strength": round(base_value + noise, 2)
            })
    
    return {
        "timeframe": timeframe,
        "themes": [{
            "name": theme,
            "trend_data": data
        } for theme, data in theme_trends.items()]
    }

@router.get("/cluster/{cluster_id}")
async def get_cluster_details(cluster_id: str) -> Dict[str, Any]:
    """
    Get detailed information about a specific narrative cluster
    """
    clusters = generate_demo_narrative_clusters()
    cluster = next((c for c in clusters if c["id"] == cluster_id), None)
    
    if not cluster:
        raise HTTPException(
            status_code=404,
            detail=f"Cluster {cluster_id} not found"
        )
    
    # Add additional detailed information
    cluster["temporal_evolution"] = [
        {
            "date": (datetime.now() - timedelta(days=i)).isoformat(),
            "size": random.randint(5, 20),
            "sentiment": round(random.uniform(-1, 1), 2)
        }
        for i in range(30)
    ]
    
    return cluster
