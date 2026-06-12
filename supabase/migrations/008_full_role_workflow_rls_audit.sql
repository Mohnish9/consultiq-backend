-- ============================================================
-- ConsultIQ — Migration 008: Full role workflow RLS audit
-- ============================================================
-- Tightens write policies so frontend/API behavior matches public.users-backed
-- identities and role separation across consultations, recordings,
-- recommendations, appointments, and notifications.

-- Consultations: consultants may only write consultations assigned to their own
-- public consultant profile; admins may write any consultation.
DROP POLICY IF EXISTS consultations_insert ON consultations;
CREATE POLICY consultations_insert ON consultations FOR INSERT
  WITH CHECK (
    current_user_role() = 'admin'
    OR (
      current_user_role() = 'consultant'
      AND consultant_id = current_user_id()
      AND created_by = current_user_id()
    )
  );

DROP POLICY IF EXISTS consultations_update ON consultations;
CREATE POLICY consultations_update ON consultations FOR UPDATE
  USING (
    deleted_at IS NULL
    AND (
      current_user_role() = 'admin'
      OR consultant_id = current_user_id()
    )
  )
  WITH CHECK (
    current_user_role() = 'admin'
    OR consultant_id = current_user_id()
  );

-- Recordings: consultants may only update their own recording metadata; admins
-- retain full update access. Inserts already require consultant_id=current user.
DROP POLICY IF EXISTS recordings_update ON recordings;
CREATE POLICY recordings_update ON recordings FOR UPDATE
  USING (
    current_user_role() = 'admin'
    OR consultant_id = current_user_id()
  )
  WITH CHECK (
    current_user_role() = 'admin'
    OR consultant_id = current_user_id()
  );

-- Recommendations: consultant-created recommendations must belong to one of the
-- consultant's consultations and to that consultation's patient.
DROP POLICY IF EXISTS recommendations_insert ON recommendations;
CREATE POLICY recommendations_insert ON recommendations FOR INSERT
  WITH CHECK (
    current_user_role() = 'admin'
    OR (
      current_user_role() = 'consultant'
      AND EXISTS (
        SELECT 1 FROM consultations c
        WHERE c.id = consultation_id
          AND c.deleted_at IS NULL
          AND c.consultant_id = current_user_id()
          AND c.patient_id = recommendations.patient_id
      )
    )
  );

DROP POLICY IF EXISTS recommendations_update ON recommendations;
CREATE POLICY recommendations_update ON recommendations FOR UPDATE
  USING (
    current_user_role() = 'admin'
    OR patient_id = current_user_id()
    OR EXISTS (
      SELECT 1 FROM consultations c
      WHERE c.id = consultation_id
        AND c.deleted_at IS NULL
        AND c.consultant_id = current_user_id()
    )
  )
  WITH CHECK (
    current_user_role() = 'admin'
    OR patient_id = current_user_id()
    OR EXISTS (
      SELECT 1 FROM consultations c
      WHERE c.id = consultation_id
        AND c.deleted_at IS NULL
        AND c.consultant_id = current_user_id()
    )
  );

-- Appointments: preserve consultant self-assignment from migration 007 and add
-- update WITH CHECK so reschedules/cancellations cannot move ownership. Patient
-- cancellation, if enabled, is mediated through the scoped Edge Function.
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

-- Notifications remain system-created, but users/admins can mark their visible
-- notifications read without changing ownership.
DROP POLICY IF EXISTS notifications_update ON notifications;
CREATE POLICY notifications_update ON notifications FOR UPDATE
  USING (user_id = current_user_id() OR current_user_role() = 'admin')
  WITH CHECK (user_id = current_user_id() OR current_user_role() = 'admin');
