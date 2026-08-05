import { createClient } from '@supabase/supabase-js';
import { ENV } from '../config/env';

export const supabase = (ENV.SUPABASE_URL && ENV.SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY)
  : null;

// Local mock data store for seamless operation without external db config
export const localStore = {
  users: [
    {
      id: 'demo-user-uuid-101',
      email: 'alex@lockme.ai',
      name: 'Alex Rivera',
      password_hash: '$2a$10$e8R6.V5Wq7p9s.2Yg1y.ueZ3A0QYf6P/8T.4Xm6p0v3X0d7t5e6/C', // bcrypt 'password123'
      profile_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      biometrics_enabled: true,
      created_at: new Date().toISOString()
    }
  ],
  protectedApps: [
    {
      id: 'app-1',
      user_id: 'demo-user-uuid-101',
      app_name: 'WhatsApp',
      package_name: 'com.whatsapp',
      category: 'Social',
      icon_name: 'MessageCircle',
      lock_enabled: true,
      lock_type: 'Face',
      pin_hash: '$2a$10$e8R6.V5Wq7p9s.2Yg1y.ueZ3A0QYf6P/8T.4Xm6p0v3X0d7t5e6/C', // 1234
      face_enabled: true,
      biometric_enabled: true,
      attempts_count: 3,
      last_unlocked_at: new Date(Date.now() - 3600000).toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: 'app-2',
      user_id: 'demo-user-uuid-101',
      app_name: 'Banking Vault',
      package_name: 'com.chase.bank',
      category: 'Finance',
      icon_name: 'Building2',
      lock_enabled: true,
      lock_type: 'PIN',
      pin_hash: '$2a$10$e8R6.V5Wq7p9s.2Yg1y.ueZ3A0QYf6P/8T.4Xm6p0v3X0d7t5e6/C',
      face_enabled: true,
      biometric_enabled: true,
      attempts_count: 1,
      last_unlocked_at: new Date(Date.now() - 7200000).toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: 'app-3',
      user_id: 'demo-user-uuid-101',
      app_name: 'Instagram',
      package_name: 'com.instagram.android',
      category: 'Social',
      icon_name: 'Camera',
      lock_enabled: true,
      lock_type: 'Face',
      pin_hash: '',
      face_enabled: true,
      biometric_enabled: true,
      attempts_count: 0,
      last_unlocked_at: new Date(Date.now() - 14400000).toISOString(),
      created_at: new Date().toISOString()
    },
    {
      id: 'app-4',
      user_id: 'demo-user-uuid-101',
      app_name: 'Photos & Gallery',
      package_name: 'com.apple.mobileslideshow',
      category: 'Media',
      icon_name: 'Image',
      lock_enabled: true,
      lock_type: 'Password',
      pin_hash: '',
      face_enabled: true,
      biometric_enabled: true,
      attempts_count: 2,
      last_unlocked_at: new Date(Date.now() - 28800000).toISOString(),
      created_at: new Date().toISOString()
    }
  ],
  faceProfiles: [
    {
      id: 'face-1',
      user_id: 'demo-user-uuid-101',
      embedding: [0.12, -0.45, 0.88, 0.34, -0.19, 0.92, -0.05, 0.61],
      image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      device_name: 'iPhone 15 Pro Max',
      registered_at: new Date(Date.now() - 86400000 * 7).toISOString()
    }
  ],
  unlockLogs: [
    {
      id: 'log-1',
      user_id: 'demo-user-uuid-101',
      app_id: 'app-1',
      app_name: 'WhatsApp',
      status: 'INTRUDER_DETECTED',
      confidence: 18.5,
      threat_level: 'High',
      device_name: 'iPhone 15 Pro',
      location: 'New York, USA',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      created_at: new Date(Date.now() - 900000).toISOString()
    },
    {
      id: 'log-2',
      user_id: 'demo-user-uuid-101',
      app_id: 'app-2',
      app_name: 'Banking Vault',
      status: 'SUCCESS',
      confidence: 96.8,
      threat_level: 'Low',
      device_name: 'iPhone 15 Pro',
      location: 'New York, USA',
      image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'log-3',
      user_id: 'demo-user-uuid-101',
      app_id: 'app-4',
      app_name: 'Photos & Gallery',
      status: 'FAILED_PIN',
      confidence: 42.0,
      threat_level: 'Medium',
      device_name: 'iPhone 15 Pro',
      location: 'New York, USA',
      image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      created_at: new Date(Date.now() - 7200000).toISOString()
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      user_id: 'demo-user-uuid-101',
      title: '🚨 Intruder Detected',
      message: 'An unrecognized face (Match: 18.5%) attempted to open WhatsApp.',
      type: 'threat',
      is_read: false,
      created_at: new Date(Date.now() - 900000).toISOString()
    },
    {
      id: 'notif-2',
      user_id: 'demo-user-uuid-101',
      title: '🔑 Failed PIN Attempt',
      message: '2 incorrect PIN attempts recorded on Photos & Gallery.',
      type: 'warning',
      is_read: false,
      created_at: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'notif-3',
      user_id: 'demo-user-uuid-101',
      title: '✨ AI Threat Report Ready',
      message: 'Gemini AI has updated your device Threat Score to Low.',
      type: 'info',
      is_read: true,
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ],
  aiReports: [
    {
      id: 'report-1',
      user_id: 'demo-user-uuid-101',
      report: 'Analysis of recent unlock logs indicates 1 intruder anomaly on WhatsApp at 00:45 AM.',
      risk_score: 35,
      threat_level: 'Medium',
      recommendation: 'Enable Dual Authentication and decrease face matching threshold to 90%.',
      created_at: new Date().toISOString()
    }
  ]
};
