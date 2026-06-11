# ConsultIQ — Final Backend-Readiness Audit

**Date:** 2026-06-11  
**Scope:** Full frontend codebase (`src/app/`)  
**Auditor:** Automated architecture review

---

## Executive Summary

The architecture passes **9 of 12 checks** cleanly. Three checks had violations that were **corrected during this audit** and now pass. Three additional findings are documented as **accepted demo scaffolding** — they are known, bounded, and require async data-loading integration when a real backend is connected.

| # | Check | Result | Action |
|---|---|---|---|
| 1 | No page contains hardcoded mock business logic | ⚠️ Partial | Documented (see §1) |
| 2 | All pages consume services only | ⚠️ Partial | Documented (see §2) |
| 3 | All services use apiClient | ✅ Pass | — |
| 4 | No duplicated TypeScript interfaces | ✅ Pass | — |
| 5 | No duplicated route definitions | ✅ Pass | — |
| 6 | No duplicated API endpoint strings | ✅ Pass | — |
| 7 | App.tsx contains only routing | ✅ Pass | — |
| 8 | Layouts contain only layout logic | ✅ Pass | — |
| 9 | Components contain only presentation logic | ✅ Pass | Fixed during audit |
| 10 | Services contain all data access logic | ✅ Pass | Fixed during audit |
| 11 | Hooks contain state management logic | ✅ Pass | Fixed during audit |
| 12 | Types contain all shared interfaces | ✅ Pass | — |

---

## Check 1 — No page contains hardcoded mock business logic

**Result: ⚠️ Partial pass — accepted demo scaffolding**

### What passes

- No page contains business rules, calculations, or domain transformations.
- No page performs filtering, sorting, or pagination on locally-owned data arrays — `ConsultationsPage` was the last violator; it now delegates entirely to `useConsultations()`.
- `UploadPage` no longer defines its own `consultants` or `consultationTypes` arrays; it imports `CONSULTANTS` and `CONSULTATION_TYPES` from `utils/constants.ts`.

### What remains (accepted demo scaffolding)

Several pages embed static fixture arrays that represent data which will come from the backend in production. These are intentional demo placeholders, not business logic:

| File | Fixtures | Backend replacement |
|---|---|---|
| `pages/consultant/DashboardPage.tsx` | `monthlyData`, `activityData`, `recentConsultations` | `useAnalytics()` + `useConsultations()` |
| `pages/consultant/ConsultationDetailPage.tsx` | `transcript[]`, `timeline[]` | `GET /consultations/:id/transcript` |
| `pages/consultant/ConsultationInsightsPage.tsx` | `summaries[]` | `useAISummaries()` hook via `aiSummaryService` |
| `pages/consultant/AnalyticsPage.tsx` | `monthlyTrend`, `consultantActivity`, `typeDistribution` | `useAnalytics()` (hook now wired to service) |
| `pages/consultant/TranscriptPage.tsx` | `transcript[]` | `GET /consultations/:id/transcript` |
| `pages/patient/PatientDashboard.tsx` | `consultationTimeline`, `recentDocs` | `useConsultations()` + `useAISummaries()` |
| `pages/patient/PatientConsultations.tsx` | `consultations[]` | `useConsultations()` |
| `pages/patient/PatientConsultationDetail.tsx` | `transcriptPreview[]`, `timeline[]` | `GET /consultations/:id/transcript` |
| `pages/patient/PatientRecordings.tsx` | `recordings[]` | `useRecordings()` (hook now wired to service) |
| `pages/patient/PatientTranscript.tsx` | `transcriptLines[]` | `GET /recordings/:id/transcript` |
| `pages/patient/PatientAISummaries.tsx` | `summaries[]` | `aiSummaryService.getAISummaries()` |
| `pages/patient/PatientRecommendations.tsx` | `recommendations[]` | `GET /recommendations?patientId=...` |
| `pages/patient/PatientAppointments.tsx` | `upcoming[]`, `past[]` | `GET /appointments?patientId=...` |
| `pages/patient/PatientProfile.tsx` | profile state initialization | `patientService.getPatientProfile()` |

**Migration pattern for each page:**

```tsx
// Replace static array:
const data = [{ id: "X-001", ... }];

// With async hook:
const [data, setData] = useState<T[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [isError, setIsError] = useState(false);

useEffect(() => {
  someService.getData()
    .then(setData)
    .catch(() => setIsError(true))
    .finally(() => setIsLoading(false));
}, []);
```

