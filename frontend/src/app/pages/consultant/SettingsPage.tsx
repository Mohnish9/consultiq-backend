import { useState } from "react";
import { useEffect } from "react";
import { User, Bell, Shield, Database, Save, Camera, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "storage", label: "Storage", icon: Database },
];


export function SettingsPage() {
  const { user, avatarInitials } = useAuth();
  const [activeSection, setActiveSection] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [profile, setProfile] = useState({
  name: user?.name ?? "",
  email: user?.email ?? "",
  phone: "",
  specialty: "",
  clinic: user?.organization ?? "",
  bio: "",
});

useEffect(() => {
  if (!user) return;

  setProfile(prev => ({
    ...prev,
    name: user.name,
    email: user.email,
    clinic: user.organization ?? "",
  }));
}, [user]);
  const [notifSettings, setNotifSettings] = useState({
    newUpload: true,
    analysisReady: true,
    weeklyReport: false,
    storageAlert: true,
    systemMaintenance: false,
    emailDigest: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const storageUsed = 459;
  const storageTotal = 1000;
  const storagePercent = (storageUsed / storageTotal) * 100;

  return (
    <div className="p-6">
      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-44 flex-shrink-0">
          <nav className="space-y-1">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeSection === s.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                style={{ fontWeight: activeSection === s.id ? 500 : 400 }}
              >
                <s.icon size={15} />
                {s.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-2xl">
          {/* Saved toast */}
          {saved && (
            <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl shadow-lg text-sm">
              ✓ Settings saved successfully
            </div>
          )}

          {activeSection === "profile" && (
            <div className="bg-white rounded-xl border border-border p-6 space-y-5">
              <h3 className="text-foreground" style={{ fontWeight: 600 }}>Profile Settings</h3>

              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white" style={{ fontSize: "22px", fontWeight: 700 }}>
                   {avatarInitials}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors">
                    <Camera size={12} className="text-muted-foreground" />
                  </button>
                </div>
                <div>
                  <p className="text-sm text-foreground" style={{ fontWeight: 500 }}>{profile.name}</p>
                  <p className="text-xs text-muted-foreground">{profile.specialty}</p>
                  <button className="text-xs text-primary hover:underline mt-1">Upload photo</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Full Name", key: "name", placeholder: "Your full name" },
                  { label: "Email", key: "email", placeholder: "email@domain.com" },
                  { label: "Phone", key: "phone", placeholder: "+91 XXXXX XXXXX" },
                  { label: "Specialty", key: "specialty", placeholder: "Your specialty" },
                  { label: "Clinic / Organization", key: "clinic", placeholder: "Your clinic name" },
                ].map(f => (
                  <div key={f.key} className={f.key === "clinic" ? "sm:col-span-2" : ""}>
                    <label className="block text-xs text-muted-foreground mb-1.5" style={{ fontWeight: 500 }}>{f.label}</label>
                    <input
                      value={profile[f.key as keyof typeof profile]}
                      onChange={e => setProfile({ ...profile, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-xs text-muted-foreground mb-1.5" style={{ fontWeight: 500 }}>Bio</label>
                  <textarea
                    value={profile.bio}
                    onChange={e => setProfile({ ...profile, bio: e.target.value })}
                    rows={3}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                  />
                </div>
              </div>

              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm" style={{ fontWeight: 500 }}>
                <Save size={14} /> Save Changes
              </button>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="bg-white rounded-xl border border-border p-6 space-y-5">
              <h3 className="text-foreground" style={{ fontWeight: 600 }}>Notification Settings</h3>
              <div className="space-y-4">
                {[
                  { key: "newUpload", label: "New Upload Completed", desc: "Get notified when a recording finishes uploading" },
                  { key: "analysisReady", label: "AI Analysis Ready", desc: "Alert when AI summary is generated" },
                  { key: "weeklyReport", label: "Weekly Summary Report", desc: "Receive weekly analytics digest every Monday" },
                  { key: "storageAlert", label: "Storage Capacity Alert", desc: "Warning when storage reaches 90%" },
                  { key: "systemMaintenance", label: "System Maintenance", desc: "Notifications about planned downtime" },
                  { key: "emailDigest", label: "Email Digest", desc: "Daily summary via email" },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between py-3 border-b border-border/50">
                    <div>
                      <p className="text-sm text-foreground" style={{ fontWeight: 500 }}>{n.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifSettings({ ...notifSettings, [n.key]: !notifSettings[n.key as keyof typeof notifSettings] })}
                      className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${notifSettings[n.key as keyof typeof notifSettings] ? "bg-primary" : "bg-muted"}`}
                      style={{ minWidth: "40px", height: "22px" }}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${notifSettings[n.key as keyof typeof notifSettings] ? "translate-x-[18px]" : "translate-x-0"}`}
                        style={{ width: "18px", height: "18px" }}
                      />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm" style={{ fontWeight: 500 }}>
                <Save size={14} /> Save Preferences
              </button>
            </div>
          )}

          {activeSection === "security" && (
            <div className="bg-white rounded-xl border border-border p-6 space-y-5">
              <h3 className="text-foreground" style={{ fontWeight: 600 }}>Security Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5" style={{ fontWeight: 500 }}>Current Password</label>
                  <div className="relative">
                    <input type={showCurrentPass ? "text" : "password"} placeholder="Enter current password" className="w-full px-3.5 py-2.5 pr-10 text-sm rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showCurrentPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5" style={{ fontWeight: 500 }}>New Password</label>
                  <div className="relative">
                    <input type={showNewPass ? "text" : "password"} placeholder="Enter new password" className="w-full px-3.5 py-2.5 pr-10 text-sm rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showNewPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5" style={{ fontWeight: 500 }}>Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-xs text-blue-700" style={{ fontWeight: 500 }}>Two-Factor Authentication</p>
                <p className="text-xs text-blue-600 mt-0.5 mb-3">Add an extra layer of security to your account.</p>
                <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs" style={{ fontWeight: 500 }}>Enable 2FA</button>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground" style={{ fontWeight: 500 }}>Active Sessions</p>
                {[
                  { device: "Chrome on Windows", location: "Mumbai, India", time: "Current session", current: true },
                  { device: "Safari on iPhone", location: "Mumbai, India", time: "2 hours ago", current: false },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="text-sm text-foreground" style={{ fontWeight: 500 }}>{s.device}</p>
                      <p className="text-xs text-muted-foreground">{s.location} · {s.time}</p>
                    </div>
                    {s.current ? (
                      <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full" style={{ fontWeight: 500 }}>Active</span>
                    ) : (
                      <button className="text-xs text-red-500 hover:underline">Revoke</button>
                    )}
                  </div>
                ))}
              </div>

              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm" style={{ fontWeight: 500 }}>
                <Save size={14} /> Update Password
              </button>
            </div>
          )}

          {activeSection === "storage" && (
            <div className="bg-white rounded-xl border border-border p-6 space-y-5">
              <h3 className="text-foreground" style={{ fontWeight: 600 }}>Storage Management</h3>

              <div className="p-5 rounded-xl bg-gradient-to-br from-primary/5 to-violet-500/5 border border-primary/10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-foreground" style={{ fontWeight: 600, fontSize: "22px" }}>{storageUsed} GB</p>
                    <p className="text-xs text-muted-foreground">of {storageTotal} GB used</p>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded-full ${storagePercent > 80 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`} style={{ fontWeight: 500 }}>
                    {storagePercent.toFixed(0)}% used
                  </span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${storagePercent > 80 ? "bg-amber-400" : "bg-primary"}`} style={{ width: `${storagePercent}%` }} />
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Audio Recordings", size: "210 GB", count: "4,182 files", color: "bg-violet-500", pct: 46 },
                  { label: "Video Recordings", size: "198 GB", count: "1,247 files", color: "bg-blue-500", pct: 43 },
                  { label: "AI Summaries & Reports", size: "32 GB", count: "12,847 items", color: "bg-emerald-500", pct: 7 },
                  { label: "System & Logs", size: "19 GB", count: "Various", color: "bg-amber-500", pct: 4 },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${s.color} flex-shrink-0`} />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-foreground" style={{ fontWeight: 500 }}>{s.label}</span>
                        <span className="text-xs text-muted-foreground">{s.size}</span>
                      </div>
                      <div className="h-1 bg-muted rounded-full">
                        <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors">Clear Temp Files</button>
                <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm" style={{ fontWeight: 500 }}>Upgrade Storage</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
