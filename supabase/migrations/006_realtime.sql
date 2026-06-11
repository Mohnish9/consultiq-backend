-- ============================================================
-- ConsultIQ — Migration 006: Realtime
-- ============================================================

-- Enable Supabase Realtime on tables that need live updates

ALTER PUBLICATION supabase_realtime ADD TABLE consultations;
ALTER PUBLICATION supabase_realtime ADD TABLE recordings;
ALTER PUBLICATION supabase_realtime ADD TABLE ai_summaries;
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Only broadcast specific columns to avoid leaking data through realtime
-- (Supabase Realtime respects RLS when replica identity is set to DEFAULT)
ALTER TABLE consultations   REPLICA IDENTITY DEFAULT;
ALTER TABLE recordings      REPLICA IDENTITY DEFAULT;
ALTER TABLE ai_summaries    REPLICA IDENTITY DEFAULT;
ALTER TABLE appointments    REPLICA IDENTITY DEFAULT;
ALTER TABLE notifications   REPLICA IDENTITY DEFAULT;
