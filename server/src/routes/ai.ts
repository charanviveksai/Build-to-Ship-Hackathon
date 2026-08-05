import { Router } from 'express';
import { localStore, supabase } from '../services/supabase';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { validateBody } from '../middleware/validation';
import { AIChatSchema, AISecurityAnalysisSchema } from '../schemas';
import { analyzeThreatBehavior, chatWithSecurityAdvisor } from '../services/gemini';

const router = Router();

// POST /api/ai/security-analysis - Perform Gemini AI threat analysis
router.post('/security-analysis', authenticateToken, validateBody(AISecurityAnalysisSchema), async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id || 'demo-user-uuid-101';
    const logs = localStore.unlockLogs.filter(l => l.user_id === userId);

    const result = await analyzeThreatBehavior(logs);

    const newReport = {
      id: `report-${Date.now()}`,
      user_id: userId,
      report: result.explanation,
      risk_score: result.riskScore,
      threat_level: result.threatLevel,
      recommendation: result.recommendations.join('; '),
      analyzed_attempts: logs.length,
      created_at: new Date().toISOString()
    };

    localStore.aiReports.unshift(newReport);

    if (supabase) {
      await supabase.from('ai_reports').insert(newReport);
    }

    return res.json({
      success: true,
      analysis: {
        riskScore: result.riskScore,
        threatLevel: result.threatLevel,
        explanation: result.explanation,
        recommendations: result.recommendations,
        anomaliesDetected: result.anomaliesDetected,
        reportId: newReport.id
      }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/ai/chat - AI Security Advisor Chatbot using @google/genai
router.post('/chat', validateBody(AIChatSchema), async (req: AuthenticatedRequest, res) => {
  try {
    const { message, conversationHistory } = req.body;

    const replyText = await chatWithSecurityAdvisor(message, conversationHistory || []);

    return res.json({
      success: true,
      reply: replyText,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
