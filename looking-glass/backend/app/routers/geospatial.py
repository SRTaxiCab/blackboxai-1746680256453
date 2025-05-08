from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from datetime import datetime, timedelta
import random
import numpy as np

router = APIRouter(
    prefix="/api/geospatial",
    tags=["geospatial"],
    responses={404: {"description": "Not found"}},
)

# Sample regions for demo data
REGIONS = {
    "NA": {"name": "North America", "center": {"lat": 54.5260, "lng": -105.2551}},
    "SA": {"name": "South America", "center": {"lat": -8.7832, "lng": -55.4915}},
    "EU": {"name": "Europe", "center": {"lat": 54.5260, "lng": 15.2551}},
    "AF": {"name": "Africa", "center": {"lat": -8.7832, "lng": 34.5085}},
    "AS": {"name": "Asia", "center": {"lat": 34.0479, "lng": 100.6197}},
    "OC": {"name": "Oceania", "center": {"lat": -22.7359, "lng": 140.0188}},
}

def generate_demo_geospatial_data() -> List[Dict[str, Any]]:
    """Generate demo geospatial data points"""
    data_points = []
    
    for region_code, region_info in REGIONS.items():
        # Generate multiple points around the region center
        num_points = random.randint(5, 15)
        
        for _ in range(num_points):
            # Add some random offset to the center coordinates
            lat_offset = random.uniform(-10, 10)
            lng_offset = random.uniform(-10, 10)
            
            intensity = random.uniform(0.1, 1.0)
            category = random.choice(["Political", "Economic", "Social", "Environmental"])
            
            data_points.append({
                "id": f"point_{region_code}_{_}",
                "region": region_info["name"],
                "location": {
                    "lat": region_info["center"]["lat"] + lat_offset,
                    "lng": region_info["center"]["lng"] + lng_offset
                },
                "category": category,
                "intensity": round(intensity, 2),
                "timestamp": (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat(),
                "details": {
                    "title": f"{category} Event in {region_info['name']}",
                    "description": f"Sample event description for {region_info['name']}",
                    "impact_radius": random.randint(50, 200)
                }
            })
    
    return data_points

@router.get("/points")
async def get_geospatial_points(
    region: str = None,
    category: str = None,
    min_intensity: float = None
) -> List[Dict[str, Any]]:
    """
    Get geospatial data points with optional filtering
    """
    points = generate_demo_geospatial_data()
    
    if region:
        points = [p for p in points if p["region"] == region]
    if category:
        points = [p for p in points if p["category"] == category]
    if min_intensity is not None:
        points = [p for p in points if p["intensity"] >= min_intensity]
    
    return points

@router.get("/heatmap")
async def get_heatmap_data() -> List[Dict[str, Any]]:
    """
    Get heatmap data for visualization
    """
    points = generate_demo_geospatial_data()
    heatmap_points = [
        {
            "location": p["location"],
            "weight": p["intensity"]
        }
        for p in points
    ]
    return heatmap_points

@router.get("/regions")
async def get_regions() -> List[Dict[str, Any]]:
    """
    Get available regions with their statistics
    """
    regions_data = []
    
    for region_code, region_info in REGIONS.items():
        regions_data.append({
            "code": region_code,
            "name": region_info["name"],
            "center": region_info["center"],
            "statistics": {
                "total_events": random.randint(50, 200),
                "average_intensity": round(random.uniform(0.3, 0.8), 2),
                "trend": random.choice(["increasing", "stable", "decreasing"]),
                "dominant_category": random.choice(["Political", "Economic", "Social", "Environmental"])
            }
        })
    
    return regions_data

@router.get("/clusters")
async def get_spatial_clusters(
    min_points: int = 3,
    max_radius: float = 1000
) -> List[Dict[str, Any]]:
    """
    Get spatial clusters of events
    """
    points = generate_demo_geospatial_data()
    clusters = []
    
    # Simulate clustering by grouping points by region
    for region_code, region_info in REGIONS.items():
        region_points = [p for p in points if p["region"] == region_info["name"]]
        
        if len(region_points) >= min_points:
            clusters.append({
                "center": region_info["center"],
                "radius": random.uniform(100, max_radius),
                "points": region_points,
                "statistics": {
                    "point_count": len(region_points),
                    "average_intensity": round(np.mean([p["intensity"] for p in region_points]), 2),
                    "categories": {
                        category: len([p for p in region_points if p["category"] == category])
                        for category in ["Political", "Economic", "Social", "Environmental"]
                    }
                }
            })
    
    return clusters