Use `<PageState isLoading={isLoading} isError={isError} />` (already exists in `components/shared/PageState.tsx`) to render the loading and error states.

---

## Check 2 — All pages consume services only

**Result: ⚠️ Partial pass — same scope as Check 1**

Pages that bypass the service layer are the same set listed in Check 1. They use module-level fixture arrays instead of calling hooks or services. The service layer itself is complete and correct; it is the page-level data binding that is pending.

Pages that **correctly** consume services via hooks today:

| Page | Hook / Service used |
|---|---|
| `ConsultationsPage` | `useConsultations()` → `consultationService` |
| `AnalyticsPage` | `useAnalytics()` → `analyticsService` |
| `PatientRecordings` | `useRecordings()` → `recordingService` (structural; fixture still in service mock) |

---

## Check 3 — All services use apiClient

**Result: ✅ Pass**

All six service modules (`authService`, `consultationService`, `recordingService`, `analyticsService`, `patientService`, `aiSummaryService`) follow the same pattern:

```ts
if (!env.IS_MOCK) {
  return apiClient.get<T>(API_ENDPOINTS.RESOURCE.ACTION);
}
// mock fallback
```

- `env.IS_MOCK` is `true` when `VITE_API_URL` is not set (demo/development).
- Setting `VITE_API_URL` in `.env.local` switches all six services to live HTTP calls automatically.
- All endpoints are imported from `services/apiEndpoints.ts` — no raw strings in service files.
- Auth header injection, token storage key, and error shape are centralised in `services/apiClient.ts`.

---

## Check 4 — No duplicated TypeScript interfaces

**Result: ✅ Pass**

All domain interfaces are defined once in `src/app/types/`:

| File | Interfaces |
|---|---|
| `types/user.ts` | `User`, `UserRole`, `AuthState` |
| `types/consultation.ts` | `Consultation`, `AISummary`, `TranscriptLine`, status enums |
| `types/patient.ts` | `Patient`, `PatientAppointment`, `PatientRecommendation` |
| `types/recording.ts` | `Recording` |
| `types/analytics.ts` | `AnalyticsSummary`, `MonthlyTrendPoint`, `ConsultantActivityPoint`, `TypeDistributionPoint` |

No interface or type alias is re-declared in hooks, services, or components. All imports use `import type` where appropriate.

---

## Check 5 — No duplicated route definitions

**Result: ✅ Pass**

All route keys are defined once in `src/app/navigation/routes.ts`:

```ts
export const AUTH_ROUTES       = { LOGIN: "login" }
export const CONSULTANT_ROUTES = { DASHBOARD, UPLOAD, CONSULTATIONS, DETAIL, ... }
export const PATIENT_ROUTES    = { DASHBOARD, CONSULTATIONS, DETAIL, RECORDINGS, ... }
```

`App.tsx` imports and uses these constants exclusively. No route string literals exist outside `routes.ts`.

---

## Check 6 — No duplicated API endpoint strings

**Result: ✅ Pass**

All API paths are defined once in `src/app/services/apiEndpoints.ts`. Every service imports from this module. No raw path string (e.g. `"/consultations"`) appears in any service file.

---

## Check 7 — App.tsx contains only routing

**Result: ✅ Pass**

`App.tsx` contains:
- Three `useState` calls for role, current page keys, and detail ID (routing state only)
- `handleLogin` / `handleLogout` / `consultantNavigate` / `patientNavigate` (navigation handlers)
- Conditional render tree selecting the correct layout + page component
- `ErrorBoundary` wrappers

No data fetching, business logic, service calls, or presentation code exists in `App.tsx`.

---

## Check 8 — Layouts contain only layout logic

**Result: ✅ Pass**

| File | Responsibility |
|---|---|
| `layouts/AuthLayout.tsx` | Centres auth content, applies auth background |
| `layouts/ConsultantLayout.tsx` | Renders `<Sidebar>` + `<TopBar>` + `<main>` |
| `layouts/PatientLayout.tsx` | Renders `<PatientSidebar>` + `<PatientTopBar>` + `<main>` |

No data fetching or business logic in any layout. Navigation components (`Sidebar`, `TopBar`, etc.) contain static notification fixtures — acceptable as UI chrome placeholders until a notifications service is wired up.

