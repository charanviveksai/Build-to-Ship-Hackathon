import { Router } from 'express';
import { localStore } from '../services/supabase';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

const defaultSettings = {
  biometricsEnabled: true,
  autoLockDelaySeconds: 0,
  captureIntruderPhoto: true,
  instantNotifications: true,
  faceConfidenceThreshold: 85,
  masterPinConfigured: true,
  stealthMode: false,
  zeroTrustPolicy: true
};

// GET /api/settings
router.get('/', authenticateToken, (req: AuthenticatedRequest, res) => {
  return res.json({ success: true, settings: defaultSettings });
});

// PUT /api/settings
router.put('/', authenticateToken, (req: AuthenticatedRequest, res) => {
  Object.assign(defaultSettings, req.body);
  return res.json({ success: true, settings: defaultSettings, message: 'Settings updated successfully' });
});

export default router;
