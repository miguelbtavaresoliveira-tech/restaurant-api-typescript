import { cleanExpiredTokens } from './cleanExpiredTokens.js';

/**
 * Agenda o job cleanExpiredTokens para rodar todo dia às 04:00 (horário local).
 * Usa setTimeout/setInterval simples — sem lib externa de scheduler.
 */
export function initScheduleJobs(): void {
  const schedule = () => {
    cleanExpiredTokens().catch((err) => {
      console.error('Error cleaning expired refresh tokens:', err);
    });

    const now = new Date();
    const next = new Date();
    next.setDate(now.getDate() + 1);
    next.setHours(4, 0, 0, 0);
    const delay = next.getTime() - now.getTime();
    setTimeout(schedule, delay);
  };

  const now = new Date();
  const first = new Date();
  first.setHours(4, 0, 0, 0);
  let delay = first.getTime() - now.getTime();
  if (delay < 0) {
    delay += 24 * 60 * 60 * 1000;
  }
  setTimeout(schedule, delay);
}
