import { useState } from "react";
import { LayoutDashboard, FileText, Mic2, Sparkles, Star, Calendar, User, ChevronLeft, ChevronRight, LogOut, MessageSquare } from "lucide-react";

interface PatientSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const navItems = [
  { id: "p-dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "p-consultations", label: "My Consultations", icon: FileText },
  { id: "p-recordings", label: "Recordings", icon: Mic2 },
  { id: "p-summaries", label: "AI Summaries", icon: Sparkles },
  { id: "p-recommendations", label: "Recommendations", icon: Star },
  { id: "p-transcript", label: "Transcripts", icon: MessageSquare },
  { id: "p-appointments", label: "Appointments", icon: Calendar },
  { id: "p-profile", label: "Profile Settings", icon: User },
];

export function PatientSidebar({ currentPage, onNavigate, onLogout }: PatientSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (id: string) =>
    currentPage === id || (id === "p-consultations" && currentPage === "p-detail");

  return (
    <aside className={`relative flex flex-col h-full bg-white border-r border-border transition-all duration-200 ${collapsed ? "w-14" : "w-52"}`}>
      {/* Logo */}
      <div className={`flex items-center gap-2.5 h-14 border-b border-border px-4 ${collapsed ? "justify-center px-0" : ""}`}>
        <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center flex-shrink-0">
          <User size={14} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-foreground truncate" style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "-0.01em" }}>Patient Portal</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = isActive(id);
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "text-violet-700"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              } ${collapsed ? "justify-center" : ""}`}
              style={{ fontWeight: active ? 500 : 400, backgroundColor: active ? "rgba(124,58,237,0.07)" : undefined }}
            >
              <Icon size={15} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Patient badge */}
      {!collapsed && (
        <div className="px-3 pb-2">
          <div className="px-2.5 py-2 rounded-md bg-violet-50 border border-violet-100">
            <p className="text-violet-700" style={{ fontSize: "12px", fontWeight: 500 }}>Priya Mehta</p>
            <p className="text-violet-500" style={{ fontSize: "11px" }}>PAT-00142</p>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="px-2 pb-3 border-t border-border pt-2">
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Log out" : undefined}
        >
          <LogOut size={15} className="flex-shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[52px] w-5 h-5 rounded-full bg-white border border-border flex items-center justify-center shadow-sm hover:bg-muted z-10"
      >
        {collapsed ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
      </button>
    </aside>
  );
}
