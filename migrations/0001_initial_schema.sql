-- DefiendeteMX Database Schema for Cloudflare D1
-- Migration: 0001_initial_schema
-- Date: 2024-12-10

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth TEXT,
  gender TEXT CHECK (gender IN ('MASCULINO', 'FEMENINO', 'NO_BINARIO', 'PREFIERO_NO_DECIR', 'OTRO')),
  
  -- Address (JSON)
  address TEXT DEFAULT '{}',
  
  -- Emergency Contacts (JSON array)
  emergency_contacts TEXT DEFAULT '[]',
  
  -- Account Status
  is_active INTEGER DEFAULT 1,
  is_verified INTEGER DEFAULT 0,
  verification_token TEXT,
  verification_token_expires TEXT,
  
  -- Password Reset
  reset_password_token TEXT,
  reset_password_expires TEXT,
  
  -- Refresh Tokens (JSON array)
  refresh_tokens TEXT DEFAULT '[]',
  
  -- Role
  role TEXT DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN', 'MODERATOR', 'LEGAL_ADVISOR')),
  
  -- Premium
  is_premium INTEGER DEFAULT 0,
  premium_expires_at TEXT,
  
  -- Privacy Settings (JSON)
  privacy_settings TEXT DEFAULT '{"shareLocation":false,"allowNotifications":true,"publicProfile":false}',
  
  -- Metadata
  last_login TEXT,
  login_attempts INTEGER DEFAULT 0,
  lock_until TEXT,
  
  -- Soft Delete
  is_deleted INTEGER DEFAULT 0,
  deleted_at TEXT,
  
  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active, is_deleted);
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at);

-- ============================================
-- ISSUES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS issues (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id),
  
  -- Basic Info
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'NUEVO' CHECK (status IN ('NUEVO', 'EN_PROCESO', 'REQUIERE_ATENCION', 'RESUELTO', 'CERRADO', 'ARCHIVADO')),
  priority TEXT DEFAULT 'MEDIO' CHECK (priority IN ('BAJO', 'MEDIO', 'ALTO', 'EMERGENCIA', 'CRITICO')),
  
  -- Category
  category TEXT NOT NULL CHECK (category IN (
    'VIOLENCIA_DOMESTICA', 'VIOLENCIA_FISICA', 'VIOLENCIA_PSICOLOGICA', 
    'VIOLENCIA_SEXUAL', 'VIOLENCIA_ECONOMICA', 'ACOSO', 'ACOSO_LABORAL', 
    'ACOSO_ESCOLAR', 'ABUSO_SEXUAL', 'DISCRIMINACION', 'AMENAZAS', 'OTRO'
  )),
  subcategory TEXT,
  
  -- Incident Details (JSON)
  incident TEXT DEFAULT '{}',
  
  -- Perpetrator Info (JSON)
  perpetrator TEXT DEFAULT '{}',
  
  -- Victim Info (JSON)
  victim TEXT DEFAULT '{}',
  
  -- Safety Assessment (JSON)
  safety_assessment TEXT DEFAULT '{"riskLevel":"MEDIO","immediateDanger":false}',
  
  -- Evidence Files (JSON array)
  evidence_files TEXT DEFAULT '[]',
  
  -- Emergency Contacts (JSON array)
  emergency_contacts TEXT DEFAULT '[]',
  
  -- Legal Case (JSON)
  legal_case TEXT DEFAULT '{}',
  
  -- Support Services (JSON)
  support_services TEXT DEFAULT '{}',
  
  -- Status History (JSON array)
  status_history TEXT DEFAULT '[]',
  
  -- Notes (JSON array)
  notes TEXT DEFAULT '[]',
  
  -- Follow-up Actions (JSON array)
  follow_up_actions TEXT DEFAULT '[]',
  
  -- Tags
  tags TEXT DEFAULT '[]',
  
  -- Soft Delete
  is_deleted INTEGER DEFAULT 0,
  deleted_at TEXT,
  
  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_issues_user ON issues(user_id);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_category ON issues(category);
CREATE INDEX IF NOT EXISTS idx_issues_priority ON issues(priority);
CREATE INDEX IF NOT EXISTS idx_issues_created ON issues(created_at);
CREATE INDEX IF NOT EXISTS idx_issues_deleted ON issues(is_deleted);

