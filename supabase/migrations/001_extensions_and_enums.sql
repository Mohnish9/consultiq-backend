-- ============================================================
-- ConsultIQ — Migration 001: Extensions & Enums
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- Full-text / trigram search
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ── Enums ───────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('consultant', 'patient', 'admin');

CREATE TYPE consultation_status AS ENUM ('pending', 'processing', 'completed', 'archived');

CREATE TYPE ai_status AS ENUM ('pending', 'processing', 'ready', 'failed');

CREATE TYPE recording_status AS ENUM ('none', 'processing', 'uploaded', 'error');

CREATE TYPE recording_file_type AS ENUM ('audio', 'video');

CREATE TYPE recording_availability AS ENUM ('processing', 'available', 'error');

CREATE TYPE sentiment_type AS ENUM ('positive', 'neutral', 'negative');

CREATE TYPE risk_level_type AS ENUM ('low', 'medium', 'high');

CREATE TYPE priority_type AS ENUM ('Low', 'Medium', 'High');

CREATE TYPE appointment_mode AS ENUM ('Video', 'In-Person', 'Phone');

CREATE TYPE appointment_status AS ENUM ('upcoming', 'past', 'cancelled');

CREATE TYPE recommendation_category AS ENUM (
  'Exercises', 'Lifestyle', 'Medication', 'Tasks', 'Follow-up'
);
