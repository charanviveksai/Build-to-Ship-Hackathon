import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { localStore, supabase } from '../services/supabase';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { ProtectedAppSchema } from '../schemas';

const router = Router();

// GET /api/apps - List protected apps
router.get('/', authenticateToken, (req: AuthenticatedRequest, res) => {
  const userId = req.user?.id || 'demo-user-uuid-101';
  const apps = localStore.protectedApps.filter(a => a.user_id === userId);
  return res.json({ success: true, apps });
});

// POST /api/apps - Add protected app
router.post('/', authenticateToken, validateBody(ProtectedAppSchema), async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user-uuid-101';
    const { appName, packageName, category, iconName, lockEnabled, lockType, pin, password, faceEnabled, biometricEnabled } = req.body;

    let pin_hash = '';
    if (pin) {
      pin_hash = await bcrypt.hash(pin, 10);
    }
    let password_hash = '';
    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    const newApp = {
      id: `app-${Date.now()}`,
      user_id: userId,
      app_name: appName,
      package_name: packageName,
      category: category || 'General',
      icon_name: iconName || 'Shield',
      lock_enabled: lockEnabled !== undefined ? lockEnabled : true,
      lock_type: lockType || 'PIN',
      pin_hash,
      password_hash,
      face_enabled: faceEnabled !== undefined ? faceEnabled : true,
      biometric_enabled: biometricEnabled !== undefined ? biometricEnabled : true,
      attempts_count: 0,
      last_unlocked_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    localStore.protectedApps.unshift(newApp);

    if (supabase) {
      await supabase.from('protected_apps').insert(newApp);
    }

    return res.status(201).json({ success: true, app: newApp });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to add protected app' });
  }
});

// PUT /api/apps/:id - Update lock settings
router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'demo-user-uuid-101';

    const index = localStore.protectedApps.findIndex(a => a.id === id && a.user_id === userId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Protected app not found' });
    }

    const currentApp = localStore.protectedApps[index];
    const { lock_enabled, lock_type, pin, face_enabled, biometric_enabled } = req.body;

    let pin_hash = currentApp.pin_hash;
    if (pin) {
      pin_hash = await bcrypt.hash(pin, 10);
    }

    const updatedApp = {
      ...currentApp,
      lock_enabled: lock_enabled !== undefined ? lock_enabled : currentApp.lock_enabled,
      lock_type: lock_type || currentApp.lock_type,
      pin_hash,
      face_enabled: face_enabled !== undefined ? face_enabled : currentApp.face_enabled,
      biometric_enabled: biometric_enabled !== undefined ? biometric_enabled : currentApp.biometric_enabled
    };

    localStore.protectedApps[index] = updatedApp;

    if (supabase) {
      await supabase.from('protected_apps').update(updatedApp).eq('id', id);
    }

    return res.json({ success: true, app: updatedApp });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/apps/:id - Delete protected app
router.delete('/:id', authenticateToken, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const userId = req.user?.id || 'demo-user-uuid-101';

  localStore.protectedApps = localStore.protectedApps.filter(a => !(a.id === id && a.user_id === userId));

  if (supabase) {
    supabase.from('protected_apps').delete().eq('id', id);
  }

  return res.json({ success: true, message: 'App lock removed successfully' });
});

export default router;
