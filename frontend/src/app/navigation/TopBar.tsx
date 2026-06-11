import { useState } from "react";
import { Bell, Search, ChevronDown, Settings, LogOut } from "lucide-react";

interface TopBarProps {
  title: string;
  subtitle?: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const notifications = [
  { id: 1, text: "C-1048 analysis complete — AI summary ready", time: "4m ago", unread: true },
  { id: 2, text: "Dr. Sunita Patel uploaded 2 new recordings", time: "31m ago", unread: true },
  { id: 3, text: "Storage at 46 GB of 100 GB", time: "2h ago", unread: false },
  { id: 4, text: "Rohit Verma's transcript processing done", time: "5h ago", unread: false },
];

export function TopBar({ title, subtitle, onNavigate, onLogout }: TopBarProps) {
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifs, setNotifs] = useState(notifications);
  const unread = notifs.filter(n => n.unread).length;

  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-5 flex-shrink-0 relative z-20">
      <div className="flex items-center gap-2">
        <span className="text-foreground" style={{ fontSize: "14px", fontWeight: 600 }}>{title}</span>
        {subtitle && <span className="text-muted-foreground" style={{ fontSize: "13px" }}>— {subtitle}</span>}
      </div>

      <div className="flex items-center gap-1.5">
        <div className="relative hidden md:flex items-center mr-1">
          <Search size={13} className="absolute left-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search consultations…"
            className="pl-8 pr-3 py-1.5 bg-muted rounded-md border-0 outline-none focus:ring-1 focus:ring-primary/30 w-52 placeholder:text-muted-foreground"
            style={{ fontSize: "12px" }}
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            className="relative w-8 h-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Bell size={15} className="text-muted-foreground" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
            )}
          </button>
          {showNotif && (
            <div className="absolute right-0 top-10 w-76 bg-white rounded-xl border border-border shadow-lg overflow-hidden" style={{ width: "300px" }}>
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                <p className="text-sm text-foreground" style={{ fontWeight: 600 }}>Notifications</p>
                <button onClick={() => setNotifs(n => n.map(x => ({ ...x, unread: false })))} className="text-xs text-primary">Mark read</button>
              </div>
              {notifs.map(n => (
                <div key={n.id} className={`flex gap-3 px-4 py-3 hover:bg-muted/40 border-b border-border/40 last:border-0 ${n.unread ? "bg-blue-50/40" : ""}`}>
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${n.unread ? "bg-primary" : "bg-transparent"}`} />
                  <div>
                    <p className="text-foreground" style={{ fontSize: "12px", lineHeight: "1.45" }}>{n.text}</p>
                    <p className="text-muted-foreground mt-0.5" style={{ fontSize: "11px" }}>{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-md hover:bg-muted transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white" style={{ fontSize: "10px", fontWeight: 700 }}>AR</div>
            <span className="text-foreground hidden sm:block" style={{ fontSize: "13px", fontWeight: 500 }}>Dr. Rajan</span>
            <ChevronDown size={12} className="text-muted-foreground" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-10 w-48 bg-white rounded-xl border border-border shadow-lg py-1">
              <div className="px-3 py-2 border-b border-border mb-0.5">
                <p className="text-foreground" style={{ fontSize: "12px", fontWeight: 600 }}>Dr. Arjun Rajan</p>
                <p className="text-muted-foreground" style={{ fontSize: "11px" }}>arjun@consultiq.io</p>
              </div>
              <button onClick={() => { onNavigate("settings"); setShowProfile(false); }} className="w-full flex items-center gap-2.5 px-3 py-2 text-foreground hover:bg-muted transition-colors" style={{ fontSize: "13px" }}>
                <Settings size={13} className="text-muted-foreground" /> Settings
              </button>
              <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 hover:bg-red-50 transition-colors" style={{ fontSize: "13px" }}>
                <LogOut size={13} /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
