import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore, BaseStyle } from '../lib/store'

export const TopBar: React.FC = () => {
  const { t } = useTranslation()
  const language = useAppStore((s) => s.language)
  const setLanguage = useAppStore((s) => s.setLanguage)
  const baseStyle = useAppStore((s) => s.baseStyle)
  const setBaseStyle = useAppStore((s) => s.setBaseStyle)

  const changeLang = (e: React.ChangeEvent<HTMLSelectElement>) => setLanguage(e.target.value as any)

  const styleBtn = (style: BaseStyle, label: string) => (
    <button
      key={style}
      className={baseStyle === style ? 'style-btn active' : 'style-btn'}
      onClick={() => setBaseStyle(style)}
      title={label}
    >
      {label}
    </button>
  )

  return (
    <div className="topbar">
      <div className="title">{t('app.title')}</div>
      <div className="controls">
        <div className="styles">
          {styleBtn('dark', t('map.base.dark'))}
          {styleBtn('light', t('map.base.light'))}
          {styleBtn('contrast', t('map.base.contrast'))}
          {styleBtn('satellite', t('map.base.satellite'))}
        </div>
        <select value={language} onChange={changeLang} className="lang-select">
          <option value="en">EN</option>
          <option value="fa">FA</option>
          <option value="sv">SV</option>
        </select>
      </div>
    </div>
  )
}
