import { WeatherAttentionPoint } from './types';

const TOKEN_MESSAGES: Record<string, string> = {
  CB: 'CB détecté : risque de convection significative.',
  TS: 'TS détecté : activité orageuse à surveiller.',
  FG: 'FG détecté : brouillard pouvant réduire fortement la visibilité.',
  BR: 'BR détecté : brume, impact possible sur la visibilité VFR.',
  BKN: 'BKN détecté : couche nuageuse fragmentée pouvant réduire les marges.',
  OVC: 'OVC détecté : ciel couvert pouvant contraindre le plafond disponible.'
};

export function analyzeWeatherTexts(texts: string[]): WeatherAttentionPoint[] {
  const joined = texts.join(' ').toUpperCase();

  return Object.entries(TOKEN_MESSAGES)
    .filter(([token]) => joined.includes(token))
    .map(([token, message]) => ({
      token,
      message,
      level: 'caution' as const
    }));
}
