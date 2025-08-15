from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import time

from .models import FlightAggregateResponse, TrackResponse
from .clients import aggregate_flights, fetch_track_opensky
from .config import BACKEND_CORS_ORIGINS

app = FastAPI(title="C4ISR Safe Backend", version="0.1.0")

app.add_middleware(
	CORSMiddleware,
	allow_origins=[origin.strip() for origin in BACKEND_CORS_ORIGINS],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


@app.get("/health")
async def health():
	return {"ok": True, "time": int(time.time())}


@app.get("/flights", response_model=FlightAggregateResponse)
async def get_flights(bbox: Optional[str] = Query(default=None, description="minLon,minLat,maxLon,maxLat")):
	now, flights, counts = await aggregate_flights(bbox)
	return {"now": now, "source_counts": counts, "flights": [f.model_dump() for f in flights]}


@app.get("/track/{icao24}", response_model=TrackResponse)
async def get_track(icao24: str):
	points = await fetch_track_opensky(icao24)
	return {"icao24": icao24, "points": [p.model_dump() for p in points]}