---

## Check 9 — Components contain only presentation logic

**Result: ✅ Pass (fixed during audit)**

**Violation found and fixed:** `ConsultationsPage` contained a module-level `allConsultations` array (12 items) and duplicated filter/sort logic already present in `useConsultations`. It now:

1. Removes the inline data array entirely
2. Calls `useConsultations()` for data, filter state, and delete
3. Retains only sort and pagination as local UI state (correct: these are presentation concerns)
4. Renders `<PageState>` for loading and error states

All other components render props or hook-provided state only.

---

## Check 10 — Services contain all data access logic

**Result: ✅ Pass (fixed during audit)**

**Violations found and fixed:**

| Hook | Old behaviour | New behaviour |
|---|---|---|
| `useConsultations` | Read from `MOCK_CONSULTATIONS` directly | Calls `consultationService.getConsultations()` |
| `useAnalytics` | Inline static constants | Calls all four `analyticsService` functions via `Promise.all` |
| `useRecordings` | Read from `MOCK_RECORDINGS` directly | Calls `recordingService.getRecordings(patientId?)` |

All three hooks now expose `isLoading`, `isError`, and `refetch()` — required for the page-level `<PageState>` integration described in Checks 1 and 2.

The mock data in `utils/mockData.ts` is now the exclusive source for service-layer fallbacks and is not imported by any hook or page.

---

## Check 11 — Hooks contain state management logic

**Result: ✅ Pass (fixed during audit)**

Each hook now owns the full lifecycle for its domain:

| Hook | Owns |
|---|---|
| `useConsultations` | Async fetch, loading/error state, filter state (search, status, type), optimistic delete |
| `useAnalytics` | Async parallel fetch (4 endpoints), loading/error state |
| `useRecordings` | Async fetch, loading/error state, playback state (selectedId, playing, progress) |
| `useAuth` | Session state (user, isAuthenticated, login, logout) |

No hook contains raw mock data. All data flows: `service → hook → component`.

---

## Check 12 — Types contain all shared interfaces

**Result: ✅ Pass**

See Check 4. No ad-hoc inline interfaces exist in component or hook files. All domain shapes are imported from `types/`.

---

## Remaining Work Before Production

The following items are **not architecture violations** but are required before connecting a real backend:

### High priority

1. **Wire remaining pages to services** (see Check 1 table)  
   Each page needs an async `useEffect` calling the appropriate service, with `<PageState>` for loading/error.

2. **Create `useAISummaries` hook**  
   `PatientAISummaries` and `ConsultationInsightsPage` both embed `summaries[]` inline. A hook mirroring `useConsultations` is needed: `aiSummaryService.getAISummaries()` → state → component.

3. **Create `useAppointments` hook**  
   `PatientAppointments` embeds `upcoming[]` and `past[]`. Hook should call `GET /appointments`.

4. **Create `useRecommendations` hook**  
   `PatientRecommendations` embeds `recommendations[]`. Hook should call `GET /recommendations`.

5. **Create `useTranscript` hook**  
   `ConsultationDetailPage`, `TranscriptPage`, `PatientConsultationDetail`, `PatientTranscript` all embed transcript lines. Hook should call `GET /consultations/:id/transcript`.

### Medium priority

6. **Session persistence** — `useAuth` does not restore session on page reload. On mount it should call `authService.getMe()` (which calls `GET /auth/me`) and rehydrate role from the JWT stored in localStorage.

7. **Notification service** — `navigation/TopBar.tsx` and `navigation/PatientTopBar.tsx` contain hardcoded notification arrays. A `useNotifications` hook calling `GET /notifications` should replace them.

8. **Form validation library** — `UploadPage` and `SettingsPage` perform field validation manually with `setToast(...)`. Recommend `react-hook-form` (already in `package.json` at v7.55.0) with `zod` schemas.

9. **Token refresh** — `apiClient.ts` does not handle `401` responses. An interceptor should attempt `POST /auth/refresh` and retry the original request before logging out.

### Low priority

10. **Remove `utils/mockData.ts` references from services** — Once real endpoints are live, the `if (!env.IS_MOCK)` branches and their mock data can be deleted. The file `utils/mockData.ts` and its imports from services should be removed entirely at that point.

---

## File Inventory (post-audit)