-- ============================================
-- CHATS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id),
  session_id TEXT UNIQUE NOT NULL,
  
  -- Basic Info
  title TEXT,
  
  -- Messages (JSON array)
  messages TEXT DEFAULT '[]',
  
  -- Context (JSON)
  context TEXT DEFAULT '{"legalScenario":"GENERAL","emotionalState":"UNKNOWN","riskLevel":"LOW","needsEmergencyHelp":false}',
  
  -- Crisis Detection (JSON)
  crisis_detection TEXT DEFAULT '{"detected":false,"interventionTriggered":false}',
  
  -- Status
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'ENDED', 'ARCHIVED')),
  
  -- Feedback (JSON)
  feedback TEXT,
  overall_satisfaction INTEGER CHECK (overall_satisfaction BETWEEN 1 AND 5),
  
  -- Settings
  language TEXT DEFAULT 'es' CHECK (language IN ('es', 'en')),
  device_info TEXT DEFAULT '{}',
  
  -- Analytics (JSON)
  analytics TEXT DEFAULT '{"totalMessages":0,"userMessages":0,"assistantMessages":0}',
  
  -- Related Issue
  related_issue_id TEXT REFERENCES issues(id),
  
  -- Timestamps
  started_at TEXT DEFAULT (datetime('now')),
  last_message_at TEXT DEFAULT (datetime('now')),
  ended_at TEXT,
  
  -- Soft Delete
  is_deleted INTEGER DEFAULT 0,
  deleted_at TEXT,
  
  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_chats_user ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_session ON chats(session_id);
CREATE INDEX IF NOT EXISTS idx_chats_status ON chats(status);
CREATE INDEX IF NOT EXISTS idx_chats_started ON chats(started_at);
CREATE INDEX IF NOT EXISTS idx_chats_deleted ON chats(is_deleted);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  
  -- Type and Category
  type TEXT NOT NULL CHECK (type IN ('SMS', 'EMAIL', 'PUSH', 'IN_APP')),
  category TEXT NOT NULL CHECK (category IN (
    'EMERGENCY_ALERT', 'ISSUE_UPDATE', 'STATUS_CHANGE', 
    'COURT_REMINDER', 'SAFETY_CHECK', 'SYSTEM_NOTIFICATION', 'CUSTOM'
  )),
  priority TEXT DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL')),
  
  -- Recipient (JSON)
  recipient TEXT NOT NULL,
  
  -- Sender (JSON)
  sender TEXT DEFAULT '{}',
  
  -- Message (JSON)
  message TEXT NOT NULL,
  
  -- Related Entities
  related_issue_id TEXT REFERENCES issues(id),
  related_user_id TEXT REFERENCES users(id),
  
  -- Status
  status TEXT DEFAULT 'PENDING' CHECK (status IN (
    'PENDING', 'QUEUED', 'SENDING', 'SENT', 'DELIVERED', 
    'FAILED', 'BOUNCED', 'REJECTED', 'CANCELLED'
  )),
  
  -- Delivery (JSON)
  delivery TEXT DEFAULT '{"attempts":0,"maxAttempts":3}',
  
  -- Provider (JSON)
  provider TEXT DEFAULT '{}',
  
  -- Error (JSON)
  error TEXT,
  
  -- Metadata (JSON)
  metadata TEXT DEFAULT '{}',
  
  -- Scheduling
  scheduled_for TEXT,
  expires_at TEXT,
  
  -- Batch Info
  batch_id TEXT,
  batch_size INTEGER,
  batch_index INTEGER,
  
  -- User Actions (JSON)
  user_actions TEXT DEFAULT '{"opened":false,"clicked":false,"dismissed":false}',
  
  -- Compliance
  consent_given INTEGER DEFAULT 0,
  consent_timestamp TEXT,
  opted_out INTEGER DEFAULT 0,
  opted_out_at TEXT,
  
  -- Soft Delete
  is_deleted INTEGER DEFAULT 0,
  deleted_at TEXT,
  
  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_category ON notifications(category);
