// utils/matomo.ts

export const trackMatomoEvent = (
  category: string,
  action: string,
): void => {

  if (typeof window !== 'undefined' && window._paq) {
    window._paq.push(['trackEvent', category, action]);
  } else {
    console.warn('Matomo tracker not found.');
  }
};
