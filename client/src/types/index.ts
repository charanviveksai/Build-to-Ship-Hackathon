export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  biometricsEnabled?: boolean;
}

export interface ProtectedApp {
  id: string;
  user_id: string;
  app_name: string;
  package_name: string;
  category: string;
  icon_name: string;
  lock_enabled: boolean;
  lock_type: 'PIN' | 'Password' | 'Face' | 'Biometric';
  pin_hash?: string;
  face_enabled: boolean;
  biometric_enabled: boolean;
  attempts_count: number;
  last_unlocked_at: string | null;
  created_at: string;
}

export interface UnlockLog {
  id: string;
  user_id: string;
  app_id: string | null;
  app_name: string;
  status: 'SUCCESS' | 'FAILED_PIN' | 'FAILED_FACE' | 'INTRUDER_DETECTED';
  confidence: number;
  threat_level: 'Low' | 'Medium' | 'High' | 'Critical';
  device_name: string;
  location: string;
  image_url: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'threat';
  is_read: boolean;
  created_at: string;
}

export interface DashboardStats {
  totalProtectedApps: number;
  todayAttempts: number;
  totalAttempts: number;
  unauthorizedAttempts: number;
  aiThreatScore: number;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  trustedDevicesCount: number;
  faceRecognitionStatus: string;
  faceRegisteredAt: string | null;
  unreadNotificationsCount: number;
  recentActivities: Array<{
    id: string;
    appName: string;
    status: string;
    confidence: number;
    timestamp: string;
    imageUrl: string;
    threatLevel: string;
  }>;
}

export interface AIAnalysisResult {
  riskScore: number;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  explanation: string;
  recommendations: string[];
  anomaliesDetected: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
