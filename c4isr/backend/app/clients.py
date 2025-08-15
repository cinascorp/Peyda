import asyncio
import time
from typing import Any, Dict, List, Optional, Tuple

import httpx
from cachetools import TTLCache

from .models import Flight, TrackPoint
from .config import OPEN_SKY_USERNAME, OPEN_SKY_PASSWORD, REQUEST_TIMEOUT_SECONDS, CACHE_TTL_SECONDS


_http_client = httpx.AsyncClient(timeout=httpx.Timeout(REQUEST_TIMEOUT_SECONDS))

# Simple in-memory caches to keep rate limits low
_cache_states = TTLCache(maxsize=32, ttl=CACHE_TTL_SECONDS)
_cache_track = TTLCache(maxsize=128, ttl=60)


def _bbox_params(bbox: Optional[str]) -> Dict[str, Any]:
	if not bbox:
		return {}
	try:
		min_lon, min_lat, max_lon, max_lat = [float(x) for x in bbox.split(",")]
		return {"lamin": min_lat, "lamax": max_lat, "lomin": min_lon, "lomax": max_lon}
	except Exception:
		return {}


async def fetch_opensky_states(bbox: Optional[str]) -> Tuple[int, List[Flight]]:
	cache_key = f"opensky:{bbox}"
	if cache_key in _cache_states:
		return _cache_states[cache_key]
	params = _bbox_params(bbox)
	auth = None
	if OPEN_SKY_USERNAME and OPEN_SKY_PASSWORD:
		auth = (OPEN_SKY_USERNAME, OPEN_SKY_PASSWORD)
	url = "https://opensky-network.org/api/states/all"
	resp = await _http_client.get(url, params=params, auth=auth)
	resp.raise_for_status()
	payload = resp.json()
	now = int(payload.get("time", int(time.time())))
	states = payload.get("states", []) or []
	flights: List[Flight] = []
	for s in states:
		icao24 = s[0]
		callsign = s[1].strip() if s[1] else None
		origin_country = s[2]
		lon = s[5]
		lat = s[6]
		baro_alt = s[7]
		velocity = s[9]
		heading = s[10]
		geo_alt = s[13]
		squawk = s[14]
		category = str(s[17]) if len(s) > 17 and s[17] is not None else None
		if lat is None or lon is None:
			continue
		flights.append(
			Flight(
				id=f"opensky:{icao24}",
				icao24=icao24,
				callsign=callsign,
				origin_country=origin_country,
				lat=lat,
				lon=lon,
				alt_baro=baro_alt,
				alt_geom=geo_alt,
				heading=heading,
				speed=velocity,
				source="opensky",
				military=False,
				category=category,
				squawk=squawk,
			)
		)
	)
	result = (now, flights)
	_cache_states[cache_key] = result
	return result


async def fetch_adsb_mil() -> Tuple[int, List[Flight]]:
	cache_key = "adsbmil"
	if cache_key in _cache_states:
		return _cache_states[cache_key]
	url = "https://api.adsb.lol/v2/mil"
	resp = await _http_client.get(url)
	resp.raise_for_status()
	payload = resp.json()
	now = int(payload.get("now", int(time.time())))
	ac = payload.get("ac", []) or []
	flights: List[Flight] = []
	for a in ac:
		icao24 = a.get("hex")
		callsign = a.get("flight")
		lat = a.get("lat")
		lon = a.get("lon")
		alt_baro = a.get("baro_alt") or a.get("alt_baro")
		alt_geom = a.get("geom_alt") or a.get("alt_geom")
		track = a.get("trak") or a.get("track")
		speed = a.get("gs") or a.get("spd")
		category = a.get("category")
		squawk = a.get("squawk")
		if lat is None or lon is None:
			continue
		flights.append(
			Flight(
				id=f"adsbmil:{icao24}",
				icao24=icao24,
				callsign=callsign,
				lat=lat,
				lon=lon,
				alt_baro=alt_baro,
				alt_geom=alt_geom,
				heading=track,
				speed=speed,
				source="adsb.lol",
				military=True,
				category=category,
				squawk=squawk,
			)
		)
	)
	result = (now, flights)
	_cache_states[cache_key] = result
	return result


async def fetch_track_opensky(icao24: str) -> List[TrackPoint]:
	cache_key = f"track:{icao24}"
	if cache_key in _cache_track:
		return _cache_track[cache_key]
	url = "https://opensky-network.org/api/tracks/all"
	params = {"icao24": icao24, "time": int(time.time())}
	resp = await _http_client.get(url, params=params, auth=(OPEN_SKY_USERNAME, OPEN_SKY_PASSWORD) if OPEN_SKY_USERNAME and OPEN_SKY_PASSWORD else None)
	if resp.status_code >= 400:
		return []
	payload = resp.json()
	path = payload.get("path", [])
	points: List[TrackPoint] = []
	for p in path:
		# p: time, lat, lon, baro_altitude, true_track
		t = p.get("timestamp") or p.get("time")
		lat = p.get("lat")
		lon = p.get("lon")
		alt = p.get("baro_altitude")
		if lat is None or lon is None:
			continue
		points.append(TrackPoint(lat=lat, lon=lon, alt=alt, time=t))
	_cache_track[cache_key] = points
	return points


async def aggregate_flights(bbox: Optional[str]) -> Tuple[int, List[Flight], Dict[str, int]]:
	opensky_now, opensky = await fetch_opensky_states(bbox)
	adsb_now, adsbmil = await fetch_adsb_mil()
	now = max(opensky_now, adsb_now)
	# merge by icao24 preferring military flag when available
	indexed: Dict[str, Flight] = {}
	for f in opensky:
		if f.icao24:
			indexed[f.icao24] = f
		else:
			indexed[f.id] = f
	for f in adsbmil:
		key = f.icao24 or f.id
		base = indexed.get(key)
		if base:
			base.military = True
			if f.callsign and not base.callsign:
				base.callsign = f.callsign
			if f.category and not base.category:
				base.category = f.category
		else:
			indexed[key] = f
	flights = list(indexed.values())
	counts = {"opensky": len(opensky), "adsb.lol": len(adsbmil), "merged": len(flights)}
	return now, flights, counts