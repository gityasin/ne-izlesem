import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import trTranslations from './tr.json';
import enTranslations from './en.json';

// Create an i18n instance
const i18n = new I18n({
  tr: trTranslations,  // Turkish
  en: enTranslations,  // English (fallback)
});

// Set the locale to Turkish by default, but use device locale if available
i18n.locale = Localization.locale.split('-')[0] || 'tr';

// Default to Turkish if the language isn't supported
i18n.defaultLocale = 'tr';
i18n.enableFallback = true;

export default i18n;