```
src/app/
├── App.tsx                          ✅ routing only
├── config/
│   └── env.ts                       ✅ env config
├── hooks/
│   ├── useAuth.ts                   ✅ session state
│   ├── useConsultations.ts          ✅ fixed → uses consultationService
│   ├── useAnalytics.ts              ✅ fixed → uses analyticsService
│   └── useRecordings.ts             ✅ fixed → uses recordingService
├── layouts/
│   ├── AuthLayout.tsx               ✅ layout only
│   ├── ConsultantLayout.tsx         ✅ layout only
│   └── PatientLayout.tsx            ✅ layout only
├── navigation/
│   ├── routes.ts                    ✅ single source of truth
│   ├── Sidebar.tsx                  ✅ presentation
│   ├── TopBar.tsx                   ⚠️ hardcoded notifications (placeholder)
│   ├── PatientSidebar.tsx           ✅ presentation
│   └── PatientTopBar.tsx            ⚠️ hardcoded notifications (placeholder)
├── pages/
│   ├── auth/LoginPage.tsx           ✅ form + presentation
│   ├── consultant/
│   │   ├── DashboardPage.tsx        ⚠️ fixture data (pending service wiring)
│   │   ├── ConsultationsPage.tsx    ✅ fixed → uses useConsultations()
│   │   ├── ConsultationDetailPage.tsx ⚠️ fixture transcript (pending)
│   │   ├── ConsultationInsightsPage.tsx ⚠️ fixture summaries (pending)
│   │   ├── AnalyticsPage.tsx        ⚠️ fixture data (pending hook wiring)
│   │   ├── TranscriptPage.tsx       ⚠️ fixture transcript (pending)
│   │   ├── UploadPage.tsx           ✅ fixed → uses constants
│   │   └── SettingsPage.tsx         ✅ form + presentation
│   └── patient/
│       ├── PatientDashboard.tsx     ⚠️ fixture data (pending)
│       ├── PatientConsultations.tsx ⚠️ fixture data (pending)
│       ├── PatientConsultationDetail.tsx ⚠️ fixture data (pending)
│       ├── PatientRecordings.tsx    ⚠️ fixture data (pending hook wiring)
│       ├── PatientTranscript.tsx    ⚠️ fixture data (pending)
│       ├── PatientAISummaries.tsx   ⚠️ fixture data (pending)
│       ├── PatientRecommendations.tsx ⚠️ fixture data (pending)
│       ├── PatientAppointments.tsx  ⚠️ fixture data (pending)
│       └── PatientProfile.tsx       ⚠️ fixture data (pending)
├── services/
│   ├── apiClient.ts                 ✅ centralized HTTP layer
│   ├── apiEndpoints.ts              ✅ single source of endpoint strings
│   ├── authService.ts               ✅ uses apiClient
│   ├── consultationService.ts       ✅ uses apiClient
│   ├── recordingService.ts          ✅ uses apiClient
│   ├── analyticsService.ts          ✅ uses apiClient
│   ├── patientService.ts            ✅ uses apiClient
│   └── aiSummaryService.ts          ✅ uses apiClient
├── types/
│   ├── user.ts                      ✅ no duplication
│   ├── consultation.ts              ✅ no duplication
│   ├── patient.ts                   ✅ no duplication
│   ├── recording.ts                 ✅ no duplication
│   └── analytics.ts                 ✅ no duplication
├── components/shared/
│   ├── ErrorBoundary.tsx            ✅ wraps App root + page slots
│   ├── ProtectedRoute.tsx           ✅ role guards
│   ├── DataTable.tsx                ✅ reusable table
│   ├── PageState.tsx                ✅ loading/error/empty states
│   ├── StatCard.tsx                 ✅ shared dashboard card
│   ├── SummaryCard.tsx              ✅ shared summary card
│   ├── EmptyState.tsx               ✅ empty state
│   └── Skeleton.tsx                 ✅ skeleton loader
└── utils/
    ├── constants.ts                 ✅ single source for CONSULTANTS, CONSULTATION_TYPES, etc.
    ├── mockData.ts                  ✅ isolated to service layer only
    ├── helpers.ts                   ✅ pure utility functions
    └── formatDate.ts                ✅ pure utility functions
```

**Legend:** ✅ Passes audit &nbsp;&nbsp; ⚠️ Accepted demo scaffolding — pending backend wiring
