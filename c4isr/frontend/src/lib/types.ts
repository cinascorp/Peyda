export type Flight = {
	id: string
	icao24?: string
	callsign?: string
	lat?: number
	lon?: number
	alt_baro?: number
	alt_geom?: number
	heading?: number
	speed?: number
	source: string
	military: boolean
	category?: string
	origin_country?: string
	squawk?: string
}

export type FlightAggregateResponse = {
	now: number
	source_counts: Record<string, number>
	flights: Flight[]
}

export type TrackPoint = { lat: number; lon: number; alt?: number; time?: number }
export type TrackResponse = { icao24: string; points: TrackPoint[] }
