import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { TopBar } from './components/TopBar'
import { MapView } from './components/MapView'
import { FlightList } from './components/FlightList'
import { useAppStore } from './lib/store'

export const App: React.FC = () => {
  const { t, i18n } = useTranslation()
  const language = useAppStore((s) => s.language)

  useEffect(() => {
    i18n.changeLanguage(language)
    if (language === 'fa') {
      document.dir = 'rtl'
    } else {
      document.dir = 'ltr'
    }
  }, [language, i18n])

  return (
    <div className="app-root">
      <TopBar />
      <div className="main">
        <MapView />
        <FlightList />
      </div>
    </div>
  )
}
