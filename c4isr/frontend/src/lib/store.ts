import { create } from 'zustand'
import type { Flight, TrackResponse } from './types'

export type BaseStyle = 'light' | 'dark' | 'contrast' | 'satellite'

type AppState = {
	language: 'en' | 'fa' | 'sv'
	baseStyle: BaseStyle
	flights: Flight[]
	selected?: Flight
	track?: TrackResponse
	setLanguage: (lng: AppState['language']) => void
	setBaseStyle: (s: BaseStyle) => void
	setFlights: (f: Flight[]) => void
	selectFlight: (f?: Flight) => void
	setTrack: (t?: TrackResponse) => void
}

export const useAppStore = create<AppState>((set) => ({
	language: 'en',
	baseStyle: 'dark',
	flights: [],
	selected: undefined,
	track: undefined,
	setLanguage: (language) => set({ language }),
	setBaseStyle: (baseStyle) => set({ baseStyle }),
	setFlights: (flights) => set({ flights }),
	selectFlight: (selected) => set({ selected }),
	setTrack: (track) => set({ track }),
}))
