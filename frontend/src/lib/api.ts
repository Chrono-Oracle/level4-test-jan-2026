const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

// Import your types
import type { Contact, User } from "@/types";

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText);
    throw new Error(message || `Request failed with ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  // Contact Methods
  getContacts: () => request<Contact[]>('/contacts'),
  
  createContact: (body: {
    fullname: string;
    phone: number;
    email: string;
  }) => request<Contact>('/contacts/add', {
    method: 'POST',
    body: JSON.stringify(body),
  }),

  updateContact: (id: string, body: Partial<Contact>) =>
    request<Contact>(`/contacts/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  deleteContact: (id: string) =>
    request<void>(`/contacts/remove/${id}`, { method: 'DELETE' }),

  
  // User Methods
  createUser: (body: { 
    first_name: string; 
    last_name: string; 
    category: string
  }) =>
    request<User>('/users/create', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};