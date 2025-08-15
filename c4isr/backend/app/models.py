from pydantic import BaseModel, Field
from typing import Optional, List


class Flight(BaseModel):
	id: str
	icao24: Optional[str] = None
	callsign: Optional[str] = None
	lat: Optional[float] = Field(default=None, description="Latitude in degrees")
	lon: Optional[float] = Field(default=None, description="Longitude in degrees")
	alt_baro: Optional[float] = None
	alt_geom: Optional[float] = None
	heading: Optional[float] = None
	speed: Optional[float] = None
	source: str
	military: bool = False
	category: Optional[str] = None
	origin_country: Optional[str] = None
	squawk: Optional[str] = None


class FlightAggregateResponse(BaseModel):
	now: int
	source_counts: dict
	flights: List[Flight]


class TrackPoint(BaseModel):
	lat: float
	lon: float
	alt: Optional[float] = None
	time: Optional[int] = None


class TrackResponse(BaseModel):
	icao24: str
	points: List[TrackPoint]