export function extractBackendErrorMessage(error: any, fallback?: string): string {
  const defaultMsg = fallback || 'Ocurrió un error';
  if (!error) return defaultMsg;

  // Angular HttpErrorResponse often exposes the server payload in `error`.
  const payload = error.error;
  if (typeof payload === 'string' && payload.trim().length > 0) {
    return payload;
  }

  if (payload && typeof payload === 'object') {
    // Common shapes: { message: '...' } or { error: '...' }
    if (typeof payload.message === 'string' && payload.message.trim().length > 0) return payload.message;
    if (typeof payload.error === 'string' && payload.error.trim().length > 0) return payload.error;
    // Some controllers return a raw string wrapped in an object under other keys
    try {
      const asString = JSON.stringify(payload);
      if (asString && asString !== '{}') return asString;
    } catch (e) {
      // ignore
    }
  }

  // Fallbacks from HttpErrorResponse
  if (typeof error.message === 'string' && error.message.trim().length > 0) return error.message;
  if (error.status && error.statusText) return `${error.status} ${error.statusText}`;

  return defaultMsg;
}
