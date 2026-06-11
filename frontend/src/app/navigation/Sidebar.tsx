import { useState } from "react";
import {
  LayoutDashboard, Upload, FileText, BarChart2,
  Sparkles, Settings, ChevronLeft, ChevronRight, Zap, LogOut,
} from "lucide-react";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "upload", label: "Upload", icon: Upload },
  { id: "consultations", label: "Consultations", icon: FileText },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "ai-insights", label: "AI Insights", icon: Sparkles },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`relative flex flex-col h-full bg-white border-r border-border transition-all duration-200 ${collapsed ? "w-14" : "w-52"}`}>
      {/* Logo */}
      <div className={`flex items-center gap-2.5 h-14 border-b border-border px-4 ${collapsed ? "justify-center px-0" : ""}`}>
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <Zap size={14} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-foreground truncate" style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "-0.01em" }}>ConsultIQ</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = currentPage === id || (id === "consultations" && currentPage === "detail");
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              title={collapsed ? label : undefined}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-primary/8 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              } ${collapsed ? "justify-center" : ""}`}
              style={{ fontWeight: active ? 500 : 400, backgroundColor: active ? "rgba(79,70,229,0.07)" : undefined }}
            >
              <Icon size={15} className="flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Workspace badge */}
      {!collapsed && (
        <div className="px-3 pb-2">
          <div className="px-2.5 py-2 rounded-md bg-muted/60 border border-border/50">
            <p className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>Apollo Wellness</p>
            <p className="text-xs text-muted-foreground/60">Pro · 8 consultants</p>
          </div>
        </div>
      )}

      {/* Bottom */}
      <div className="px-2 pb-3 border-t border-border pt-2">
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={15} className="flex-shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[52px] w-5 h-5 rounded-full bg-white border border-border flex items-center justify-center shadow-sm hover:bg-muted transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
      </button>
    </aside>
  );
}
