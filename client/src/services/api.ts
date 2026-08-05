import { User, ProtectedApp, UnlockLog, NotificationItem, DashboardStats, AIAnalysisResult } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('lockme_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers as Record<string, string> || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok || data.success === false) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
}

export const api = {
  // Auth
  signup: (payload: any) => request<{ success: boolean; token: string; user: User }>('/signup', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  
  login: (payload: any) => request<{ success: boolean; token: string; user: User }>('/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  logout: () => request<{ success: boolean }>('/logout', { method: 'POST' }),

  getMe: () => request<{ success: boolean; user: User }>('/me'),

  // Apps
  getApps: () => request<{ success: boolean; apps: ProtectedApp[] }>('/apps'),

  addApp: (payload: any) => request<{ success: boolean; app: ProtectedApp }>('/apps', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  updateApp: (id: string, payload: any) => request<{ success: boolean; app: ProtectedApp }>(`/apps/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),

  deleteApp: (id: string) => request<{ success: boolean }>(`/apps/${id}`, {
    method: 'DELETE'
  }),

  // Face
  registerFace: (payload: { embedding: number[]; imageUrl?: string; deviceName?: string }) => 
    request<{ success: boolean; faceProfile: any }>('/face/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  verifyFace: (payload: { embedding: number[]; appName?: string; deviceName?: string }) => 
    request<{ success: boolean; match: boolean; confidence: number; threatLevel: 'Low' | 'Medium' | 'High' | 'Critical' }>('/face/verify', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Security
  recordUnlockAttempt: (payload: {
    appId?: string;
    appName: string;
    status: 'SUCCESS' | 'FAILED_PIN' | 'FAILED_FACE' | 'INTRUDER_DETECTED';
    confidence: number;
    threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    deviceName?: string;
    location?: string;
    imageUrl?: string;
  }) => request<{ success: boolean; log: UnlockLog }>('/unlock', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  getLogs: () => request<{ success: boolean; logs: UnlockLog[] }>('/logs'),

  getNotifications: () => request<{ success: boolean; notifications: NotificationItem[] }>('/notifications'),

  markNotificationRead: (id: string) => request<{ success: boolean }>(`/notifications/${id}/read`, {
    method: 'PUT'
  }),

  // AI
  getSecurityAnalysis: () => request<{ success: boolean; analysis: AIAnalysisResult }>('/ai/security-analysis', {
    method: 'POST',
    body: JSON.stringify({})
  }),

  sendChatMessage: (message: string, history: Array<{ sender: 'user' | 'ai'; text: string }>) => 
    request<{ success: boolean; reply: string; timestamp: string }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, conversationHistory: history })
    }),

  // Dashboard & Settings
  getDashboardStats: () => request<{ success: boolean; stats: DashboardStats }>('/dashboard'),

  getSettings: () => request<{ success: boolean; settings: any }>('/settings'),

  updateSettings: (payload: any) => request<{ success: boolean; settings: any }>('/settings', {
    method: 'PUT',
    body: JSON.stringify(payload)
  })
};
