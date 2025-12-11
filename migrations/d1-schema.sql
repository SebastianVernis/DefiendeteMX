-- ============================================
-- Defiéndete MX - Cloudflare D1 Database Schema
-- Version: 2.0.0
-- Date: 2025-12-11
-- ============================================

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  date_of_birth TEXT,
  gender TEXT CHECK(gender IN ('MASCULINO', 'FEMENINO', 'NO_BINARIO', 'PREFIERO_NO_DECIR', 'OTRO')),

  -- Address (JSON)
  address TEXT,

  -- Emergency Contacts (JSON array)
  emergency_contacts TEXT,

  -- Account Status
  is_active INTEGER DEFAULT 1,
  is_verified INTEGER DEFAULT 0,
  verification_token TEXT,
  verification_token_expires TEXT,

  -- Password Reset
  reset_password_token TEXT,
  reset_password_expires TEXT,

  -- Refresh Tokens (JSON array)
  refresh_tokens TEXT,

  -- Role
  role TEXT DEFAULT 'USER' CHECK(role IN ('USER', 'ADMIN', 'MODERATOR', 'LEGAL_ADVISOR')),

  -- Premium Status
  is_premium INTEGER DEFAULT 0,
  premium_expires_at TEXT,

  -- Privacy Settings (JSON)
  privacy_settings TEXT,

  -- Metadata
  last_login TEXT,
  login_attempts INTEGER DEFAULT 0,
  lock_until TEXT,

  -- Soft Delete
  is_deleted INTEGER DEFAULT 0,
  deleted_at TEXT,

  -- Timestamps
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active, is_deleted);
CREATE INDEX IF NOT EXISTS idx_users_created ON users(created_at DESC);

-- ============================================
-- ISSUES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS issues (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,

  -- Basic Information
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'NUEVO' CHECK(status IN ('NUEVO', 'EN_PROCESO', 'REQUIERE_ATENCION', 'RESUELTO', 'CERRADO', 'ARCHIVADO')),
  priority TEXT NOT NULL DEFAULT 'MEDIO' CHECK(priority IN ('BAJO', 'MEDIO', 'ALTO', 'EMERGENCIA', 'CRITICO')),

  -- Category
  category TEXT NOT NULL CHECK(category IN (
    'VIOLENCIA_DOMESTICA', 'VIOLENCIA_FISICA', 'VIOLENCIA_PSICOLOGICA',
    'VIOLENCIA_SEXUAL', 'VIOLENCIA_ECONOMICA', 'ACOSO', 'ACOSO_LABORAL',
    'ACOSO_ESCOLAR', 'ABUSO_SEXUAL', 'DISCRIMINACION', 'AMENAZAS', 'OTRO'
  )),
  subcategory TEXT,

  -- Incident (JSON)
  incident TEXT,

  -- Perpetrator (JSON)
  perpetrator TEXT,

  -- Victim (JSON)
  victim TEXT,

  -- Safety Assessment (JSON)
  safety_assessment TEXT,

  -- Evidence Files (JSON array)
  evidence_files TEXT,

  -- Emergency Contacts (JSON array)
  emergency_contacts TEXT,

  -- Legal Case (JSON)
  legal_case TEXT,

  -- Support Services (JSON)
  support_services TEXT,

  -- Status History (JSON array)
  status_history TEXT,

  -- Notes (JSON array)
  notes TEXT,

  -- Follow-up Actions (JSON array)
  follow_up_actions TEXT,

  -- Metadata
  source TEXT DEFAULT 'WEB' CHECK(source IN ('WEB', 'MOBILE', 'PHONE', 'IN_PERSON', 'REFERRAL')),
  referred_by TEXT,
  tags TEXT, -- JSON array

  -- Soft Delete
  is_deleted INTEGER DEFAULT 0,
  deleted_at TEXT,
  deleted_by TEXT,

  -- Timestamps
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_viewed_at TEXT,
  resolved_at TEXT,
  closed_at TEXT,

  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_issues_user ON issues(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_status ON issues(status, priority DESC);
CREATE INDEX IF NOT EXISTS idx_issues_category ON issues(category);
CREATE INDEX IF NOT EXISTS idx_issues_deleted ON issues(is_deleted, status);
CREATE INDEX IF NOT EXISTS idx_issues_user_status ON issues(user_id, status, is_deleted);

-- ============================================
-- CHATS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS chats (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_id TEXT NOT NULL UNIQUE,

  -- Chat Info
  title TEXT,
  messages TEXT, -- JSON array

  -- Context (JSON)
  context TEXT,

  -- Crisis Detection (JSON)
  crisis_detection TEXT,

  -- Status
  status TEXT DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'ENDED', 'TRANSFERRED', 'ARCHIVED')),

  -- Feedback (JSON)
  feedback TEXT,
  overall_satisfaction INTEGER,

  -- Metadata
  language TEXT DEFAULT 'es',
  device_info TEXT, -- JSON
  analytics TEXT, -- JSON

  -- Related Issue
  related_issue_id TEXT,

  -- Timestamps
  started_at TEXT NOT NULL,
  last_message_at TEXT NOT NULL,
  ended_at TEXT,

  -- Soft Delete
  is_deleted INTEGER DEFAULT 0,
  deleted_at TEXT,

  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (related_issue_id) REFERENCES issues(id)
);

