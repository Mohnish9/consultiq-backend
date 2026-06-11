# ConsultIQ — Database Schema

All timestamps are UTC. UUIDs used for all primary keys.

---

## users

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| email | varchar(255) UNIQUE NOT NULL | |
| password_hash | varchar(255) NOT NULL | bcrypt |
| role | enum('consultant','patient') NOT NULL | |
| name | varchar(255) NOT NULL | |
| avatar_initials | varchar(4) | |
| is_active | boolean DEFAULT true | |
| created_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz | |

---

## consultants

Extends `users` where `role = 'consultant'`.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK FK → users.id | |
| organization | varchar(255) | |
| specialty | varchar(255) | |
| bio | text | |
| phone | varchar(30) | |
| clinic_name | varchar(255) | |
| storage_used_bytes | bigint DEFAULT 0 | |
| storage_limit_bytes | bigint DEFAULT 107374182400 | 100 GB |

---

## patients

Extends `users` where `role = 'patient'`.

| Column | Type | Notes |
|---|---|---|
| id | uuid PK FK → users.id | |
| date_of_birth | date | |
| gender | varchar(30) | |
| blood_group | varchar(10) | |
| allergies | text | |
| address | text | |
| city | varchar(100) | |
| state | varchar(100) | |
| phone | varchar(30) | |
| emergency_contact_name | varchar(255) | |
| emergency_contact_relationship | varchar(100) | |
| emergency_contact_phone | varchar(30) | |

---

## consultations

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| patient_id | uuid FK → patients.id | |
| consultant_id | uuid FK → consultants.id | |
| date | date NOT NULL | |
| duration_minutes | integer | |
| type | varchar(100) | Therapy, Medical, Advisory, etc. |
| status | enum('pending','processing','completed') DEFAULT 'pending' | |
| ai_status | enum('pending','processing','ready','failed') DEFAULT 'pending' | |
| recording_status | enum('none','processing','uploaded') DEFAULT 'none' | |
| notes | text | |
| created_by | uuid FK → users.id | |
| created_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz | |

**Indexes:** `patient_id`, `consultant_id`, `date`, `status`

---

## recordings

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| consultation_id | uuid FK → consultations.id | |
| patient_id | uuid FK → patients.id | |
| consultant_id | uuid FK → consultants.id | |
| file_name | varchar(500) NOT NULL | Original filename |
| storage_path | varchar(1000) NOT NULL | Path in object store |
| file_size_bytes | bigint NOT NULL | |
| file_type | enum('audio','video') NOT NULL | |
| duration_seconds | integer | |
| status | enum('processing','available','error') DEFAULT 'processing' | |
| uploaded_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz | |

**Indexes:** `consultation_id`, `patient_id`

---

## transcripts

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| consultation_id | uuid FK → consultations.id UNIQUE | |
| recording_id | uuid FK → recordings.id | |
| content | jsonb NOT NULL | Array of TranscriptLine |
| language | varchar(10) DEFAULT 'en' | |
| word_count | integer | |
| generated_at | timestamptz DEFAULT now() | |
| model | varchar(100) | whisper-1, etc. |

**TranscriptLine JSON shape:**
```json
{ "ts": "18:22", "speaker": "Consultant", "text": "How are you feeling?" }
```

---

## ai_summaries

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| consultation_id | uuid FK → consultations.id UNIQUE | |
| patient_id | uuid FK → patients.id | |
| consultant_id | uuid FK → consultants.id | |
| summary | text NOT NULL | |
| key_takeaways | jsonb | string[] |
| action_items | jsonb | string[] |
| keywords | jsonb | string[] |
| sentiment | enum('positive','neutral','negative') | |
| risk_level | enum('low','medium','high') | |
| follow_up_date | date | |
| confidence_score | numeric(4,3) | 0.000 – 1.000 |
| model | varchar(100) | gpt-4o, etc. |
| generated_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz | |

**Indexes:** `consultation_id`, `patient_id`, `risk_level`, `sentiment`

---

## recommendations

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| patient_id | uuid FK → patients.id | |
| consultation_id | uuid FK → consultations.id | |
| ai_summary_id | uuid FK → ai_summaries.id | |
| category | varchar(100) | Exercises, Lifestyle, Medication, Tasks, Follow-up |
| description | text NOT NULL | |
| priority | enum('Low','Medium','High') DEFAULT 'Medium' | |
| completed | boolean DEFAULT false | |
| completed_at | timestamptz | |
| created_at | timestamptz DEFAULT now() | |

**Indexes:** `patient_id`, `consultation_id`, `completed`

---

## appointments

| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| patient_id | uuid FK → patients.id | |
| consultant_id | uuid FK → consultants.id | |
| consultation_id | uuid FK → consultations.id NULLABLE | Follow-up link |
| scheduled_at | timestamptz NOT NULL | |
| duration_minutes | integer DEFAULT 60 | |
| type | varchar(100) | Therapy, Medical, Follow-up, etc. |
| mode | enum('Video','In-Person','Phone') DEFAULT 'Video' | |
| status | enum('upcoming','past','cancelled') DEFAULT 'upcoming' | |
| cancel_reason | text | |
| notes | text | |
| created_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz | |

**Indexes:** `patient_id`, `consultant_id`, `scheduled_at`, `status`

---

## Entity Relationships

```
users
  ├── consultants (1:1)
  └── patients (1:1)

consultations
  ├── patients (N:1)
  ├── consultants (N:1)
  ├── recordings (1:1)
  ├── transcripts (1:1)
  ├── ai_summaries (1:1)
  └── recommendations (1:N)

patients
  ├── consultations (1:N)
  ├── recordings (1:N)
  ├── ai_summaries (1:N)
  ├── recommendations (1:N)
  └── appointments (1:N)

consultants
  ├── consultations (1:N)
  └── appointments (1:N)
```
