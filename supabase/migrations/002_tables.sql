-- ============================================================
-- ConsultIQ — Migration 002: Core Tables
-- ============================================================

-- ── Audit helper ────────────────────────────────────────────

CREATE TABLE audit_log (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name    text NOT NULL,
  record_id     uuid NOT NULL,
  operation     text NOT NULL,          -- INSERT | UPDATE | DELETE
  old_data      jsonb,
  new_data      jsonb,
  changed_by    uuid,                   -- users.id (nullable for system ops)
  changed_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_table_record ON audit_log (table_name, record_id);
CREATE INDEX idx_audit_changed_at   ON audit_log (changed_at DESC);

-- ── users ───────────────────────────────────────────────────

CREATE TABLE users (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Mirrors auth.users.id so we can join on it
  auth_id          uuid UNIQUE,
  email            varchar(255) UNIQUE NOT NULL,
  password_hash    varchar(255),        -- null when using Supabase Auth only
  role             user_role NOT NULL,
  name             varchar(255) NOT NULL,
  avatar_initials  varchar(4),
  is_active        boolean NOT NULL DEFAULT true,
  deleted_at       timestamptz,         -- soft-delete
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email     ON users (email);
CREATE INDEX idx_users_role      ON users (role);
CREATE INDEX idx_users_auth_id   ON users (auth_id);

-- ── consultants ─────────────────────────────────────────────

CREATE TABLE consultants (
  id                    uuid PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  organization          varchar(255),
  specialty             varchar(255),
  bio                   text,
  phone                 varchar(30),
  clinic_name           varchar(255),
  storage_used_bytes    bigint NOT NULL DEFAULT 0,
  storage_limit_bytes   bigint NOT NULL DEFAULT 107374182400,  -- 100 GB
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- ── patients ────────────────────────────────────────────────

CREATE TABLE patients (
  id                             uuid PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  date_of_birth                  date,
  gender                         varchar(30),
  blood_group                    varchar(10),
  allergies                      text,
  address                        text,
  city                           varchar(100),
  state                          varchar(100),
  phone                          varchar(30),
  emergency_contact_name         varchar(255),
  emergency_contact_relationship varchar(100),
  emergency_contact_phone        varchar(30),
  created_at                     timestamptz NOT NULL DEFAULT now(),
  updated_at                     timestamptz NOT NULL DEFAULT now()
);

-- ── consultations ───────────────────────────────────────────

CREATE TABLE consultations (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id       uuid NOT NULL REFERENCES patients (id),
  consultant_id    uuid NOT NULL REFERENCES consultants (id),
  date             date NOT NULL,
  duration_minutes integer,
  type             varchar(100),
  status           consultation_status NOT NULL DEFAULT 'pending',
  ai_status        ai_status NOT NULL DEFAULT 'pending',
  recording_status recording_status NOT NULL DEFAULT 'none',
  notes            text,
  created_by       uuid REFERENCES users (id),
  deleted_at       timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_consultations_patient    ON consultations (patient_id);
CREATE INDEX idx_consultations_consultant ON consultations (consultant_id);
CREATE INDEX idx_consultations_date       ON consultations (date DESC);
CREATE INDEX idx_consultations_status     ON consultations (status);
CREATE INDEX idx_consultations_ai_status  ON consultations (ai_status);
-- Full-text search on notes
CREATE INDEX idx_consultations_notes_fts  ON consultations USING gin (to_tsvector('english', coalesce(notes, '')));

-- ── recordings ──────────────────────────────────────────────

CREATE TABLE recordings (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id  uuid NOT NULL REFERENCES consultations (id),
  patient_id       uuid NOT NULL REFERENCES patients (id),
  consultant_id    uuid NOT NULL REFERENCES consultants (id),
  file_name        varchar(500) NOT NULL,
  storage_path     varchar(1000) NOT NULL,
  file_size_bytes  bigint NOT NULL,
  file_type        recording_file_type NOT NULL,
  duration_seconds integer,
  status           recording_availability NOT NULL DEFAULT 'processing',
  deleted_at       timestamptz,
  uploaded_at      timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_recordings_consultation ON recordings (consultation_id);
CREATE INDEX idx_recordings_patient      ON recordings (patient_id);
CREATE INDEX idx_recordings_consultant   ON recordings (consultant_id);

-- ── transcripts ─────────────────────────────────────────────

CREATE TABLE transcripts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id  uuid NOT NULL UNIQUE REFERENCES consultations (id),
  recording_id     uuid REFERENCES recordings (id),
  content          jsonb NOT NULL DEFAULT '[]',
  language         varchar(10) NOT NULL DEFAULT 'en',
  word_count       integer,
  model            varchar(100),
  generated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_transcripts_consultation ON transcripts (consultation_id);
CREATE INDEX idx_transcripts_content_fts
  ON transcripts USING gin (
    jsonb_to_tsvector('english', content, '["string"]')
  );

-- ── ai_summaries ────────────────────────────────────────────

CREATE TABLE ai_summaries (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id  uuid NOT NULL UNIQUE REFERENCES consultations (id),
  patient_id       uuid NOT NULL REFERENCES patients (id),
  consultant_id    uuid NOT NULL REFERENCES consultants (id),
  summary          text NOT NULL,
  key_takeaways    jsonb NOT NULL DEFAULT '[]',
  action_items     jsonb NOT NULL DEFAULT '[]',
  keywords         jsonb NOT NULL DEFAULT '[]',
  sentiment        sentiment_type,
  risk_level       risk_level_type,
  follow_up_date   date,
  confidence_score numeric(4,3) CHECK (confidence_score BETWEEN 0 AND 1),
  model            varchar(100),
  generated_at     timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_summaries_consultation ON ai_summaries (consultation_id);
CREATE INDEX idx_ai_summaries_patient      ON ai_summaries (patient_id);
CREATE INDEX idx_ai_summaries_risk_level   ON ai_summaries (risk_level);
CREATE INDEX idx_ai_summaries_sentiment    ON ai_summaries (sentiment);

-- ── recommendations ─────────────────────────────────────────

CREATE TABLE recommendations (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id       uuid NOT NULL REFERENCES patients (id),
  consultation_id  uuid NOT NULL REFERENCES consultations (id),
  ai_summary_id    uuid REFERENCES ai_summaries (id),
  category         recommendation_category NOT NULL,
  description      text NOT NULL,
  priority         priority_type NOT NULL DEFAULT 'Medium',
  completed        boolean NOT NULL DEFAULT false,
  completed_at     timestamptz,
  deleted_at       timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_recommendations_patient      ON recommendations (patient_id);
CREATE INDEX idx_recommendations_consultation ON recommendations (consultation_id);
CREATE INDEX idx_recommendations_completed    ON recommendations (completed);

-- ── appointments ────────────────────────────────────────────

CREATE TABLE appointments (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id       uuid NOT NULL REFERENCES patients (id),
  consultant_id    uuid NOT NULL REFERENCES consultants (id),
  consultation_id  uuid REFERENCES consultations (id),
  scheduled_at     timestamptz NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  type             varchar(100),
  mode             appointment_mode NOT NULL DEFAULT 'Video',
  status           appointment_status NOT NULL DEFAULT 'upcoming',
  cancel_reason    text,
  notes            text,
  deleted_at       timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_appointments_patient      ON appointments (patient_id);
CREATE INDEX idx_appointments_consultant   ON appointments (consultant_id);
CREATE INDEX idx_appointments_scheduled_at ON appointments (scheduled_at DESC);
CREATE INDEX idx_appointments_status       ON appointments (status);

-- ── notifications ───────────────────────────────────────────

CREATE TABLE notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users (id),
  type        varchar(100) NOT NULL,
  payload     jsonb NOT NULL DEFAULT '{}',
  read        boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user    ON notifications (user_id, read);
CREATE INDEX idx_notifications_created ON notifications (created_at DESC);