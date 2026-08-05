import { z } from 'zod';

export const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const ProtectedAppSchema = z.object({
  appName: z.string().min(1, 'App name is required'),
  packageName: z.string().min(1, 'Package name is required'),
  category: z.string().optional().default('General'),
  iconName: z.string().optional().default('Shield'),
  lockEnabled: z.boolean().default(true),
  lockType: z.enum(['PIN', 'Password', 'Face', 'Biometric']).default('PIN'),
  pin: z.string().optional(),
  password: z.string().optional(),
  faceEnabled: z.boolean().default(true),
  biometricEnabled: z.boolean().default(true)
});

export const FaceRegisterSchema = z.object({
  embedding: z.array(z.number()),
  imageUrl: z.string().optional(),
  deviceName: z.string().optional()
});

export const FaceVerifySchema = z.object({
  embedding: z.array(z.number()),
  appName: z.string().optional(),
  deviceName: z.string().optional()
});

export const UnlockAttemptSchema = z.object({
  appId: z.string().optional(),
  appName: z.string(),
  status: z.enum(['SUCCESS', 'FAILED_PIN', 'FAILED_FACE', 'INTRUDER_DETECTED']),
  confidence: z.number().min(0).max(100).default(0),
  threatLevel: z.enum(['Low', 'Medium', 'High', 'Critical']).default('Low'),
  deviceName: z.string().default('Current Device'),
  location: z.string().default('Unknown'),
  imageUrl: z.string().optional()
});

export const AIChatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  conversationHistory: z.array(z.object({
    sender: z.enum(['user', 'ai']),
    text: z.string()
  })).optional()
});

export const AISecurityAnalysisSchema = z.object({
  recentLogs: z.array(z.any()).optional()
});
