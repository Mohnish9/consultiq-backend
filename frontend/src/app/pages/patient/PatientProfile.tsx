import { useState } from "react";
import { Save, Eye, EyeOff, Camera } from "lucide-react";

const sections = ["personal", "contact", "emergency", "notifications", "password"] as const;
type Section = typeof sections[number];

const sectionLabels: Record<Section, string> = {
  personal: "Personal Info",
  contact: "Contact Info",
  emergency: "Emergency Contact",
  notifications: "Notifications",
  password: "Change Password",
};

export function PatientProfile() {
  const [activeSection, setActiveSection] = useState<Section>("personal");
  const [saved, setSaved] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [profile, setProfile] = useState({
    name: "Priya Mehta", dob: "1994-03-15", gender: "Female", bloodGroup: "O+",
    email: "priya.mehta@email.com", phone: "+91 98765 43210", address: "204, Andheri West, Mumbai 400058",
    emergencyName: "Rahul Mehta", emergencyRelation: "Spouse", emergencyPhone: "+91 91234 56789",
  });
  const [notifSettings, setNotifSettings] = useState({
    appointmentReminder: true,
    newRecording: true,
    aiSummaryReady: true,
    recommendations: false,
    newsletter: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6">
      {saved && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl shadow-lg text-sm">
          ✓ Changes saved
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-44 flex-shrink-0 space-y-1">
          {sections.map(s => (
            <button key={s} onClick={() => setActiveSection(s)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === s ? "bg-violet-50 text-violet-700" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`} style={{ fontWeight: activeSection === s ? 500 : 400 }}>
              {sectionLabels[s]}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 max-w-2xl">
          {activeSection === "personal" && (
            <div className="bg-white rounded-xl border border-border p-6 space-y-5">
              <h3 className="text-foreground" style={{ fontWeight: 600 }}>Personal Information</h3>
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center text-white" style={{ fontSize: "22px", fontWeight: 700 }}>PM</div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-muted">
                    <Camera size={12} className="text-muted-foreground" />
                  </button>
                </div>
                <div>
                  <p className="text-sm text-foreground" style={{ fontWeight: 500 }}>{profile.name}</p>
                  <p className="text-xs text-muted-foreground">Patient ID: PAT-00142</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Full Name", key: "name" },
                  { label: "Date of Birth", key: "dob", type: "date" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs text-muted-foreground mb-1.5" style={{ fontWeight: 500 }}>{f.label}</label>
                    <input type={f.type || "text"} value={profile[f.key as keyof typeof profile]} onChange={e => setProfile({ ...profile, [f.key]: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5" style={{ fontWeight: 500 }}>Gender</label>
                  <select value={profile.gender} onChange={e => setProfile({ ...profile, gender: e.target.value })} className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20">
                    {["Female", "Male", "Non-binary", "Prefer not to say"].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5" style={{ fontWeight: 500 }}>Blood Group</label>
                  <select value={profile.bloodGroup} onChange={e => setProfile({ ...profile, bloodGroup: e.target.value })} className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20">
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm" style={{ fontWeight: 500 }}>
                <Save size={14} /> Save Changes
              </button>
            </div>
          )}

          {activeSection === "contact" && (
            <div className="bg-white rounded-xl border border-border p-6 space-y-4">
              <h3 className="text-foreground" style={{ fontWeight: 600 }}>Contact Information</h3>
              {[
                { label: "Email Address", key: "email", type: "email" },
                { label: "Phone Number", key: "phone" },
                { label: "Home Address", key: "address" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs text-muted-foreground mb-1.5" style={{ fontWeight: 500 }}>{f.label}</label>
                  <input type={f.type || "text"} value={profile[f.key as keyof typeof profile]} onChange={e => setProfile({ ...profile, [f.key]: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" />
                </div>
              ))}
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm" style={{ fontWeight: 500 }}>
                <Save size={14} /> Save Changes
              </button>
            </div>
          )}

          {activeSection === "emergency" && (
            <div className="bg-white rounded-xl border border-border p-6 space-y-4">
              <h3 className="text-foreground" style={{ fontWeight: 600 }}>Emergency Contact</h3>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-100">
                <p className="text-xs text-amber-700">This information will be used to contact someone on your behalf in case of an emergency.</p>
              </div>
              {[
                { label: "Contact Name", key: "emergencyName" },
                { label: "Relationship", key: "emergencyRelation" },
                { label: "Phone Number", key: "emergencyPhone" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs text-muted-foreground mb-1.5" style={{ fontWeight: 500 }}>{f.label}</label>
                  <input value={profile[f.key as keyof typeof profile]} onChange={e => setProfile({ ...profile, [f.key]: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" />
                </div>
              ))}
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm" style={{ fontWeight: 500 }}>
                <Save size={14} /> Save Changes
              </button>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="bg-white rounded-xl border border-border p-6 space-y-5">
              <h3 className="text-foreground" style={{ fontWeight: 600 }}>Notification Preferences</h3>
              <div className="space-y-3">
                {[
                  { key: "appointmentReminder", label: "Appointment Reminders", desc: "24-hour reminder before upcoming appointments" },
                  { key: "newRecording", label: "New Recording Available", desc: "When your consultant uploads a recording" },
                  { key: "aiSummaryReady", label: "AI Summary Ready", desc: "When AI analysis is complete for a session" },
                  { key: "recommendations", label: "Recommendation Updates", desc: "When your consultant adds new recommendations" },
                  { key: "newsletter", label: "Health Tips & Newsletter", desc: "Weekly health tips from ConsultRec" },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between py-3 border-b border-border/50">
                    <div>
                      <p className="text-sm text-foreground" style={{ fontWeight: 500 }}>{n.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifSettings(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof notifSettings] }))}
                      className={`relative rounded-full transition-colors flex-shrink-0 ${notifSettings[n.key as keyof typeof notifSettings] ? "bg-violet-600" : "bg-muted"}`}
                      style={{ minWidth: "40px", height: "22px" }}
                    >
                      <span className={`absolute top-0.5 left-0.5 rounded-full bg-white shadow-sm transition-transform ${notifSettings[n.key as keyof typeof notifSettings] ? "translate-x-[18px]" : "translate-x-0"}`}
                        style={{ width: "18px", height: "18px" }} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm" style={{ fontWeight: 500 }}>
                <Save size={14} /> Save Preferences
              </button>
            </div>
          )}

          {activeSection === "password" && (
            <div className="bg-white rounded-xl border border-border p-6 space-y-4">
              <h3 className="text-foreground" style={{ fontWeight: 600 }}>Change Password</h3>
              {[
                { label: "Current Password", placeholder: "Enter current password" },
                { label: "New Password", placeholder: "Min. 8 characters" },
                { label: "Confirm New Password", placeholder: "Repeat new password" },
              ].map((f, i) => (
                <div key={i}>
                  <label className="block text-xs text-muted-foreground mb-1.5" style={{ fontWeight: 500 }}>{f.label}</label>
                  <div className="relative">
                    <input type={showPwd ? "text" : "password"} placeholder={f.placeholder}
                      className="w-full px-3.5 py-2.5 pr-10 text-sm rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500" />
                    {i === 1 && (
                      <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 text-white text-sm" style={{ fontWeight: 500 }}>
                <Save size={14} /> Update Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