CREATE INDEX IF NOT EXISTS idx_notifications_related_issue ON notifications(related_issue_id);
CREATE INDEX IF NOT EXISTS idx_notifications_batch ON notifications(batch_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- ============================================
-- GOVERNMENT_REPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS government_reports (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  report_number TEXT UNIQUE NOT NULL,
  
  -- Type and Entity
  report_type TEXT NOT NULL CHECK (report_type IN (
    'FGR_DENUNCIA', 'POLICIA_REPORTE', 'EMERGENCIA_911', 
    'DENUNCIA_ANONIMA', 'VIOLENCIA_DOMESTICA', 'DESAPARICION', 'OTRO'
  )),
  target_entity TEXT NOT NULL CHECK (target_entity IN (
    'FGR', 'POLICIA_FEDERAL', 'POLICIA_ESTATAL', 'POLICIA_MUNICIPAL',
    'GUARDIA_NACIONAL', 'EMERGENCIAS_911', 'CNDH', 'OTRO'
  )),
  
  -- References
  issue_id TEXT NOT NULL REFERENCES issues(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  
  -- Status
  status TEXT DEFAULT 'BORRADOR' CHECK (status IN (
    'BORRADOR', 'PENDIENTE', 'ENVIADO', 'RECIBIDO', 'EN_PROCESO',
    'REQUIERE_INFO', 'RESUELTO', 'CERRADO', 'RECHAZADO'
  )),
  
  -- Report Data (JSON)
  report_data TEXT DEFAULT '{}',
  
  -- Submission (JSON)
  submission TEXT DEFAULT '{}',
  
  -- Government Response (JSON)
  government_response TEXT DEFAULT '{}',
  
  -- Follow-up (JSON)
  follow_up TEXT DEFAULT '{}',
  
  -- Exports (JSON array)
  exports TEXT DEFAULT '[]',
  
  -- Audit Log (JSON array)
  audit_log TEXT DEFAULT '[]',
  
  -- Privacy
  is_confidential INTEGER DEFAULT 1,
  encryption_status TEXT DEFAULT 'NONE' CHECK (encryption_status IN ('NONE', 'PARTIAL', 'FULL')),
  
  -- Metadata
  priority TEXT DEFAULT 'MEDIO' CHECK (priority IN ('BAJO', 'MEDIO', 'ALTO', 'EMERGENCIA', 'CRITICO')),
  tags TEXT DEFAULT '[]',
  notes TEXT DEFAULT '[]',
  
  -- Soft Delete
  is_deleted INTEGER DEFAULT 0,
  deleted_at TEXT,
  deleted_by TEXT REFERENCES users(id),
  
  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_gov_reports_number ON government_reports(report_number);
CREATE INDEX IF NOT EXISTS idx_gov_reports_user ON government_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_gov_reports_issue ON government_reports(issue_id);
CREATE INDEX IF NOT EXISTS idx_gov_reports_status ON government_reports(status);
CREATE INDEX IF NOT EXISTS idx_gov_reports_type ON government_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_gov_reports_created ON government_reports(created_at);

-- ============================================
-- VOICE_RECORDINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS voice_recordings (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL REFERENCES users(id),
  issue_id TEXT REFERENCES issues(id),
  
  -- Recording Metadata
  filename TEXT NOT NULL,
  duration REAL NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT DEFAULT 'audio/webm',
  
  -- Storage
  storage_url TEXT NOT NULL,
  storage_provider TEXT DEFAULT 'LOCAL' CHECK (storage_provider IN ('LOCAL', 'CLOUDINARY', 'S3', 'AZURE')),
  
  -- Recording Context
  recorded_at TEXT DEFAULT (datetime('now')),
  location TEXT DEFAULT '{}',
  
  -- Transcription (JSON)
  transcription TEXT DEFAULT '{}',
  
  -- Emotion Analysis (JSON)
  emotion_analysis TEXT DEFAULT '{}',
  
  -- Analysis Status
  analysis_status TEXT DEFAULT 'PENDING' CHECK (analysis_status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'PARTIAL')),
  analysis_error TEXT,
  
  -- Emergency
  is_emergency INTEGER DEFAULT 0,
  emergency_keywords TEXT DEFAULT '[]',
  
  -- Security
  is_encrypted INTEGER DEFAULT 0,
  encryption_key TEXT,
  
  -- Retention
  expires_at TEXT,
  auto_delete_after_days INTEGER DEFAULT 30,
  
  -- Metadata
  tags TEXT DEFAULT '[]',
  notes TEXT,
  
  -- Soft Delete
  is_deleted INTEGER DEFAULT 0,
  deleted_at TEXT,
  deleted_by TEXT REFERENCES users(id),
  
  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_voice_user ON voice_recordings(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_issue ON voice_recordings(issue_id);
CREATE INDEX IF NOT EXISTS idx_voice_emergency ON voice_recordings(is_emergency);
CREATE INDEX IF NOT EXISTS idx_voice_status ON voice_recordings(analysis_status);
CREATE INDEX IF NOT EXISTS idx_voice_recorded ON voice_recordings(recorded_at);
CREATE INDEX IF NOT EXISTS idx_voice_deleted ON voice_recordings(is_deleted);
