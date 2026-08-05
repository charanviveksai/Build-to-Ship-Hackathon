import { Router } from 'express';
import { localStore } from '../services/supabase';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/dashboard - Aggregated analytics statistics
router.get('/', authenticateToken, (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id || 'demo-user-uuid-101';

  const userApps = localStore.protectedApps.filter(a => a.user_id === userId);
  const userLogs = localStore.unlockLogs.filter(l => l.user_id === userId);
  const userNotifs = localStore.notifications.filter(n => n.user_id === userId);
  const faceProfile = localStore.faceProfiles.find(f => f.user_id === userId);

  const totalProtectedApps = userApps.length;
  const totalAttempts = userLogs.length;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayAttempts = userLogs.filter(l => new Date(l.created_at) >= todayStart).length;
  const unauthorizedAttempts = userLogs.filter(l => l.status !== 'SUCCESS').length;

  const latestReport = localStore.aiReports[0];
  const aiThreatScore = latestReport ? latestReport.risk_score : 18;
  const threatLevel = latestReport ? latestReport.threat_level : 'Low';

  const recentActivities = userLogs.slice(0, 5).map(l => ({
    id: l.id,
    appName: l.app_name,
    status: l.status,
    confidence: l.confidence,
    timestamp: l.created_at,
    imageUrl: l.image_url,
    threatLevel: l.threat_level
  }));

  return res.json({
    success: true,
    stats: {
      totalProtectedApps,
      todayAttempts,
      totalAttempts,
      unauthorizedAttempts,
      aiThreatScore,
      threatLevel,
      trustedDevicesCount: 2,
      faceRecognitionStatus: faceProfile ? 'Active & Registered' : 'Registration Recommended',
      faceRegisteredAt: faceProfile?.registered_at || null,
      unreadNotificationsCount: userNotifs.filter(n => !n.is_read).length,
      recentActivities
    }
  });
});

export default router;
