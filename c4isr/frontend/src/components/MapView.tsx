import React, { useEffect, useMemo, useRef, useState } from 'react'
import maplibregl, { LngLatBoundsLike, Map } from 'maplibre-gl'
import { MapboxOverlay } from '@deck.gl/mapbox'
import { DeckProps, IconLayer, PathLayer, ScatterplotLayer } from 'deck.gl'
import { useAppStore } from '../lib/store'
import { CONFIG } from '../config'
import { fetchFlights, fetchTrack } from '../lib/api'
import type { Flight, TrackResponse } from '../lib/types'

const ICON_ATLAS = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png'
const ICON_MAPPING: any = {
  marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
  triangle: { x: 128, y: 0, width: 128, height: 128, mask: true }
}

function bboxFromMap(map: Map): [number, number, number, number] {
  const b = map.getBounds()
  const sw = b.getSouthWest()
  const ne = b.getNorthEast()
  return [sw.lng, sw.lat, ne.lng, ne.lat]
}

function riskNotify(milCount: number) {
  if (milCount <= 0) return
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('C4ISR', { body: 'Potential risk detected' })
  }
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance('Potential risk detected')
    window.speechSynthesis.speak(u)
  }
}

export const MapView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<Map | null>(null)
  const overlayRef = useRef<MapboxOverlay | null>(null)
  const popupRef = useRef<maplibregl.Popup | null>(null)

  const baseStyle = useAppStore((s) => s.baseStyle)
  const flights = useAppStore((s) => s.flights)
  const setFlights = useAppStore((s) => s.setFlights)
  const selected = useAppStore((s) => s.selected)
  const selectFlight = useAppStore((s) => s.selectFlight)
  const track = useAppStore((s) => s.track)
  const setTrack = useAppStore((s) => s.setTrack)

  const [lastRiskTime, setLastRiskTime] = useState(0)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const styleUrl = baseStyle === 'dark' ? CONFIG.map.styleDark
      : baseStyle === 'light' ? CONFIG.map.styleLight
      : baseStyle === 'contrast' ? CONFIG.map.styleContrast
      : CONFIG.map.styleSatellite

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl,
      center: CONFIG.map.initial.center,
      zoom: CONFIG.map.initial.zoom,
      minZoom: 1,
      maxZoom: 18,
      hash: false,
      attributionControl: true,
      antialias: true
    })
    mapRef.current = map

    // Globe projection if supported
    ;(map as any).setProjection?.('globe')

    const overlay = new MapboxOverlay({ interleaved: true })
    overlayRef.current = overlay
    map.addControl(overlay)

    map.on('load', () => {
      void refreshFlights()
      requestNotificationPermission()
    })

    map.on('moveend', () => {
      void refreshFlights()
    })

    return () => {
      overlay.finalize()
      map.remove()
      mapRef.current = null
      overlayRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return
    const styleUrl = baseStyle === 'dark' ? CONFIG.map.styleDark
      : baseStyle === 'light' ? CONFIG.map.styleLight
      : baseStyle === 'contrast' ? CONFIG.map.styleContrast
      : CONFIG.map.styleSatellite
    mapRef.current.setStyle(styleUrl)
  }, [baseStyle])

  useEffect(() => {
    const id = setInterval(() => void refreshFlights(), 5000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    // Update layers when flights/track/selection changes
    const overlay = overlayRef.current
    if (!overlay) return
    const layers = buildLayers(flights, selected, track, (info) => {
      const f = info.object as Flight
      selectFlight(f)
    })
    overlay.setProps({ layers })

    const milCount = flights.reduce((acc, f) => acc + (f.military ? 1 : 0), 0)
    const now = Date.now()
    if (milCount > 0 && now - lastRiskTime > 15000) {
      riskNotify(milCount)
      setLastRiskTime(now)
    }
  }, [flights, selected, track])

  useEffect(() => {
    // Popup on selection
    const map = mapRef.current
    if (!map) return
    popupRef.current?.remove()
    if (!selected || selected.lat == null || selected.lon == null) return

    const popup = new maplibregl.Popup({ closeButton: true })
      .setLngLat([selected.lon, selected.lat])
      .setHTML(`<div class="popup">
        <div><b>${selected.callsign || selected.icao24 || ''}</b></div>
        <div>ICAO24: ${selected.icao24 || ''}</div>
        <div>Alt: ${selected.alt_geom ?? selected.alt_baro ?? '-'} | Spd: ${selected.speed ?? '-'}</div>
        <div>Src: ${selected.source} ${selected.military ? '| MIL' : ''}</div>
        <button id="track-btn">Track</button>
      </div>`)
      .addTo(map)

    popupRef.current = popup

    setTimeout(() => {
      const btn = document.getElementById('track-btn')
      if (btn) btn.onclick = async () => {
        if (selected?.icao24) {
          const tr: TrackResponse = await fetchTrack(selected.icao24)
          setTrack(tr)
        }
      }
    }, 0)
  }, [selected])

  async function refreshFlights() {
    const map = mapRef.current
    if (!map) return
    const bbox = bboxFromMap(map)
    try {
      const res = await fetchFlights(bbox)
      setFlights(res.flights)
    } catch (e) {
      // ignore
    }
  }

  return <div ref={containerRef} className="map" />
}

function buildLayers(flights: Flight[], selected?: Flight, track?: TrackResponse, onClick?: (info: any) => void) {
  const small = flights.length <= CONFIG.map.maxPointsForIcons

  const base = new ScatterplotLayer<Flight>({
    id: 'flights-scatter',
    data: flights,
    getPosition: (d) => [d.lon!, d.lat!],
    getRadius: 70,
    radiusMinPixels: 1.5,
    radiusMaxPixels: 8,
    getFillColor: (d) => d.military ? [255, 80, 80, 200] : [80, 200, 255, 180],
    pickable: true,
    onClick,
    updateTriggers: { data: flights }
  })

  const layers: DeckProps['layers'] = [base]

  if (small) {
    layers.push(new IconLayer<Flight>({
      id: 'flights-icons',
      data: flights,
      iconAtlas: ICON_ATLAS,
      iconMapping: ICON_MAPPING,
      getIcon: (d) => (d.military ? 'triangle' : 'marker'),
      sizeScale: 12,
      getSize: 3,
      getPosition: (d) => [d.lon!, d.lat!],
      getColor: (d) => (d.military ? [255, 120, 120] : [120, 210, 255]),
      pickable: true,
      onClick,
      updateTriggers: { data: flights }
    }))
  }

  if (track && track.points.length > 1) {
    const coords = track.points.map((p) => [p.lon, p.lat])
    layers.push(new PathLayer({
      id: 'track-layer',
      data: [{ path: coords }],
      widthUnits: 'pixels',
      getWidth: () => 3,
      getColor: () => [255, 255, 0, 200]
    }))
  }

  return layers
}

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().catch(() => {})
  }
}
