-- ============================================================
-- ConsultIQ — Migration 004: Row Level Security
-- ============================================================

-- Enable RLS on every table
ALTER TABLE users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultants     ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients        ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE recordings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcripts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_summaries    ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log       ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────
-- HELPER: reusable role checks (inline, not functions, for perf)
-- ─────────────────────────────────────────────────────────────

-- ── users ───────────────────────────────────────────────────

-- Anyone can read their own row; admins read all
CREATE POLICY users_select ON users FOR SELECT
  USING (
    auth_id = auth.uid()
    OR current_user_role() = 'admin'
  );

CREATE POLICY users_update ON users FOR UPDATE
  USING (auth_id = auth.uid() OR current_user_role() = 'admin')
  WITH CHECK (auth_id = auth.uid() OR current_user_role() = 'admin');

-- INSERT handled by Edge Function / trigger only (no direct client insert)
CREATE POLICY users_insert ON users FOR INSERT
  WITH CHECK (current_user_role() = 'admin');

-- Soft-delete only (set deleted_at) — admin only for hard security
CREATE POLICY users_delete ON users FOR DELETE
  USING (current_user_role() = 'admin');

-- ── consultants ─────────────────────────────────────────────

CREATE POLICY consultants_select ON consultants FOR SELECT
  USING (
    id = current_user_id()
    OR current_user_role() IN ('admin', 'consultant')
  );

CREATE POLICY consultants_update ON consultants FOR UPDATE
  USING (id = current_user_id() OR current_user_role() = 'admin');

CREATE POLICY consultants_insert ON consultants FOR INSERT
  WITH CHECK (id = current_user_id() OR current_user_role() = 'admin');

-- ── patients ────────────────────────────────────────────────

CREATE POLICY patients_select ON patients FOR SELECT
  USING (
    id = current_user_id()
    OR current_user_role() IN ('admin', 'consultant')
  );

CREATE POLICY patients_update ON patients FOR UPDATE
  USING (id = current_user_id() OR current_user_role() = 'admin');

CREATE POLICY patients_insert ON patients FOR INSERT
  WITH CHECK (id = current_user_id() OR current_user_role() = 'admin');

-- ── consultations ───────────────────────────────────────────

CREATE POLICY consultations_select ON consultations FOR SELECT
  USING (
    deleted_at IS NULL
    AND (
      current_user_role() = 'admin'
      OR consultant_id = current_user_id()   -- consultant sees own
      OR patient_id    = current_user_id()   -- patient sees own
    )
  );

CREATE POLICY consultations_insert ON consultations FOR INSERT
  WITH CHECK (
    current_user_role() IN ('admin', 'consultant')
  );

CREATE POLICY consultations_update ON consultations FOR UPDATE
  USING (
    deleted_at IS NULL
    AND (
      current_user_role() = 'admin'
      OR consultant_id = current_user_id()
    )
  );

CREATE POLICY consultations_delete ON consultations FOR DELETE
  USING (current_user_role() = 'admin');

-- ── recordings ──────────────────────────────────────────────

CREATE POLICY recordings_select ON recordings FOR SELECT
  USING (
    deleted_at IS NULL
    AND (
      current_user_role() = 'admin'
      OR consultant_id = current_user_id()
      OR patient_id    = current_user_id()
    )
  );

CREATE POLICY recordings_insert ON recordings FOR INSERT
  WITH CHECK (
    current_user_role() IN ('admin', 'consultant')
    AND consultant_id = current_user_id()
  );

CREATE POLICY recordings_update ON recordings FOR UPDATE
  USING (
    current_user_role() = 'admin'
    OR consultant_id = current_user_id()
  );

CREATE POLICY recordings_delete ON recordings FOR DELETE
  USING (current_user_role() = 'admin');

-- ── transcripts ─────────────────────────────────────────────

CREATE POLICY transcripts_select ON transcripts FOR SELECT
  USING (
    current_user_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM consultations c
      WHERE c.id = consultation_id
        AND c.deleted_at IS NULL
        AND (c.consultant_id = current_user_id() OR c.patient_id = current_user_id())
    )
  );

-- Only service role / Edge Functions write transcripts
CREATE POLICY transcripts_insert ON transcripts FOR INSERT
  WITH CHECK (current_user_role() = 'admin');

CREATE POLICY transcripts_update ON transcripts FOR UPDATE
  USING (current_user_role() = 'admin');

-- ── ai_summaries ────────────────────────────────────────────

CREATE POLICY ai_summaries_select ON ai_summaries FOR SELECT
  USING (
    current_user_role() = 'admin'
    OR consultant_id = current_user_id()
    OR patient_id    = current_user_id()
  );

CREATE POLICY ai_summaries_insert ON ai_summaries FOR INSERT
  WITH CHECK (current_user_role() = 'admin');

CREATE POLICY ai_summaries_update ON ai_summaries FOR UPDATE
  USING (current_user_role() = 'admin');

-- ── recommendations ─────────────────────────────────────────

CREATE POLICY recommendations_select ON recommendations FOR SELECT
  USING (
    deleted_at IS NULL
    AND (
      current_user_role() = 'admin'
      OR patient_id = current_user_id()
      OR EXISTS (
        SELECT 1 FROM consultations c
        WHERE c.id = consultation_id
          AND c.consultant_id = current_user_id()
      )
    )
  );

CREATE POLICY recommendations_insert ON recommendations FOR INSERT
  WITH CHECK (
    current_user_role() IN ('admin', 'consultant')
  );

CREATE POLICY recommendations_update ON recommendations FOR UPDATE
  USING (
    current_user_role() = 'admin'
    OR patient_id = current_user_id()   -- patient can mark complete
    OR EXISTS (
      SELECT 1 FROM consultations c
      WHERE c.id = consultation_id AND c.consultant_id = current_user_id()
    )
  );

-- ── appointments ────────────────────────────────────────────

CREATE POLICY appointments_select ON appointments FOR SELECT
  USING (
    deleted_at IS NULL
    AND (
      current_user_role() = 'admin'
      OR patient_id    = current_user_id()
      OR consultant_id = current_user_id()
    )
  );

CREATE POLICY appointments_insert ON appointments FOR INSERT
  WITH CHECK (
    current_user_role() IN ('admin', 'consultant')
  );

CREATE POLICY appointments_update ON appointments FOR UPDATE
  USING (
    current_user_role() = 'admin'
    OR consultant_id = current_user_id()
  );

CREATE POLICY appointments_delete ON appointments FOR DELETE
  USING (current_user_role() = 'admin');

-- ── notifications ────────────────────────────────────────────

CREATE POLICY notifications_select ON notifications FOR SELECT
  USING (user_id = current_user_id() OR current_user_role() = 'admin');

CREATE POLICY notifications_update ON notifications FOR UPDATE
  USING (user_id = current_user_id());

-- ── audit_log ────────────────────────────────────────────────

CREATE POLICY audit_admin_only ON audit_log FOR SELECT
  USING (current_user_role() = 'admin');