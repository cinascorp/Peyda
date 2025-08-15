import { CONFIG } from '../config'
import type { FlightAggregateResponse, TrackResponse } from './types'

export async function fetchFlights(bbox?: [number, number, number, number]): Promise<FlightAggregateResponse> {
	const qs = bbox ? `?bbox=${bbox.join(',')}` : ''
	const res = await fetch(`${CONFIG.backendBaseUrl}/flights${qs}`)
	if (!res.ok) throw new Error('Failed to fetch flights')
	return res.json()
}

export async function fetchTrack(icao24: string): Promise<TrackResponse> {
	const res = await fetch(`${CONFIG.backendBaseUrl}/track/${icao24}`)
	if (!res.ok) throw new Error('Failed to fetch track')
	return res.json()
}
