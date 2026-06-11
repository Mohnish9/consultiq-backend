# ConsultIQ — OpenAPI Requirements

All endpoints are prefixed with `/v1`. Authentication via `Bearer` JWT unless marked public.

---

## Auth

### POST /v1/auth/login `[public]`

**Request:**
```json
{ "email": "string", "password": "string", "role": "consultant | patient" }
```

**Response 200:**
```json
{ "success": true, "token": "string", "user": { ...User } }
```

**Response 401:**
```json
{ "error": "INVALID_CREDENTIALS", "message": "string" }
```

---

### POST /v1/auth/logout

Invalidates the current JWT (server-side blocklist or refresh token revocation).

**Response 204:** No content

---

### GET /v1/auth/me

Returns the authenticated user's profile.

**Response 200:** `User` object

---

### POST /v1/auth/refresh `[public]`

**Request:** `{ "refreshToken": "string" }`

**Response 200:** `{ "token": "string", "refreshToken": "string" }`

---

## Consultations

### GET /v1/consultations

Query params: `page`, `pageSize`, `status`, `type`, `consultantId`, `patientId`, `search`, `sortBy`, `sortDir`

**Response 200:**
```json
{ "data": [Consultation], "total": 156, "page": 1, "pageSize": 20 }
```

---

### POST /v1/consultations

**Request:** `CreateConsultationPayload` (see DATABASE_SCHEMA.md)

**Response 201:** `Consultation`

---

### GET /v1/consultations/:id

**Response 200:** `Consultation`  
**Response 404:** Not found

---

### PUT /v1/consultations/:id

**Request:** Partial `Consultation`  
**Response 200:** Updated `Consultation`

---

### DELETE /v1/consultations/:id

**Response 204:** No content  
Soft-deletes; does not remove recordings or transcripts.

---

## Recordings

### GET /v1/recordings

Query params: `consultationId`, `patientId`, `page`, `pageSize`

**Response 200:** `{ data: [Recording], total, page, pageSize }`

---

### POST /v1/recordings/upload `[multipart/form-data]`

Fields:
- `file` — audio or video binary
- `consultationId` — string UUID

**Response 201:** `Recording`  
**Response 413:** File too large (max 500 MB enforced server-side)  
**Response 415:** Unsupported media type

---

### GET /v1/recordings/:id

**Response 200:** `Recording`

---

### DELETE /v1/recordings/:id

**Response 204:** No content

---

### GET /v1/consultations/:id/recordings

Shorthand: recordings scoped to a consultation.

**Response 200:** `Recording[]`

---

## Transcripts

### GET /v1/consultations/:id/transcript

**Response 200:**
```json
{
  "consultationId": "string",
  "lines": [{ "ts": "18:22", "speaker": "Consultant | Patient", "text": "string" }],
  "wordCount": 2847,
  "generatedAt": "ISO8601"
}
```

**Response 404:** Transcript not yet generated

---

### GET /v1/recordings/:id/transcript

Same shape as above.

---

## AI Summaries

### GET /v1/ai-summaries

Query params: `patientId`, `consultantId`, `sentiment`, `riskLevel`, `page`, `pageSize`

**Response 200:** `{ data: [AISummary], total, page, pageSize }`

---

### GET /v1/ai-summaries/:id

**Response 200:** `AISummary`

---

### GET /v1/consultations/:id/ai-summary

Fetch the AI summary for a specific consultation.

**Response 200:** `AISummary`  
**Response 202:** Processing (include `{ aiStatus: "processing", progress: 0.65 }`)  
**Response 404:** Not yet generated

---

### POST /v1/consultations/:id/ai-summary

Trigger or re-trigger AI summary generation.

**Response 202:** `{ message: "Generation started", aiStatus: "processing" }`

---

## Analytics

### GET /v1/analytics/summary

**Response 200:**
```json
{
  "totalSessions": 156,
  "avgDurationMinutes": 48,
  "activeConsultants": 8,
  "storageUsedGB": 46,
  "storageTotalGB": 100,
  "completionRatePct": 78
}
```

---

### GET /v1/analytics/monthly-trend

Query params: `months` (default 6), `consultantId`

**Response 200:**
```json
[{ "month": "Jan", "sessions": 18, "recordings": 14 }]
```

---

### GET /v1/analytics/consultant-activity

**Response 200:**
```json
[{ "name": "Dr. Arjun Rajan", "sessions": 38 }]
```

---

### GET /v1/analytics/type-distribution

**Response 200:**
```json
[{ "name": "Therapy", "value": 41, "color": "#4f46e5" }]
```

---

## Patients

### GET /v1/patients/me

Returns the authenticated patient's profile.

**Response 200:** `Patient`

---

### PUT /v1/patients/me

**Request:** Partial `Patient`  
**Response 200:** Updated `Patient`

---

### GET /v1/patients/:id

Consultants only.

**Response 200:** `Patient`

---

## Appointments

### GET /v1/appointments

Query params: `patientId`, `consultantId`, `status` (`upcoming`, `past`, `cancelled`), `page`, `pageSize`

**Response 200:** `{ data: [Appointment], total, page, pageSize }`

---

### POST /v1/appointments

**Request:**
```json
{
  "patientId": "uuid",
  "consultantId": "uuid",
  "scheduledAt": "ISO8601",
  "durationMinutes": 60,
  "type": "Therapy",
  "mode": "Video",
  "notes": "string"
}
```

**Response 201:** `Appointment`

---

### GET /v1/appointments/:id

**Response 200:** `Appointment`

---

### PUT /v1/appointments/:id

**Response 200:** Updated `Appointment`

---

### POST /v1/appointments/:id/cancel

**Request:** `{ "reason": "string" }`  
**Response 200:** `{ status: "cancelled", cancelReason: "string" }`

---

## Recommendations

### GET /v1/recommendations

Query params: `patientId`, `consultationId`, `category`, `completed`, `priority`

**Response 200:** `Recommendation[]`

---

### POST /v1/recommendations

**Request:**
```json
{
  "patientId": "uuid",
  "consultationId": "uuid",
  "category": "Exercises | Lifestyle | Medication | Tasks | Follow-up",
  "description": "string",
  "priority": "Low | Medium | High"
}
```

**Response 201:** `Recommendation`

---

### PATCH /v1/recommendations/:id/complete

Mark a recommendation as completed.

**Response 200:** `{ id, completed: true, completedAt: "ISO8601" }`

---

## Error Codes

| Code | HTTP | Meaning |
|---|---|---|
| UNAUTHORIZED | 401 | Missing or invalid token |
| FORBIDDEN | 403 | Authenticated but insufficient role/ownership |
| NOT_FOUND | 404 | Resource does not exist |
| VALIDATION_ERROR | 422 | Request body failed validation |
| FILE_TOO_LARGE | 413 | Upload exceeds 500 MB |
| UNSUPPORTED_MEDIA | 415 | File type not audio or video |
| PROCESSING | 202 | Async job is in progress |
| INTERNAL_ERROR | 500 | Unhandled server error |

---

## Authentication Headers

```
Authorization: Bearer eyJhbGci...
Content-Type: application/json        (JSON requests)
Content-Type: multipart/form-data     (file uploads — set automatically by fetch)
```

---

## Pagination

All paginated endpoints accept:

| Param | Default | Max |
|---|---|---|
| page | 1 | — |
| pageSize | 20 | 100 |
| sortBy | created_at | field name |
| sortDir | desc | asc \| desc |
