import { useAuth } from '@clerk/nextjs';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api';

async function fetchWithAuth<T>(
  token: string,
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({
      message: 'Unknown error',
    }));

    throw new Error(error.message ?? `API error ${res.status}`);
  }

  if (res.status === 204) {
    return null as T;
  }

  return res.json() as Promise<T>;
}

export function useApi() {
  const { getToken } = useAuth();

  const getAuthToken = async () => {
    const token = await getToken();
    if (!token) throw new Error('Not authenticated');
    return token;
  };

  return {
    get: async <T>(path: string): Promise<T> => {
      const token = await getAuthToken();
      return fetchWithAuth<T>(token, path);
    },

    post: async <T>(path: string, body?: unknown): Promise<T> => {
      const token = await getAuthToken();
      return fetchWithAuth<T>(token, path, {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      });
    },

    patch: async <T>(path: string, body?: unknown): Promise<T> => {
      const token = await getAuthToken();
      return fetchWithAuth<T>(token, path, {
        method: 'PATCH',
        body: body ? JSON.stringify(body) : undefined,
      });
    },

    delete: async <T>(path: string): Promise<T> => {
      const token = await getAuthToken();
      return fetchWithAuth<T>(token, path, { method: 'DELETE' });
    },
  };
}