-- ============================================================
-- ConsultIQ — Migration 005: Storage Buckets & Policies
-- ============================================================
-- Run via Supabase Dashboard or `supabase db push`.
-- The storage.buckets inserts only work with the service role.
-- ============================================================

-- ── Buckets ─────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'recordings',
    'recordings',
    false,                    -- private; always use signed URLs
    524288000,                -- 500 MB
    ARRAY[
      'audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/ogg', 'audio/webm',
      'audio/aac', 'audio/flac',
      'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
      'video/x-msvideo', 'video/x-matroska'
    ]
  ),
  (
    'avatars',
    'avatars',
    true,                     -- public bucket for profile pictures
    5242880,                  -- 5 MB
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  )
ON CONFLICT (id) DO NOTHING;

-- ── Storage RLS: recordings bucket ──────────────────────────

CREATE POLICY "recordings: consultants upload own"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'recordings'
  AND current_user_role() IN ('admin', 'consultant')
);

CREATE POLICY "recordings: access own consultation"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'recordings'
  AND (
    current_user_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM recordings r
      JOIN consultations c ON c.id = r.consultation_id
      WHERE r.storage_path = name
        AND r.deleted_at IS NULL
        AND (c.consultant_id = current_user_id() OR c.patient_id = current_user_id())
    )
  )
);

CREATE POLICY "recordings: delete own"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'recordings'
  AND (
    current_user_role() = 'admin'
    OR EXISTS (
      SELECT 1 FROM recordings r
      WHERE r.storage_path = name
        AND r.consultant_id = current_user_id()
    )
  )
);

-- ── Storage RLS: avatars bucket ──────────────────────────────

CREATE POLICY "avatars: anyone can read"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "avatars: owner can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = (current_user_id())::text
);

CREATE POLICY "avatars: owner can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = (current_user_id())::text
);
