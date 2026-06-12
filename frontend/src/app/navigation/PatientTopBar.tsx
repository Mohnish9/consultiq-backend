import { useState } from "react";
import { Bell, Search, ChevronDown, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
interface PatientTopBarProps {
  title: string;
  subtitle?: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const notifications = [
  { id: 1, text: "New AI summary available for your Jun 11 session", time: "1h ago", unread: true },
  { id: 2, text: "Dr. Arjun Rajan uploaded your latest recording", time: "3h ago", unread: true },
  { id: 3, text: "Upcoming appointment on Jun 18 at 10:30 AM", time: "1d ago", unread: false },
];

export function PatientTopBar({ title, subtitle, onNavigate, onLogout }: PatientTopBarProps) {
  const { user, shortName, avatarInitials } = useAuth();

  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifs, setNotifs] = useState(notifications);
  const unread = notifs.filter(n => n.unread).length;

  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-6 flex-shrink-0 relative z-20">
      <div>
        <h1 className="text-foreground" style={{ fontSize: "15px", fontWeight: 600, lineHeight: "1.3" }}>{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground" style={{ lineHeight: "1.2" }}>{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden md:flex items-center">
          <Search size={14} className="absolute left-3 text-muted-foreground" />
          <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 text-sm bg-muted rounded-lg border-0 outline-none focus:ring-2 focus:ring-violet-500/20 w-48 placeholder:text-muted-foreground" />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }} className="relative w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors">
            <Bell size={16} className="text-muted-foreground" />
            {unread > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-violet-600 rounded-full flex items-center justify-center text-white" style={{ fontSize: "9px", fontWeight: 600 }}>{unread}</span>}
          </button>
          {showNotif && (
            <div className="absolute right-0 top-10 w-80 bg-white rounded-xl border border-border shadow-lg py-2">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <p className="text-sm text-foreground" style={{ fontWeight: 600 }}>Notifications</p>
                <button onClick={() => setNotifs(notifs.map(n => ({ ...n, unread: false })))} className="text-xs text-violet-600 hover:underline">Mark all read</button>
              </div>
              {notifs.map(n => (
                <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-muted/50 ${n.unread ? "bg-violet-50/40" : ""}`}>
                  <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${n.unread ? "bg-violet-600" : "bg-transparent"}`} />
                  <div>
                    <p className="text-sm text-foreground" style={{ lineHeight: "1.4" }}>{n.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }} className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
         <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-white" style={{ fontSize: "11px", fontWeight: 600 }}>
  {avatarInitials}
</div>
           <span className="text-sm text-foreground hidden sm:block" style={{ fontWeight: 500 }}>
  {shortName}
</span>
            <ChevronDown size={13} className="text-muted-foreground" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-10 w-52 bg-white rounded-xl border border-border shadow-lg py-1.5">
              <div className="px-4 py-2 border-b border-border mb-1">
               <p className="text-sm text-foreground" style={{ fontWeight: 500 }}>
  {user?.name}
</p>
               <p className="text-xs text-muted-foreground">
  {user?.email}
</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 text-xs" style={{ fontWeight: 500 }}>
  {user?.role}
</span>
              </div>
              <button onClick={() => { onNavigate("p-profile"); setShowProfile(false); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                <Settings size={14} className="text-muted-foreground" /> Profile Settings
              </button>
              <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
