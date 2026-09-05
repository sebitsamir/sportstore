import { CONFIG } from '@sport-store/shared';

export const appConfig = {
  ...CONFIG,
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || CONFIG.API_BASE_URL,
  USE_MOCK: process.env.NEXT_PUBLIC_USE_MOCK !== 'false',
};

export function formatMoney(amount: number) {
  return new Intl.NumberFormat(appConfig.LOCALE, {
    style: 'currency',
    currency: appConfig.CURRENCY,
  }).format(amount);
}

export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}
