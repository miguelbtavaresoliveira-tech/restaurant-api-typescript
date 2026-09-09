import { cleanExpiredTokens } from './cleanExpiredTokens.js';
/**
 * Schedules the cleanExpiredTokens job to run every day at 04:00 local time.
 * Uses a simple setTimeout / setInterval mechanism – no external scheduler library needed.
 */
export function initScheduleJobs() {
    const schedule = () => {
        // Run the cleanup
        cleanExpiredTokens().catch(err => {
            console.error('Error cleaning expired refresh tokens:', err);
        });
        // Schedule next run for tomorrow at 04:00
        const now = new Date();
        const next = new Date();
        next.setDate(now.getDate() + 1);
        next.setHours(4, 0, 0, 0);
        const delay = next.getTime() - now.getTime();
        setTimeout(schedule, delay);
    };
    // Initial schedule: compute delay until today 04:00 (or tomorrow if past).
    const now = new Date();
    const first = new Date();
    first.setHours(4, 0, 0, 0);
    let delay = first.getTime() - now.getTime();
    if (delay < 0) {
        // Already passed today, schedule for tomorrow
        delay += 24 * 60 * 60 * 1000;
    }
    setTimeout(schedule, delay);
}
