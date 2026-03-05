const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function getToken(): string | null {
  return localStorage.getItem('access_token');
}

async function request<T>(
  path: string,
  options?: RequestInit & { skipAuth?: boolean },
): Promise<T> {
  const { skipAuth, ...rest } = options ?? {};
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...rest.headers,
  };
  const token = getToken();
  if (!skipAuth && token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message?: string }).message ?? 'Request failed');
  }
  return res.json();
}

export async function login(email: string, password: string) {
  const body = await request<{ access_token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });
  return body;
}

export async function getBalance(residentId: number) {
  return request<{ pointsBalance: number; name: string }>(
    `/residents/${residentId}/balance`,
  );
}

export async function getProfile(residentId: number) {
  return request<import('../types').Profile>(
    `/residents/${residentId}/profile`,
  );
}

export async function getGiftCards() {
  return request<import('../types').GiftCard[]>('/gift-cards', {
    skipAuth: true,
  });
}

export async function getMyGiftCards(residentId: number) {
  return request<import('../types').RedeemedGiftCard[]>(
    `/residents/${residentId}/my-gift-cards`,
  );
}

export async function getTransactions(
  residentId: number,
  page = 1,
  limit = 10,
  options?: { month?: number; year?: number },
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (options?.year != null) params.set('year', String(options.year));
  if (options?.month != null) params.set('month', String(options.month));
  return request<{
    data: import('../types').Transaction[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>(`/residents/${residentId}/transactions?${params.toString()}`);
}

export async function redeem(
  residentId: number,
  giftCardId: string,
  quantity = 1,
) {
  return request<import('../types').RedeemResponse>(
    `/residents/${residentId}/redeem`,
    {
      method: 'POST',
      body: JSON.stringify({ giftCardId, quantity }),
    },
  );
}
