-- ============================================================
-- ConsultIQ — Migration 003: Triggers & Functions
-- ============================================================

-- ── updated_at auto-update ───────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'users','consultants','patients','consultations',
    'recordings','ai_summaries','appointments'
  ] LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at
       BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
      tbl, tbl
    );
  END LOOP;
END;
$$;

-- ── Audit logging trigger ────────────────────────────────────

CREATE OR REPLACE FUNCTION audit_trigger_fn()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (table_name, record_id, operation, new_data)
    VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (table_name, record_id, operation, old_data, new_data)
    VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (table_name, record_id, operation, old_data)
    VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD));
  END IF;
  RETURN NULL;
END;
$$;

DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'users','consultations','recordings','transcripts',
    'ai_summaries','recommendations','appointments'
  ] LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%s_audit
       AFTER INSERT OR UPDATE OR DELETE ON %I
       FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn()',
      tbl, tbl
    );
  END LOOP;
END;
$$;

-- ── Sync auth.users → public.users ──────────────────────────
-- Called from Edge Function on auth hook, but also available as a trigger
-- on auth.users for self-hosted / local dev.

CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  _role user_role;
  _name text;
BEGIN
  _role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::user_role,
    'patient'
  );
  _name := COALESCE(
    NEW.raw_user_meta_data->>'name',
    split_part(NEW.email, '@', 1)
  );

  INSERT INTO public.users (auth_id, email, role, name, avatar_initials)
  VALUES (
    NEW.id,
    NEW.email,
    _role,
    _name,
    upper(substring(_name FROM 1 FOR 1) ||
          COALESCE(substring(split_part(_name, ' ', 2) FROM 1 FOR 1), ''))
  )
  ON CONFLICT (auth_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Only works on self-hosted / local Supabase (auth schema accessible)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.schemata WHERE schema_name = 'auth'
  ) THEN
    EXECUTE '
      CREATE TRIGGER trg_on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user()
    ';
  END IF;
END;
$$;

-- ── Consultant / Patient profile auto-create ─────────────────

CREATE OR REPLACE FUNCTION create_role_profile()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.role = 'consultant' THEN
    INSERT INTO consultants (id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  ELSIF NEW.role = 'patient' THEN
    INSERT INTO patients (id) VALUES (NEW.id) ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_role_profile
AFTER INSERT ON users
FOR EACH ROW EXECUTE FUNCTION create_role_profile();

-- ── Storage quota update on recording change ─────────────────

CREATE OR REPLACE FUNCTION update_storage_quota()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE consultants
    SET storage_used_bytes = storage_used_bytes + NEW.file_size_bytes
    WHERE id = NEW.consultant_id;
  ELSIF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL) THEN
    UPDATE consultants
    SET storage_used_bytes = GREATEST(0, storage_used_bytes - OLD.file_size_bytes)
    WHERE id = OLD.consultant_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER trg_recordings_storage_quota
AFTER INSERT OR UPDATE OR DELETE ON recordings
FOR EACH ROW EXECUTE FUNCTION update_storage_quota();

-- ── Auto-expire past appointments ────────────────────────────

CREATE OR REPLACE FUNCTION expire_past_appointments()
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE appointments
  SET status = 'past', updated_at = now()
  WHERE status = 'upcoming'
    AND scheduled_at + (duration_minutes * interval '1 minute') < now()
    AND deleted_at IS NULL;
END;
$$;

-- ── Helper: current user's public.users row ──────────────────

CREATE OR REPLACE FUNCTION current_user_id()
RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT id FROM public.users WHERE auth_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role LANGUAGE sql STABLE AS $$
  SELECT role FROM public.users WHERE auth_id = auth.uid();
$$;