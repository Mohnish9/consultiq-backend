import { ReactNode } from "react";
import { PatientSidebar } from "../navigation/PatientSidebar";
import { PatientTopBar } from "../navigation/PatientTopBar";

interface PatientLayoutProps {
  children: ReactNode;
  currentPage: string;
  title: string;
  subtitle?: string;
  fullHeight?: boolean;
  onNavigate: (page: string, id?: string) => void;
  onLogout: () => void;
}

export function PatientLayout({
  children,
  currentPage,
  title,
  subtitle,
  fullHeight = false,
  onNavigate,
  onLogout,
}: PatientLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <PatientSidebar currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <PatientTopBar
          title={title}
          subtitle={subtitle}
          onNavigate={onNavigate}
          onLogout={onLogout}
        />
        <main className={`flex-1 ${fullHeight ? "overflow-hidden flex flex-col" : "overflow-y-auto"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
