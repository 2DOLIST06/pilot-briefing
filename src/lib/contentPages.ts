export type ContentPageKey = 'meteo' | 'masse-centrage' | 'accueil';

export type ContentPages = Record<ContentPageKey, string>;

export const STORAGE_KEY = 'pilot-briefing-admin-content';

export const defaultContent: ContentPages = {
  accueil:
    'Bienvenue sur la page d’accueil. Utilisez les rubriques ci-dessous pour accéder à la météo et à la masse & centrage.',
  meteo:
    'Zone de texte météo : ajoutez ici vos consignes, rappels et informations opérationnelles.',
  'masse-centrage':
    'Zone de texte masse & centrage : ajoutez ici vos procédures et rappels de calcul.'
};
