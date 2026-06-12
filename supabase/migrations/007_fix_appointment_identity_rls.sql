-- ============================================================
-- ConsultIQ — Migration 007: Appointment identity/RLS fixes
-- ============================================================
-- Appointment foreign keys point at public.users-backed role profiles
-- (patients.id / consultants.id), not auth.users.id. Consultants may only
-- create or mutate appointments for their own public consultant profile.

-- RLS policies call these helpers from policies on public.users itself. They
-- must run as the migration owner so the lookup from auth.uid() to
-- public.users.id/role does not recursively re-enter public.users RLS.
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.users WHERE auth_id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE auth_id = auth.uid();
$$;

DROP POLICY IF EXISTS appointments_insert ON appointments;
CREATE POLICY appointments_insert ON appointments FOR INSERT
  WITH CHECK (
    current_user_role() = 'admin'
    OR (
      current_user_role() = 'consultant'
      AND consultant_id = current_user_id()
    )
  );

DROP POLICY IF EXISTS appointments_update ON appointments;
CREATE POLICY appointments_update ON appointments FOR UPDATE
  USING (
    current_user_role() = 'admin'
    OR consultant_id = current_user_id()
  )
  WITH CHECK (
    current_user_role() = 'admin'
    OR consultant_id = current_user_id()
  );
