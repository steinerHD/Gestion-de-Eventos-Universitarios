import { notyf } from '../app';

const recent = new Map<string, number>();
const DEDUP_WINDOW_MS = 5000; // 5 seconds

export function notifyError(message: string) {
  if (!message) return;
  try {
    const now = Date.now();
    const last = recent.get(message);
    if (last && (now - last) < DEDUP_WINDOW_MS) {
      // skip duplicate
      return;
    }
    recent.set(message, now);
    // schedule cleanup
    setTimeout(() => {
      const ts = recent.get(message);
      if (ts && (Date.now() - ts) >= DEDUP_WINDOW_MS) recent.delete(message);
    }, DEDUP_WINDOW_MS + 1000);
    notyf.error(message);
  } catch (e) {
    console.error('notifyError failed', e);
  }
}

export function notifySuccess(message: string) {
  try {
    notyf.success(message);
  } catch (e) {
    console.error('notifySuccess failed', e);
  }
}
