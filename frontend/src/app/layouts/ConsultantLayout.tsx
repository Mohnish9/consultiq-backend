import { ReactNode } from "react";
import { Sidebar } from "../navigation/Sidebar";
import { TopBar } from "../navigation/TopBar";

interface ConsultantLayoutProps {
  children: ReactNode;
  currentPage: string;
  title: string;
  subtitle?: string;
  fullHeight?: boolean;
  onNavigate: (page: string, id?: string) => void;
  onLogout: () => void;
}

export function ConsultantLayout({
  children,
  currentPage,
  title,
  subtitle,
  fullHeight = false,
  onNavigate,
  onLogout,
}: ConsultantLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
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
