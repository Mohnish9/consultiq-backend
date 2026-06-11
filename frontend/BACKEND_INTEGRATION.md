# ConsultIQ — Backend Integration Guide

## Overview

The frontend is currently running in **mock mode** (`VITE_API_URL` not set). When `VITE_API_URL` is defined, every service module automatically switches to real HTTP calls via `apiClient.ts`.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes (prod) | Base URL of the REST backend, e.g. `https://api.consultiq.io/v1` |
| `VITE_SUPABASE_URL` | If using Supabase | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | If using Supabase | Supabase anon/public key |
| `VITE_OPENAI_API_URL` | Optional | Proxy URL for OpenAI calls (never expose the key on the client) |

Create a `.env.local` file at the repo root:

```env
VITE_API_URL=https://api.consultiq.io/v1
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

---

## Authentication Flow

```
1. User submits email + password + role on LoginPage
2. POST /auth/login → { success, user, token }
3. Token stored in localStorage as "ciq_token"
4. All subsequent requests include: Authorization: Bearer <token>
5. On logout → POST /auth/logout + remove token
6. On app load → GET /auth/me to restore session (optional: JWT decode on client)
```

### Request — POST /auth/login

```json
{
  "email": "arjun@consultiq.io",
  "password": "secret",
  "role": "consultant"
}
```

### Response

```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": {
    "id": "U-001",
    "name": "Dr. Arjun Rajan",
    "email": "arjun@consultiq.io",
    "role": "consultant",
    "avatarInitials": "AR",
    "organization": "Apollo Wellness"
  }
}
```

---

## Consultation Flow

```
1. Consultant fills UploadPage form (patient, type, date, notes)
2. Attaches audio/video file (max 500 MB)
3. POST /consultations (metadata) → { id, ... }
4. POST /recordings/upload (multipart with file + consultationId)
5. Backend triggers async transcription pipeline
6. AI summary generated automatically after transcript is ready
7. aiStatus transitions: pending → processing → ready | failed
```

### POST /consultations

```json
{
  "patient": "Priya Mehta",
  "consultant": "Dr. Arjun Rajan",
  "date": "2026-06-11",
  "type": "Therapy",
  "notes": "Follow-up session on anxiety management.",
  "createdBy": "Dr. Arjun Rajan"
}
```

Response includes `id`, `aiStatus: "pending"`, `recordingStatus: "none"`.

### POST /recordings/upload (multipart/form-data)

Fields:
- `file` — audio or video file
- `consultationId` — ID returned from consultation create

---

## File Upload Flow

```
1. Client selects file, validates type (audio/*, video/*) and size (≤ 500 MB)
2. Builds FormData, calls apiClient.upload("/recordings/upload", formData)
3. Backend stores file in object storage (S3 / Supabase Storage)
4. Returns Recording object with status: "available"
5. Transcription job queued — recordingStatus → "processing" → "available"
```

---

## AI Summary Flow

```
1. Triggered automatically after transcript completes, OR manually by consultant
2. POST /consultations/:id/ai-summary → starts async generation
3. Client polls GET /consultations/:id/ai-summary until aiStatus === "ready"
4. Alternatively: use WebSocket / Server-Sent Events for push notification
5. Response includes summary, keyTakeaways, actionItems, keywords, sentiment, riskLevel
```

---

## Patient Flow

```
1. Patient logs in → role: "patient"
2. GET /patients/me → Patient profile
3. GET /consultations?patientId=P-001 → list of consultations
4. GET /consultations/:id → detail with AI summary link
5. GET /recordings?patientId=P-001 → list of recordings
6. GET /consultations/:id/transcript → transcript lines
7. GET /ai-summaries → patient's summaries
8. GET /appointments → upcoming + past appointments
```

---

## Consultant Flow

```
1. Consultant logs in → role: "consultant"
2. GET /consultations → all consultations (scoped to org or consultant)
3. POST /consultations + POST /recordings/upload → upload new session
4. GET /consultations/:id → detail view
5. GET /consultations/:id/transcript → transcript viewer
6. POST /consultations/:id/ai-summary → trigger AI summary
7. GET /analytics/* → dashboard charts
8. GET /analytics/summary → top-level KPIs
```

---

## Common Response Shape

All list endpoints should return:

```json
{
  "data": [...],
  "total": 156,
  "page": 1,
  "pageSize": 20
}
```

All error responses:

```json
{
  "error": "UNAUTHORIZED",
  "message": "Invalid or expired token.",
  "statusCode": 401
}
```

---

## Role-Based Access

| Resource | Consultant | Patient |
|---|---|---|
| All consultations | ✅ | Own only |
| Upload recording | ✅ | ❌ |
| Generate AI summary | ✅ | ❌ |
| View AI summary | ✅ | Own only |
| View transcript | ✅ | Own only |
| Analytics | ✅ | ❌ |
| Patient profile | Read | Read + Write own |
| Appointments | Manage | Read own |

---

## WebSocket / Real-Time (Recommended)

For AI processing status updates, use WebSocket or SSE:

```
ws://api.consultiq.io/v1/ws?token=<jwt>

Events:
  consultation.aiStatus → { consultationId, aiStatus }
  recording.transcriptReady → { recordingId, consultationId }
  appointment.reminder → { appointmentId, startsAt }
```
