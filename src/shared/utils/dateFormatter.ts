import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// Define o fuso horário desejado, por exemplo, 'America/Sao_Paulo' para UTC-3
const DEFAULT_TIMEZONE = 'America/Sao_Paulo';

/**
 * Formata uma data para string no fuso horário configurado.
 * @param date - A data a ser formatada.
 * @param format - O formato desejado (padrão: 'YYYY-MM-DD HH:mm:ssZ').
 */
export function formatDate(date: Date, format: string = 'YYYY-MM-DD HH:mm:ssZ'): string {
  return dayjs(date).tz(DEFAULT_TIMEZONE).format(format);
}