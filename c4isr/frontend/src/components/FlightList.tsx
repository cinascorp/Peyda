import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../lib/store'
import type { Flight } from '../lib/types'

export const FlightList: React.FC = () => {
  const { t } = useTranslation()
  const flights = useAppStore((s) => s.flights)
  const selectFlight = useAppStore((s) => s.selectFlight)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return flights.slice(0, 200)
    return flights.filter((f) => (f.callsign || '').toLowerCase().includes(q) || (f.icao24 || '').toLowerCase().includes(q)).slice(0, 200)
  }, [flights, query])

  const renderItem = (f: Flight) => (
    <div key={f.id} className={f.military ? 'flight-item mil' : 'flight-item'} onClick={() => selectFlight(f)}>
      <div className="line">
        <span className="cs">{f.callsign || f.icao24}</span>
        {f.military && <span className="tag">{t('flight.military')}</span>}
      </div>
      <div className="meta">
        <span>{t('flight.alt')}: {f.alt_geom ?? f.alt_baro ?? '-'}</span>
        <span>{t('flight.speed')}: {f.speed ?? '-'}</span>
      </div>
    </div>
  )

  return (
    <div className="flight-list">
      <input
        placeholder={t('search.placeholder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search"
      />
      <div className="items">
        {filtered.map(renderItem)}
      </div>
    </div>
  )
}
