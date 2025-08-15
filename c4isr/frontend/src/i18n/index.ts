import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './en.json'
import fa from './fa.json'
import sv from './sv.json'

const resources = { en: { translation: en }, fa: { translation: fa }, sv: { translation: sv } } as const

i18n.use(initReactI18next).init({
	resources,
	lng: 'en',
	fallbackLng: 'en',
	interpolation: { escapeValue: false },
})

export default i18n
