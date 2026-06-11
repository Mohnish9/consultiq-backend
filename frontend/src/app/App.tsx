import { useState } from "react";

// Layouts
import { ConsultantLayout } from "./layouts/ConsultantLayout";
import { PatientLayout } from "./layouts/PatientLayout";
import { AuthLayout } from "./layouts/AuthLayout";

// Auth
import { LoginPage } from "./pages/auth/LoginPage";

// Consultant pages
import { DashboardPage } from "./pages/consultant/DashboardPage";
import { UploadPage } from "./pages/consultant/UploadPage";
import { ConsultationsPage } from "./pages/consultant/ConsultationsPage";
import { ConsultationDetailPage } from "./pages/consultant/ConsultationDetailPage";
import { AnalyticsPage } from "./pages/consultant/AnalyticsPage";
import { ConsultationInsightsPage } from "./pages/consultant/ConsultationInsightsPage";
import { TranscriptPage } from "./pages/consultant/TranscriptPage";
import { SettingsPage } from "./pages/consultant/SettingsPage";

// Patient pages
import { PatientDashboard } from "./pages/patient/PatientDashboard";
import { PatientConsultations } from "./pages/patient/PatientConsultations";
import { PatientConsultationDetail } from "./pages/patient/PatientConsultationDetail";
import { PatientRecordings } from "./pages/patient/PatientRecordings";
import { PatientTranscript } from "./pages/patient/PatientTranscript";
import { PatientAISummaries } from "./pages/patient/PatientAISummaries";
import { PatientRecommendations } from "./pages/patient/PatientRecommendations";
import { PatientAppointments } from "./pages/patient/PatientAppointments";
import { PatientProfile } from "./pages/patient/PatientProfile";

// Shared
import { ErrorBoundary } from "./components/shared/ErrorBoundary";

// Types & routes
import type { UserRole } from "./types/user";
import { CONSULTANT_ROUTES, PATIENT_ROUTES } from "./navigation/routes";

// ── Route metadata ──────────────────────────────────────────────────────────

const CONSULTANT_ROUTE_META: Record<string, { title: string; subtitle?: string; fullHeight?: boolean }> = {
  [CONSULTANT_ROUTES.DASHBOARD]:    { title: "Dashboard" },
  [CONSULTANT_ROUTES.UPLOAD]:       { title: "Upload Consultation" },
  [CONSULTANT_ROUTES.CONSULTATIONS]:{ title: "Consultations" },
  [CONSULTANT_ROUTES.DETAIL]:       { title: "Consultation Details", fullHeight: true },
  [CONSULTANT_ROUTES.ANALYTICS]:    { title: "Analytics" },
  [CONSULTANT_ROUTES.AI_INSIGHTS]:  { title: "AI Insights", fullHeight: true },
  [CONSULTANT_ROUTES.TRANSCRIPT]:   { title: "Transcript Viewer", fullHeight: true },
  [CONSULTANT_ROUTES.SETTINGS]:     { title: "Settings" },
};

const PATIENT_ROUTE_META: Record<string, { title: string; subtitle?: string; fullHeight?: boolean }> = {
  [PATIENT_ROUTES.DASHBOARD]:      { title: "Overview" },
  [PATIENT_ROUTES.CONSULTATIONS]:  { title: "My Consultations" },
  [PATIENT_ROUTES.DETAIL]:         { title: "Consultation Details", fullHeight: true },
  [PATIENT_ROUTES.RECORDINGS]:     { title: "Recordings" },
  [PATIENT_ROUTES.TRANSCRIPT]:     { title: "Transcript", fullHeight: true },
  [PATIENT_ROUTES.SUMMARIES]:      { title: "AI Summaries" },
  [PATIENT_ROUTES.RECOMMENDATIONS]:{ title: "Recommendations" },
  [PATIENT_ROUTES.APPOINTMENTS]:   { title: "Appointments" },
  [PATIENT_ROUTES.PROFILE]:        { title: "Profile Settings" },
};

// ── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [consultantPage, setConsultantPage] = useState(CONSULTANT_ROUTES.DASHBOARD);
  const [patientPage, setPatientPage] = useState(PATIENT_ROUTES.DASHBOARD);
  const [detailId, setDetailId] = useState<string | null>(null);

  const handleLogin = (r: UserRole) => {
    setRole(r);
    setConsultantPage(CONSULTANT_ROUTES.DASHBOARD);
    setPatientPage(PATIENT_ROUTES.DASHBOARD);
  };

  const handleLogout = () => {
    setRole(null);
    setDetailId(null);
  };

  const consultantNavigate = (target: string, id?: string) => {
    if (target === CONSULTANT_ROUTES.DETAIL && id) {
      setDetailId(id);
      setConsultantPage(CONSULTANT_ROUTES.DETAIL);
    } else {
      setConsultantPage(target);
      setDetailId(null);
    }
  };

  const patientNavigate = (target: string, id?: string) => {
    if (target === PATIENT_ROUTES.DETAIL && id) {
      setDetailId(id);
      setPatientPage(PATIENT_ROUTES.DETAIL);
    } else {
      setPatientPage(target);
      setDetailId(null);
    }
  };

  // ── Auth ──────────────────────────────────────────────────────────────────
  if (!role) {
    return (
      <ErrorBoundary>
        <AuthLayout>
          <LoginPage onLogin={handleLogin} />
        </AuthLayout>
      </ErrorBoundary>
    );
  }

  // ── Patient portal ────────────────────────────────────────────────────────
  if (role === "patient") {
    const route = PATIENT_ROUTE_META[patientPage] ?? { title: patientPage };
    return (
      <ErrorBoundary>
        <PatientLayout
          currentPage={patientPage}
          title={route.title}
          subtitle={route.subtitle}
          fullHeight={route.fullHeight}
          onNavigate={patientNavigate}
          onLogout={handleLogout}
        >
          <ErrorBoundary>
            {patientPage === PATIENT_ROUTES.DASHBOARD      && <PatientDashboard onNavigate={patientNavigate} />}
            {patientPage === PATIENT_ROUTES.CONSULTATIONS  && <PatientConsultations onNavigate={patientNavigate} />}
            {patientPage === PATIENT_ROUTES.DETAIL && detailId && <PatientConsultationDetail consultationId={detailId} onNavigate={patientNavigate} />}
            {patientPage === PATIENT_ROUTES.RECORDINGS     && <PatientRecordings onNavigate={patientNavigate} />}
            {patientPage === PATIENT_ROUTES.TRANSCRIPT     && <PatientTranscript onNavigate={patientNavigate} />}
            {patientPage === PATIENT_ROUTES.SUMMARIES      && <PatientAISummaries />}
            {patientPage === PATIENT_ROUTES.RECOMMENDATIONS&& <PatientRecommendations />}
            {patientPage === PATIENT_ROUTES.APPOINTMENTS   && <PatientAppointments />}
            {patientPage === PATIENT_ROUTES.PROFILE        && <PatientProfile />}
          </ErrorBoundary>
        </PatientLayout>
      </ErrorBoundary>
    );
  }

  // ── Consultant portal ─────────────────────────────────────────────────────
  const route = CONSULTANT_ROUTE_META[consultantPage] ?? { title: consultantPage };
  return (
    <ErrorBoundary>
      <ConsultantLayout
        currentPage={consultantPage}
        title={route.title}
        subtitle={route.subtitle}
        fullHeight={route.fullHeight}
        onNavigate={consultantNavigate}
        onLogout={handleLogout}
      >
        <ErrorBoundary>
          {consultantPage === CONSULTANT_ROUTES.DASHBOARD    && <DashboardPage onNavigate={consultantNavigate} />}
          {consultantPage === CONSULTANT_ROUTES.UPLOAD       && <UploadPage onNavigate={consultantNavigate} />}
          {consultantPage === CONSULTANT_ROUTES.CONSULTATIONS&& <ConsultationsPage onNavigate={consultantNavigate} />}
          {consultantPage === CONSULTANT_ROUTES.DETAIL && detailId && <ConsultationDetailPage consultationId={detailId} onNavigate={consultantNavigate} />}
          {consultantPage === CONSULTANT_ROUTES.ANALYTICS    && <AnalyticsPage />}
          {consultantPage === CONSULTANT_ROUTES.AI_INSIGHTS  && <ConsultationInsightsPage />}
          {consultantPage === CONSULTANT_ROUTES.TRANSCRIPT   && <TranscriptPage onNavigate={consultantNavigate} />}
          {consultantPage === CONSULTANT_ROUTES.SETTINGS     && <SettingsPage />}
        </ErrorBoundary>
      </ConsultantLayout>
    </ErrorBoundary>
  );
}
