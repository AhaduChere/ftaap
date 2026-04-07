export default defineNuxtPlugin(() => {
  const originalFetch = globalThis.fetch.bind(globalThis);

  globalThis.fetch = async (input, init = {}) => {
    const headers = new Headers(init.headers);

    if (!headers.has('Authorization') && import.meta.client) {
      const token = localStorage.getItem('sb-drcfcqffjrtlxekinndk-auth-token');
      if (token) {
        try {
          const parsed = JSON.parse(token);
          if (parsed?.access_token) {
            headers.set('Authorization', `Bearer ${parsed.access_token}`);
          }
        } catch {
          throw new Error('Invalid Token ');
        }
      }
    }

    return originalFetch(input, { ...init, headers });
  };
});
