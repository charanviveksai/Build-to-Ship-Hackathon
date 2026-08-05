import { Router } from 'express';
import { localStore, supabase } from '../services/supabase';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { UnlockAttemptSchema } from '../schemas';

const router = Router();

// POST /api/unlock - Record unlock attempt
router.post('/unlock', authenticateToken, validateBody(UnlockAttemptSchema), async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user-uuid-101';
    const { appId, appName, status, confidence, threatLevel, deviceName, location, imageUrl } = req.body;

    const newLog = {
      id: `log-${Date.now()}`,
      user_id: userId,
      app_id: appId || null,
      app_name: appName,
      status, // 'SUCCESS', 'FAILED_PIN', 'FAILED_FACE', 'INTRUDER_DETECTED'
      confidence: confidence || 0,
      threat_level: threatLevel || 'Low',
      device_name: deviceName || 'iPhone 15 Pro',
      location: location || 'New York, USA',
      image_url: imageUrl || (status !== 'SUCCESS' ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'),
      created_at: new Date().toISOString()
    };

    localStore.unlockLogs.unshift(newLog);

    // If failed intruder attempt, generate immediate alert notification
    if (status !== 'SUCCESS') {
      const newNotif = {
        id: `notif-${Date.now()}`,
        user_id: userId,
        title: status === 'INTRUDER_DETECTED' ? '🚨 Intruder Detected!' : '🔑 Unauthorized Access Attempt',
        message: `An attempt to open ${appName} failed (${status}) with ${confidence}% face match.`,
        type: 'threat',
        is_read: false,
        created_at: new Date().toISOString()
      };
      localStore.notifications.unshift(newNotif);
    }

    if (supabase) {
      await supabase.from('unlock_logs').insert(newLog);
    }

    return res.status(201).json({ success: true, log: newLog });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/logs - Retrieve security attempt logs
router.get('/logs', authenticateToken, (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id || 'demo-user-uuid-101';
  const logs = localStore.unlockLogs.filter(l => l.user_id === userId);
  return res.json({ success: true, logs });
});

// GET /api/notifications - Retrieve notifications
router.get('/notifications', authenticateToken, (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id || 'demo-user-uuid-101';
  const notifications = localStore.notifications.filter(n => n.user_id === userId);
  return res.json({ success: true, notifications });
});

// PUT /api/notifications/:id/read - Mark notification read
router.put('/notifications/:id/read', authenticateToken, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id || 'demo-user-uuid-101';
  const notif = localStore.notifications.find(n => n.id === id && n.user_id === userId);
  if (notif) {
    notif.is_read = true;
  }
  return res.json({ success: true, notification: notif });
});

export default router;
