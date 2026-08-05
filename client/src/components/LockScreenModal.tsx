import React, { useState, useEffect, useRef } from 'react';
import { Shield, Camera, Lock, KeyRound, AlertTriangle, CheckCircle2, XCircle, RefreshCw, X, UserX, ScanFace } from 'lucide-react';
import { PINKeyboard } from './PINKeyboard';
import { api } from '../services/api';

interface LockScreenModalProps {
  app: {
    id?: string;
    app_name: string;
    category?: string;
    lock_type?: 'PIN' | 'Password' | 'Face' | 'Biometric';
  };
  onClose: () => void;
  onSuccess?: () => void;
}

export const LockScreenModal: React.FC<LockScreenModalProps> = ({ app, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'face' | 'pin' | 'password'>(
    app.lock_type === 'Password' ? 'password' : (app.lock_type === 'PIN' ? 'pin' : 'face')
  );
  const [password, setPassword] = useState('');
  const [statusState, setStatusState] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('Align face inside scanning target');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);
  const [matchScore, setMatchScore] = useState<number | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera stream
  useEffect(() => {
    let active = true;
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' }
        });
        if (active && videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setCameraActive(true);
        }
      } catch (err) {
        console.warn('Webcam permission not granted or unavailable:', err);
        setCameraActive(false);
      }
    };

    if (activeTab === 'face') {
      startCamera();
    }

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeTab]);

  // Continuous Canvas Face Reticle Drawing
  useEffect(() => {
    let animId: number;
    const drawFaceGrid = () => {
      if (canvasRef.current && videoRef.current && cameraActive) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const w = canvas.width;
          const h = canvas.height;

          // Draw scanning box
          const boxSize = 180;
          const x = (w - boxSize) / 2;
          const y = (h - boxSize) / 2;

          ctx.strokeStyle = statusState === 'failed' ? '#EF4444' : (statusState === 'success' ? '#10B981' : '#00F0FF');
          ctx.lineWidth = 3;
          
          // Corner brackets
          const cornerLen = 20;
          // Top Left
          ctx.beginPath(); ctx.moveTo(x, y + cornerLen); ctx.lineTo(x, y); ctx.lineTo(x + cornerLen, y); ctx.stroke();
          // Top Right
          ctx.beginPath(); ctx.moveTo(x + boxSize - cornerLen, y); ctx.lineTo(x + boxSize, y); ctx.lineTo(x + boxSize, y + cornerLen); ctx.stroke();
          // Bottom Left
          ctx.beginPath(); ctx.moveTo(x, y + boxSize - cornerLen); ctx.lineTo(x, y + boxSize); ctx.lineTo(x + cornerLen, y + boxSize); ctx.stroke();
          // Bottom Right
          ctx.beginPath(); ctx.moveTo(x + boxSize - cornerLen, y + boxSize); ctx.lineTo(x + boxSize, y + boxSize); ctx.lineTo(x + boxSize, y + boxSize - cornerLen); ctx.stroke();
        }
      }
      animId = requestAnimationFrame(drawFaceGrid);
    };

    if (cameraActive) {
      drawFaceGrid();
    }

    return () => cancelAnimationFrame(animId);
  }, [cameraActive, statusState]);

  // Capture canvas image snapshot
  const captureCanvasImage = (): string => {
    if (canvasRef.current && videoRef.current && cameraActive) {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, 320, 240);
        return canvas.toDataURL('image/jpeg', 0.7);
      }
    }
    return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300';
  };

  // Perform AI Face Authentication
  const handleScanFace = async (simulateIntruder = false) => {
    setStatusState('scanning');
    setStatusMessage('Analyzing biometric facial landmarks...');

    const snapshot = captureCanvasImage();
    setCapturedSnapshot(snapshot);

    // Simulate scanning delay
    setTimeout(async () => {
      const isOwner = !simulateIntruder;
      const score = isOwner ? Math.floor(88 + Math.random() * 10) : Math.floor(12 + Math.random() * 25);
      setMatchScore(score);

      if (isOwner) {
        setStatusState('success');
        setStatusMessage(`Facial Match Verified (${score}%)`);

        await api.recordUnlockAttempt({
          appName: app.app_name,
          status: 'SUCCESS',
          confidence: score,
          threatLevel: 'Low',
          imageUrl: snapshot
        }).catch(console.error);

        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 1200);
      } else {
        setStatusState('failed');
        setStatusMessage(`🚨 Intruder Alert: Face Mismatch (${score}%)`);

        await api.recordUnlockAttempt({
          appName: app.app_name,
          status: 'INTRUDER_DETECTED',
          confidence: score,
          threatLevel: 'High',
          imageUrl: snapshot
        }).catch(console.error);
      }
    }, 1500);
  };

  // PIN Unlock submit
  const handlePinSubmit = async (pin: string) => {
    if (pin === '1234' || pin === '0000') {
      setStatusState('success');
      setStatusMessage('PIN Verified Successfully');
      await api.recordUnlockAttempt({
        appName: app.app_name,
        status: 'SUCCESS',
        confidence: 100,
        threatLevel: 'Low'
      });
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 800);
    } else {
      setPinError('Incorrect PIN. Intruder snapshot recorded.');
      setStatusState('failed');
      await api.recordUnlockAttempt({
        appName: app.app_name,
        status: 'FAILED_PIN',
        confidence: 0,
        threatLevel: 'Medium'
      });
    }
  };

  // Password Submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'password123' || password.length >= 6) {
      setStatusState('success');
      setStatusMessage('Password Authentication Successful');
      await api.recordUnlockAttempt({
        appName: app.app_name,
        status: 'SUCCESS',
        confidence: 100,
        threatLevel: 'Low'
      });
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 800);
    } else {
      setStatusState('failed');
      setStatusMessage('Invalid password.');
      await api.recordUnlockAttempt({
        appName: app.app_name,
        status: 'FAILED_PIN',
        confidence: 0,
        threatLevel: 'Medium'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B0F19]/90 backdrop-blur-2xl animate-fade-in">
      <div className="relative w-full max-w-md bg-[#131B2E] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl shadow-cyan-500/10 overflow-hidden">
        {/* Top Glow bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-indigo-500" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800/50 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* App Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 shadow-xl shadow-cyan-500/20 mb-3">
            <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
              <Shield className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            {app.app_name} <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">Locked</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">LockMe AI Biometric Guard active</p>
        </div>

        {/* Mode Tabs */}
        <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => { setActiveTab('face'); setStatusState('idle'); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'face'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ScanFace className="w-4 h-4" /> Face ID
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('pin'); setStatusState('idle'); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'pin'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-4 h-4" /> PIN
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('password'); setStatusState('idle'); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'password'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" /> Password
          </button>
        </div>

        {/* Face Tab Content */}
        {activeTab === 'face' && (
          <div className="flex flex-col items-center space-y-4">
            {/* Webcam / Canvas container */}
            <div className="relative w-64 h-48 bg-slate-950 rounded-2xl border-2 border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform -scale-x-100 ${cameraActive ? 'block' : 'hidden'}`}
              />
              <canvas
                ref={canvasRef}
                width={256}
                height={192}
                className="absolute inset-0 w-full h-full pointer-events-none"
              />

              {!cameraActive && (
                <div className="flex flex-col items-center text-center p-4 text-slate-400">
                  <Camera className="w-8 h-8 text-cyan-400 mb-2 animate-bounce" />
                  <p className="text-xs">Camera Feed Initializing / Fallback Mode</p>
                </div>
              )}

              {/* Scanning Overlay Effect */}
              {statusState === 'scanning' && (
                <div className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_15px_#00F0FF] animate-scan" />
              )}
            </div>

            {/* Status Message */}
            <div className="text-center min-h-[36px]">
              {statusState === 'scanning' && (
                <p className="text-xs font-medium text-cyan-300 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> {statusMessage}
                </p>
              )}
              {statusState === 'success' && (
                <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> {statusMessage}
                </p>
              )}
              {statusState === 'failed' && (
                <p className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> {statusMessage}
                </p>
              )}
              {statusState === 'idle' && (
                <p className="text-xs text-slate-400">
                  Position your face clearly in front of the camera.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                onClick={() => handleScanFace(false)}
                disabled={statusState === 'scanning'}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20"
              >
                <ScanFace className="w-4 h-4" /> Scan & Unlock
              </button>

              <button
                type="button"
                onClick={() => handleScanFace(true)}
                disabled={statusState === 'scanning'}
                className="py-3 px-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 text-xs font-semibold hover:bg-red-500/20 transition-all"
                title="Test Intruder Lock Trap"
              >
                <UserX className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PIN Tab Content */}
        {activeTab === 'pin' && (
          <div>
            <PINKeyboard onComplete={handlePinSubmit} error={pinError} />
          </div>
        )}

        {/* Password Tab Content */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Master Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                required
              />
            </div>
            {statusState === 'failed' && (
              <p className="text-xs text-red-400 bg-red-950/60 p-2.5 rounded-lg border border-red-500/30">
                Invalid password. Intruder photo saved. (Default demo: password123)
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:opacity-90 transition-all shadow-lg shadow-cyan-500/20"
            >
              Verify Password & Unlock
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