CREATE INDEX IF NOT EXISTS idx_chats_user ON chats(user_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_chats_session ON chats(session_id);
CREATE INDEX IF NOT EXISTS idx_chats_status ON chats(status);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,

  -- Type & Category
  type TEXT NOT NULL CHECK(type IN ('SMS', 'EMAIL', 'PUSH', 'IN_APP')),
  category TEXT NOT NULL CHECK(category IN ('EMERGENCY', 'ALERT', 'REMINDER', 'UPDATE', 'MARKETING', 'SYSTEM')),
  priority TEXT DEFAULT 'MEDIUM' CHECK(priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL')),

  -- Recipient (JSON)
  recipient TEXT NOT NULL,

  -- Sender (JSON)
  sender TEXT,

  -- Message (JSON)
  message TEXT NOT NULL,

  -- Relations
  related_issue_id TEXT,
  related_user_id TEXT,

  -- Status
  status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'SCHEDULED', 'SENT', 'DELIVERED', 'FAILED', 'CANCELLED')),

  -- Delivery (JSON)
  delivery TEXT,

  -- Provider Info (JSON)
  provider TEXT,

  -- Error (JSON)
  error TEXT,

  -- Metadata (JSON)
  metadata TEXT,

  -- Scheduling
  scheduled_for TEXT,
  expires_at TEXT,

  -- Batch Processing
  batch_id TEXT,
  batch_size INTEGER,
  batch_index INTEGER,

  -- User Actions (JSON)
  user_actions TEXT,

  -- Soft Delete
  is_deleted INTEGER DEFAULT 0,

  -- Timestamps
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  FOREIGN KEY (related_issue_id) REFERENCES issues(id),
  FOREIGN KEY (related_user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(related_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON notifications(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_notifications_batch ON notifications(batch_id);

-- ============================================
-- VOICE RECORDINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS voice_recordings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  issue_id TEXT,

  -- File Info
  filename TEXT NOT NULL,
  duration INTEGER, -- seconds
  file_size INTEGER, -- bytes
  mime_type TEXT,

  -- Storage
  storage_url TEXT NOT NULL,
  storage_provider TEXT DEFAULT 'LOCAL',

  -- Recording Info
  recorded_at TEXT NOT NULL,
  location TEXT, -- JSON

  -- Transcription (JSON)
  transcription TEXT,

  -- Emotion Analysis (JSON)
  emotion_analysis TEXT,

  -- Analysis Status
  analysis_status TEXT DEFAULT 'PENDING' CHECK(analysis_status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED')),
  analysis_error TEXT,

  -- Emergency Detection
  is_emergency INTEGER DEFAULT 0,
  emergency_keywords TEXT, -- JSON array

  -- Security
  is_encrypted INTEGER DEFAULT 0,
  expires_at TEXT,
  auto_delete_after_days INTEGER DEFAULT 30,

  -- Metadata
  tags TEXT, -- JSON array
  notes TEXT,

  -- Soft Delete
  is_deleted INTEGER DEFAULT 0,
  deleted_at TEXT,

  -- Timestamps
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (issue_id) REFERENCES issues(id)
);

CREATE INDEX IF NOT EXISTS idx_voice_user ON voice_recordings(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_voice_issue ON voice_recordings(issue_id);
CREATE INDEX IF NOT EXISTS idx_voice_emergency ON voice_recordings(is_emergency);
CREATE INDEX IF NOT EXISTS idx_voice_expires ON voice_recordings(expires_at);

-- ============================================
-- GOVERNMENT REPORTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS government_reports (
  id TEXT PRIMARY KEY,
  report_number TEXT NOT NULL UNIQUE,

  -- Report Type
  report_type TEXT NOT NULL CHECK(report_type IN (
    'FGR_DENUNCIA', 'FGR_SEGUIMIENTO', 'POLICIA_REPORTE', 'EMERGENCIAS_911',
    'GUARDIA_NACIONAL', 'CNDH_QUEJA', 'CONAVIM', 'OTRO'
  )),

  -- Target Entity
  target_entity TEXT NOT NULL CHECK(target_entity IN (
    'FGR', 'POLICIA_FEDERAL', 'EMERGENCIAS_911', 'GUARDIA_NACIONAL', 'CNDH', 'CONAVIM', 'OTRO'
  )),

  -- Relations
  issue_id TEXT NOT NULL,
  user_id TEXT NOT NULL,

  -- Status
  status TEXT DEFAULT 'BORRADOR' CHECK(status IN (
    'BORRADOR', 'VALIDANDO', 'LISTO_ENVIAR', 'ENVIADO', 'EN_REVISION',
    'ACEPTADO', 'RECHAZADO', 'REQUERIMIENTOS', 'SEGUIMIENTO', 'CERRADO'
  )),

  -- Report Data (JSON)
  report_data TEXT NOT NULL,

  -- Submission (JSON)
  submission TEXT,

  -- Government Response (JSON)
  government_response TEXT,

  -- Follow-up (JSON)
  follow_up TEXT,

  -- Exports (JSON array)
  exports TEXT,

  -- Audit Log (JSON array)
  audit_log TEXT,

  -- Security
  is_confidential INTEGER DEFAULT 1,
  encryption_status TEXT,

  -- Metadata
  priority TEXT DEFAULT 'MEDIO' CHECK(priority IN ('BAJO', 'MEDIO', 'ALTO', 'URGENTE')),
  tags TEXT, -- JSON array
  notes TEXT, -- JSON array

  -- Soft Delete
  is_deleted INTEGER DEFAULT 0,
  deleted_at TEXT,

  -- Timestamps
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,

  FOREIGN KEY (issue_id) REFERENCES issues(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_reports_number ON government_reports(report_number);
CREATE INDEX IF NOT EXISTS idx_reports_user ON government_reports(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_issue ON government_reports(issue_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON government_reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_type ON government_reports(report_type);

-- ============================================
-- ANALYTICS & METADATA TABLES
-- ============================================

-- API Usage Logs (for monitoring)
CREATE TABLE IF NOT EXISTS api_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  response_time INTEGER, -- milliseconds
  ip_address TEXT,
  user_agent TEXT,
  error_message TEXT,
  request_body_size INTEGER,
  response_body_size INTEGER,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_api_logs_user ON api_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_logs_endpoint ON api_logs(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_logs_status ON api_logs(status_code);
CREATE INDEX IF NOT EXISTS idx_api_logs_created ON api_logs(created_at DESC);

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- Active users count
CREATE VIEW IF NOT EXISTS v_active_users AS
SELECT COUNT(*) as count
FROM users
WHERE is_active = 1 AND is_deleted = 0;

-- Issues summary by status
CREATE VIEW IF NOT EXISTS v_issues_by_status AS
SELECT
  status,
  COUNT(*) as count,
  COUNT(CASE WHEN priority IN ('EMERGENCIA', 'CRITICO') THEN 1 END) as high_priority_count
FROM issues
WHERE is_deleted = 0
GROUP BY status;

-- Recent notifications
CREATE VIEW IF NOT EXISTS v_recent_notifications AS
SELECT
  id,
  type,
  category,
  status,
  related_user_id,
  created_at
FROM notifications
WHERE is_deleted = 0
ORDER BY created_at DESC
LIMIT 100;

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Users
CREATE TRIGGER IF NOT EXISTS update_users_timestamp
AFTER UPDATE ON users
BEGIN
  UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Issues
CREATE TRIGGER IF NOT EXISTS update_issues_timestamp
AFTER UPDATE ON issues
BEGIN
  UPDATE issues SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Chats
CREATE TRIGGER IF NOT EXISTS update_chats_timestamp
AFTER UPDATE ON chats
BEGIN
  UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Notifications
CREATE TRIGGER IF NOT EXISTS update_notifications_timestamp
AFTER UPDATE ON notifications
BEGIN
  UPDATE notifications SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Voice Recordings
CREATE TRIGGER IF NOT EXISTS update_voice_recordings_timestamp
AFTER UPDATE ON voice_recordings
BEGIN
  UPDATE voice_recordings SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Government Reports
CREATE TRIGGER IF NOT EXISTS update_government_reports_timestamp
AFTER UPDATE ON government_reports
BEGIN
  UPDATE government_reports SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- ============================================
-- SEED DATA (OPTIONAL)
-- ============================================

-- Sample user for testing (password: TestPass123!)
-- Password hash generated with bcryptjs
/*
INSERT INTO users (
  id, email, password, full_name, role,
  is_active, is_verified, privacy_settings,
  created_at, updated_at
) VALUES (
  'test-user-123',
  'test@defiendete.mx',
  '$2a$10$VKNxVx.HN6dLaBX8PdBbFuL7rPdZ8N5vZvC3qYOqN5LxQ5YxYPMSi',
  'Usuario de Prueba',
  'USER',
  1,
  1,
  '{"shareLocation": false, "allowNotifications": true, "publicProfile": false}',
  datetime('now'),
  datetime('now')
);
*/

-- ============================================
-- MAINTENANCE QUERIES
-- ============================================

-- Clean expired refresh tokens (run periodically)
/*
UPDATE users
SET refresh_tokens = json_remove(
  refresh_tokens,
  json_each.key
)
FROM json_each(users.refresh_tokens)
WHERE json_extract(json_each.value, '$.expiresAt') < datetime('now');
*/

-- Clean expired voice recordings (run daily)
/*
UPDATE voice_recordings
SET is_deleted = 1, deleted_at = datetime('now')
WHERE expires_at < datetime('now') AND is_deleted = 0;
*/

-- ============================================
-- STATISTICS QUERIES
-- ============================================

-- Total users
-- SELECT COUNT(*) FROM users WHERE is_deleted = 0;

-- Active issues
-- SELECT COUNT(*) FROM issues WHERE status NOT IN ('RESUELTO', 'CERRADO') AND is_deleted = 0;

-- Today's notifications
-- SELECT COUNT(*) FROM notifications WHERE date(created_at) = date('now');

-- Average response time
-- SELECT AVG(response_time) FROM api_logs WHERE created_at >= datetime('now', '-1 day');

-- ============================================
-- END OF SCHEMA
-- ============================================
