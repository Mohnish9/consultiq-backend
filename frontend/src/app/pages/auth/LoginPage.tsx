import { useState, useEffect } from "react";
import { login } from "../../services/authService";
import {
  Eye, EyeOff, ArrowRight, Stethoscope, User, Zap,
  Mic, FileText, Search, Scroll, Users, ShieldCheck,
  HardDrive, Lock, ClipboardList, Database,
  CheckCircle2, Bell, Play, BarChart2, Sparkles,
  MessageSquare, ChevronLeft, ChevronRight, Activity,
  TrendingUp, Clock, Star, AlertCircle
} from "lucide-react";

interface LoginPageProps {
  onSignupClick: () => void;
}
// ── Realistic screenshot mockups ──────────────────────────────────────────

function ScreenDashboard() {
  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* App chrome */}
      <div className="flex items-stretch" style={{ height: "340px" }}>
        {/* Sidebar */}
        <div className="bg-white border-r border-gray-100 flex flex-col" style={{ width: "52px" }}>
          <div className="flex flex-col items-center pt-3 pb-2 border-b border-gray-100">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
              <Zap size={10} className="text-white" />
            </div>
          </div>
          {[
            { icon: BarChart2, active: true },
            { icon: Mic, active: false },
            { icon: FileText, active: false },
            { icon: Sparkles, active: false },
            { icon: Users, active: false },
          ].map(({ icon: Icon, active }, i) => (
            <div key={i} className={`flex items-center justify-center py-2.5 mx-1.5 my-0.5 rounded-lg cursor-pointer ${active ? "bg-indigo-50" : "hover:bg-gray-50"}`}>
              <Icon size={13} className={active ? "text-indigo-600" : "text-gray-400"} />
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Topbar */}
          <div className="bg-white border-b border-gray-100 flex items-center justify-between px-4 py-2.5">
            <div>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#111827" }}>Dashboard</p>
              <p style={{ fontSize: "9px", color: "#9ca3af" }}>Thursday, June 11, 2026</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Bell size={13} className="text-gray-400" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
              </div>
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
                <p style={{ fontSize: "9px", fontWeight: 700, color: "#4f46e5" }}>AK</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden p-3 space-y-2.5">
            {/* Stats row */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { v: "128", l: "Total Sessions", c: "#4f46e5", bg: "#eef2ff", trend: "+12%" },
                { v: "96", l: "AI Summaries", c: "#059669", bg: "#ecfdf5", trend: "+8%" },
                { v: "34", l: "This Week", c: "#d97706", bg: "#fffbeb", trend: "+5%" },
                { v: "8", l: "Consultants", c: "#dc2626", bg: "#fef2f2", trend: "Active" },
              ].map(s => (
                <div key={s.l} className="rounded-xl p-2.5" style={{ background: s.bg, border: `1px solid ${s.c}18` }}>
                  <p style={{ fontSize: "16px", fontWeight: 800, color: s.c }}>{s.v}</p>
                  <p style={{ fontSize: "8px", color: "#6b7280", marginBottom: "2px" }}>{s.l}</p>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={7} style={{ color: s.c }} />
                    <p style={{ fontSize: "8px", fontWeight: 600, color: s.c }}>{s.trend}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent consultations */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-50">
                <p style={{ fontSize: "10px", fontWeight: 600, color: "#374151" }}>Recent Consultations</p>
                <div className="flex items-center gap-1 text-indigo-500 cursor-pointer">
                  <p style={{ fontSize: "9px" }}>View all</p>
                  <ChevronRight size={9} />
                </div>
              </div>
              {[
                { name: "Priya Mehta", type: "Therapy", dr: "Dr. Mehta", status: "Summary Ready", dot: "bg-green-400", badge: "bg-green-50 text-green-700", dur: "48 min" },
                { name: "Raj Sharma", type: "Cardiology", dr: "Dr. Singh", status: "Processing", dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700", dur: "32 min" },
                { name: "Anita Patel", type: "Psychology", dr: "Dr. Iyer", status: "Uploaded", dot: "bg-indigo-400", badge: "bg-indigo-50 text-indigo-700", dur: "55 min" },
              ].map((c, i) => (
                <div key={i} className="flex items-center gap-2.5 px-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "#f3f4f6" }}>
                    <p style={{ fontSize: "8px", fontWeight: 700, color: "#6b7280" }}>{c.name[0]}{c.name.split(" ")[1][0]}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: "10px", fontWeight: 600, color: "#111827" }}>{c.name}</p>
                    <p style={{ fontSize: "8px", color: "#9ca3af" }}>{c.type} · {c.dr}</p>
                  </div>
                  <p style={{ fontSize: "8px", color: "#9ca3af" }}>{c.dur}</p>
                  <div className={`rounded-full px-1.5 py-0.5 ${c.badge}`} style={{ fontSize: "8px", fontWeight: 500 }}>{c.status}</div>
                </div>
              ))}
            </div>

            {/* Activity mini chart */}
            <div className="bg-white rounded-xl border border-gray-100 px-3 py-2">
              <div className="flex items-center justify-between mb-2">
                <p style={{ fontSize: "10px", fontWeight: 600, color: "#374151" }}>Weekly Activity</p>
                <p style={{ fontSize: "8px", color: "#9ca3af" }}>Last 7 days</p>
              </div>
              <div className="flex items-end gap-1.5 h-10">
                {[5, 8, 6, 12, 9, 15, 11].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm" style={{ height: `${(h / 15) * 100}%`, background: i === 5 ? "linear-gradient(180deg,#4f46e5,#818cf8)" : "#e0e7ff" }} />
                ))}
              </div>
              <div className="flex justify-between mt-1">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <p key={i} style={{ fontSize: "7px", color: i === 5 ? "#4f46e5" : "#9ca3af", flex: 1, textAlign: "center" }}>{d}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenConsultationDetail() {
  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden" style={{ fontFamily: "system-ui, sans-serif", height: "340px" }}>
      <div className="flex items-stretch h-full">
        {/* Sidebar stub */}
        <div className="bg-white border-r border-gray-100 flex flex-col items-center pt-3 gap-2" style={{ width: "52px" }}>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
            <Zap size={10} className="text-white" />
          </div>
          {[BarChart2, Mic, FileText, Sparkles].map((Icon, i) => (
            <div key={i} className={`w-8 h-8 flex items-center justify-center rounded-lg ${i === 1 ? "bg-indigo-50" : ""}`}>
              <Icon size={13} className={i === 1 ? "text-indigo-600" : "text-gray-300"} />
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-gray-100 flex items-center gap-2 px-4 py-2.5">
            <div className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center">
              <Mic size={10} className="text-indigo-600" />
            </div>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#111827" }}>Therapy Session — Priya Mehta</p>
              <p style={{ fontSize: "9px", color: "#9ca3af" }}>Jun 10, 2026 · 48 min · Dr. Mehta</p>
            </div>
            <div className="ml-auto flex gap-1.5">
              <div className="bg-green-50 border border-green-100 rounded-full px-2 py-0.5">
                <p style={{ fontSize: "8px", fontWeight: 600, color: "#059669" }}>✓ AI Summary Ready</p>
              </div>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Left: player + transcript */}
            <div className="flex-1 p-3 space-y-2 overflow-hidden">
              {/* Player */}
              <div className="bg-white rounded-xl border border-gray-100 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center cursor-pointer">
                    <Play size={10} className="text-white ml-0.5" />
                  </div>
                  <div className="flex-1">
                    <div className="relative h-1.5 bg-gray-100 rounded-full">
                      <div className="absolute left-0 top-0 h-full bg-indigo-500 rounded-full" style={{ width: "38%" }} />
                      <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white border-2 border-indigo-500 rounded-full shadow" style={{ left: "calc(38% - 5px)" }} />
                    </div>
                    <div className="flex justify-between mt-0.5">
                      <p style={{ fontSize: "8px", color: "#9ca3af" }}>18:22</p>
                      <p style={{ fontSize: "8px", color: "#9ca3af" }}>48:12</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {["#anxiety", "#CBT", "#sleep", "#follow-up"].map(tag => (
                    <div key={tag} className="bg-indigo-50 rounded-full px-2 py-0.5">
                      <p style={{ fontSize: "8px", color: "#4f46e5" }}>{tag}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transcript snippet */}
              <div className="bg-white rounded-xl border border-gray-100 p-3 flex-1">
                <p style={{ fontSize: "9px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>TRANSCRIPT</p>
                <div className="space-y-2">
                  {[
                    { t: "18:10", s: "Dr. Mehta", c: "#4f46e5", msg: "How have you been sleeping this week?" },
                    { t: "18:17", s: "Patient", c: "#059669", msg: "Much better, around 7 hours on average now." },
                    { t: "18:31", s: "Dr. Mehta", c: "#4f46e5", msg: "That's great progress. The CBT exercises are clearly working." },
                  ].map(l => (
                    <div key={l.t} className="flex gap-2">
                      <p style={{ fontSize: "8px", color: "#d1d5db", fontFamily: "monospace", minWidth: "32px" }}>{l.t}</p>
                      <div>
                        <p style={{ fontSize: "8px", fontWeight: 700, color: l.c }}>{l.s}</p>
                        <p style={{ fontSize: "9px", color: "#374151", lineHeight: 1.4 }}>{l.msg}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: AI summary */}
            <div className="w-40 p-2 space-y-2 border-l border-gray-100">
              <div className="bg-indigo-50 rounded-xl p-2.5">
                <div className="flex items-center gap-1 mb-1.5">
                  <Sparkles size={9} className="text-indigo-600" />
                  <p style={{ fontSize: "9px", fontWeight: 700, color: "#4338ca" }}>AI SUMMARY</p>
                </div>
                <p style={{ fontSize: "9px", color: "#374151", lineHeight: 1.5 }}>Patient reports improved sleep (7h avg). CBT showing positive response. Anxiety levels reduced.</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-2.5">
                <p style={{ fontSize: "9px", fontWeight: 700, color: "#92400e", marginBottom: "6px" }}>ACTION ITEMS</p>
                {["Continue CBT daily", "Follow-up in 2 wks", "Review sleep journal"].map(a => (
                  <div key={a} className="flex items-center gap-1 mb-1">
                    <CheckCircle2 size={8} className="text-amber-500 flex-shrink-0" />
                    <p style={{ fontSize: "8.5px", color: "#78350f" }}>{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenAnalytics() {
  const bars = [22, 35, 28, 48, 41, 56, 38, 62, 44, 70, 55, 80];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden" style={{ fontFamily: "system-ui, sans-serif", height: "340px" }}>
      <div className="flex items-stretch h-full">
        <div className="bg-white border-r border-gray-100 flex flex-col items-center pt-3 gap-2" style={{ width: "52px" }}>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
            <Zap size={10} className="text-white" />
          </div>
          {[BarChart2, Mic, FileText, Sparkles].map((Icon, i) => (
            <div key={i} className={`w-8 h-8 flex items-center justify-center rounded-lg ${i === 0 ? "bg-indigo-50" : ""}`}>
              <Icon size={13} className={i === 0 ? "text-indigo-600" : "text-gray-300"} />
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-gray-100 px-4 py-2.5">
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#111827" }}>Analytics</p>
            <p style={{ fontSize: "9px", color: "#9ca3af" }}>2026 · All consultants</p>
          </div>

          <div className="flex-1 p-3 space-y-2.5 overflow-hidden">
            {/* Metric cards */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { v: "856", l: "Total Sessions", c: "#4f46e5", trend: "+23% vs last year" },
                { v: "94%", l: "AI Coverage", c: "#059669", trend: "Up from 87%" },
                { v: "44m", l: "Avg Duration", c: "#d97706", trend: "−2 min optimized" },
              ].map(s => (
                <div key={s.l} className="bg-white rounded-xl border border-gray-100 p-2.5">
                  <p style={{ fontSize: "18px", fontWeight: 800, color: s.c }}>{s.v}</p>
                  <p style={{ fontSize: "8px", color: "#6b7280" }}>{s.l}</p>
                  <p style={{ fontSize: "7.5px", color: "#9ca3af", marginTop: "2px" }}>{s.trend}</p>
                </div>
              ))}
            </div>

            {/* Bar chart */}
            <div className="bg-white rounded-xl border border-gray-100 p-3">
              <div className="flex items-center justify-between mb-3">
                <p style={{ fontSize: "10px", fontWeight: 600, color: "#374151" }}>Consultations Over Time</p>
                <div className="flex gap-1">
                  {["2025", "2026"].map((y, i) => (
                    <div key={y} className={`rounded-full px-2 py-0.5 ${i === 1 ? "bg-indigo-600" : "bg-gray-100"}`}>
                      <p style={{ fontSize: "8px", color: i === 1 ? "#fff" : "#6b7280", fontWeight: i === 1 ? 600 : 400 }}>{y}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-end gap-1" style={{ height: "60px" }}>
                {bars.map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm" style={{
                    height: `${(h / 80) * 100}%`,
                    background: i >= 6
                      ? "linear-gradient(180deg,#4f46e5,#818cf8)"
                      : "linear-gradient(180deg,#c7d2fe,#e0e7ff)",
                    opacity: i >= 6 ? 1 : 0.6,
                  }} />
                ))}
              </div>
              <div className="flex gap-1 mt-1">
                {months.map((m, i) => (
                  <p key={i} style={{ fontSize: "6.5px", color: i >= 6 ? "#4f46e5" : "#d1d5db", flex: 1, textAlign: "center" }}>{m}</p>
                ))}
              </div>
            </div>

            {/* Top consultants */}
            <div className="bg-white rounded-xl border border-gray-100 p-2.5">
              <p style={{ fontSize: "9px", fontWeight: 600, color: "#374151", marginBottom: "6px" }}>Top Consultants</p>
              <div className="space-y-1.5">
                {[
                  { name: "Dr. Mehta", count: 48, pct: 80 },
                  { name: "Dr. Singh", count: 36, pct: 60 },
                  { name: "Dr. Iyer", count: 24, pct: 40 },
                ].map(c => (
                  <div key={c.name} className="flex items-center gap-2">
                    <p style={{ fontSize: "9px", color: "#374151", minWidth: "55px" }}>{c.name}</p>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: "linear-gradient(90deg,#4f46e5,#818cf8)" }} />
                    </div>
                    <p style={{ fontSize: "9px", color: "#6b7280", minWidth: "20px", textAlign: "right" }}>{c.count}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenAISummary() {
  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden" style={{ fontFamily: "system-ui, sans-serif", height: "340px" }}>
      <div className="flex items-stretch h-full">
        <div className="bg-white border-r border-gray-100 flex flex-col items-center pt-3 gap-2" style={{ width: "52px" }}>
          <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
            <Zap size={10} className="text-white" />
          </div>
          {[BarChart2, Mic, FileText, Sparkles].map((Icon, i) => (
            <div key={i} className={`w-8 h-8 flex items-center justify-center rounded-lg ${i === 3 ? "bg-indigo-50" : ""}`}>
              <Icon size={13} className={i === 3 ? "text-indigo-600" : "text-gray-300"} />
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-gray-100 flex items-center gap-2 px-4 py-2.5">
            <div className="w-5 h-5 rounded-md bg-indigo-100 flex items-center justify-center">
              <Sparkles size={10} className="text-indigo-600" />
            </div>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 700, color: "#111827" }}>AI Insights</p>
              <p style={{ fontSize: "9px", color: "#9ca3af" }}>96 summaries generated</p>
            </div>
            <div className="ml-auto bg-indigo-600 rounded-lg px-2 py-1 cursor-pointer">
              <p style={{ fontSize: "9px", fontWeight: 600, color: "#fff" }}>+ Generate New</p>
            </div>
          </div>

          <div className="flex-1 p-3 space-y-2 overflow-hidden">
            {/* Summary card */}
            <div className="bg-white rounded-xl border border-gray-100 p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#111827" }}>Therapy Session — Priya Mehta</p>
                  <p style={{ fontSize: "8px", color: "#9ca3af" }}>Jun 10, 2026 · 48 min · Confidence: 98%</p>
                </div>
                <div className="flex gap-1">
                  <div className="w-5 h-5 rounded-md bg-green-50 flex items-center justify-center">
                    <CheckCircle2 size={10} className="text-green-500" />
                  </div>
                </div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-2 mb-2">
                <p style={{ fontSize: "9px", fontWeight: 600, color: "#4338ca", marginBottom: "4px" }}>SUMMARY</p>
                <p style={{ fontSize: "9px", color: "#374151", lineHeight: 1.55 }}>
                  Patient reports significantly improved sleep quality (7h avg, up from 5h). CBT exercises showing consistent positive response over 3 weeks. Anxiety levels self-reported as 4/10 vs. 7/10 at intake.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-amber-50 rounded-lg p-2">
                  <p style={{ fontSize: "8px", fontWeight: 700, color: "#92400e", marginBottom: "4px" }}>ACTION ITEMS</p>
                  {["Continue CBT exercises", "Follow-up in 2 weeks", "Sleep journal review"].map(a => (
                    <div key={a} className="flex items-center gap-1 mb-0.5">
                      <div className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                      <p style={{ fontSize: "8px", color: "#78350f" }}>{a}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-emerald-50 rounded-lg p-2">
                  <p style={{ fontSize: "8px", fontWeight: 700, color: "#065f46", marginBottom: "4px" }}>KEY TOPICS</p>
                  {["Anxiety management", "Sleep hygiene", "CBT progress", "Mindfulness"].map(t => (
                    <div key={t} className="flex items-center gap-1 mb-0.5">
                      <div className="w-1 h-1 rounded-full bg-emerald-400 flex-shrink-0" />
                      <p style={{ fontSize: "8px", color: "#065f46" }}>{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Second summary */}
            <div className="bg-white rounded-xl border border-gray-100 p-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 600, color: "#111827" }}>Cardiology — Raj Sharma</p>
                  <p style={{ fontSize: "8px", color: "#9ca3af" }}>Jun 9, 2026 · 32 min</p>
                </div>
                <div className="bg-amber-50 rounded-full px-2 py-0.5">
                  <p style={{ fontSize: "8px", color: "#d97706", fontWeight: 500 }}>Processing…</p>
                </div>
              </div>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full animate-pulse" style={{ width: "65%" }} />
              </div>
              <p style={{ fontSize: "8px", color: "#9ca3af", marginTop: "4px" }}>AI processing · 65% complete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SLIDES = [
  { id: "dashboard", label: "Dashboard", component: ScreenDashboard },
  { id: "detail", label: "Consultation Detail", component: ScreenConsultationDetail },
  { id: "analytics", label: "Analytics", component: ScreenAnalytics },
  { id: "ai", label: "AI Insights", component: ScreenAISummary },
];

const trust = [
  { icon: ShieldCheck, label: "HIPAA Compliant" },
  { icon: Lock, label: "End-to-End Encrypted" },
  { icon: Users, label: "Role-Based Access" },
  { icon: HardDrive, label: "Secure Cloud Storage" },
];

const workflowSteps = [
  "Consultation",
  "Recording Upload",
  "Transcript Generation",
  "AI Summary",
  "Patient Access",
  "Follow-Up",
];

const activity = [
  { text: "Therapy Session Uploaded", time: "2m ago", icon: Mic, color: "#4f46e5" },
  { text: "AI Summary Generated", time: "5m ago", icon: Sparkles, color: "#7c3aed" },
  { text: "Follow-Up Scheduled", time: "18m ago", icon: Clock, color: "#059669" },
  { text: "Recording Shared With Patient", time: "1h ago", icon: Users, color: "#0284c7" },
];

const notifications = [
  { text: "Recording upload completed", sub: "Therapy Session — Dr. Mehta", icon: Mic, bg: "rgba(79,70,229,0.15)", color: "#a5b4fc" },
  { text: "AI summary ready", sub: "Jun 10 · Anxiety Session", icon: Sparkles, bg: "rgba(124,58,237,0.15)", color: "#c4b5fd" },
  { text: "Follow-up due tomorrow", sub: "Priya Mehta · 10:00 AM", icon: Bell, bg: "rgba(217,119,6,0.15)", color: "#fcd34d" },
];

export function LoginPage({
  onSignupClick,
}: LoginPageProps) {
  const [role, setRole] = useState<"consultant" | "patient" | "admin">("consultant");
  const [email, setEmail] = useState("arjun@consultiq.io");
  const [password, setPassword] = useState("password");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slide, setSlide] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleRoleSwitch = (r: "consultant" | "patient" | "admin") => {
    setRole(r);
    setEmail(
      r === "consultant"
        ? "arjun@consultiq.io"
        : r === "patient"
          ? "priya.mehta@email.com"
          : "admin@consultiq.io"
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    setLoading(true);

    const response = await login(
      email,
      password,
      role
    );

    if (response.success) {
      return;
    } else {
      alert(response.error ?? "Login failed");
    }
  } catch (err: any) {
    console.error(err);
    alert("Invalid email or password");
  } finally {
    setLoading(false);
  }
};

  const SlideComponent = SLIDES[slide].component;

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: "#f8f9fc" }}>

      {/* ── LEFT: Login Panel ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-start px-8 pt-12 pb-10 overflow-y-auto min-h-screen">
        <div className="w-full max-w-[340px]" style={{ marginTop: "-40px" }}>

          {/* Brand */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
              <Zap size={16} className="text-white" />
            </div>
            <div>
              <p style={{ fontSize: "17px", fontWeight: 800, letterSpacing: "-0.03em", color: "#111827" }}>ConsultIQ</p>
              <p style={{ fontSize: "10px", color: "#9ca3af", letterSpacing: "0.06em" }}>AI CONSULTATION PLATFORM</p>
            </div>
          </div>

          <h1 style={{ fontSize: "24px", fontWeight: 800, letterSpacing: "-0.04em", color: "#111827", lineHeight: 1.1, marginBottom: "6px" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: "13.5px", color: "#6b7280", marginBottom: "24px" }}>
            Sign in to your {role} portal.
          </p>

          {/* Role toggle */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-3 shadow-inner">
            {(["consultant", "patient", "admin"] as const).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleSwitch(r)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all duration-200"
                style={{
                  fontSize: "12px",
                  fontWeight: role === r ? 600 : 400,
                  color: role === r ? "#fff" : "#6b7280",
                  background: role === r
                    ? r === "consultant"
                      ? "linear-gradient(135deg,#4f46e5,#7c3aed)"
                      : "linear-gradient(135deg,#7c3aed,#9333ea)"
                    : "transparent",
                  boxShadow: role === r ? "0 2px 8px rgba(79,70,229,0.3)" : "none",
                }}
              >
                {r === "consultant" ? <Stethoscope size={12} /> : r === "admin" ? <ShieldCheck size={12} /> : <User size={12} />}
                {r === "consultant" ? "Consultant" : r === "admin" ? "Admin" : "Patient"}
              </button>
            ))}
          </div>

          {/* Role description */}
          <div className="rounded-xl border p-3 mb-5" style={{
            background: role === "consultant" ? "#eef2ff" : "#f5f3ff",
            borderColor: role === "consultant" ? "#c7d2fe" : "#ddd6fe",
          }}>
            <p style={{ fontSize: "12px", color: role === "consultant" ? "#4338ca" : "#6d28d9", lineHeight: 1.55 }}>
              {role === "consultant"
                ? "Upload recordings, manage consultations, generate AI summaries, and access analytics."
                : role === "admin"
                  ? "Manage users, consultants, patients, and system-wide analytics."
                  : "Access recordings, view summaries, review transcripts, and follow care recommendations."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 mb-4">
            <div>
              <label className="block mb-1.5" style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all shadow-sm"
                style={{ fontSize: "13px" }}
              />
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>Password</label>
                <button type="button" style={{ fontSize: "11px", color: "#4f46e5" }}>Forgot password?</button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 transition-all shadow-sm"
                  style={{ fontSize: "13px" }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white transition-all disabled:opacity-60"
              style={{
                fontSize: "13px",
                fontWeight: 600,
                background: role === "consultant"
                  ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                  : "linear-gradient(135deg, #7c3aed, #9333ea)",
                boxShadow: "0 4px 14px rgba(79,70,229,0.4)",
              }}
            >
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <>Sign in <ArrowRight size={14} /></>}
            </button>
            <div className="mt-4 text-center">
              <button
              type="button"
               onClick={onSignupClick}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
               >
                Create Account
              </button>
            </div>
          </form>

          {/* Demo credentials */}
          <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm mb-5">
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", marginBottom: "6px", letterSpacing: "0.07em" }}>DEMO CREDENTIALS</p>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Stethoscope size={10} className="text-indigo-500" />
                <code style={{ fontSize: "11px", color: "#4f46e5" }}>arjun@consultiq.io</code>
              </div>
              <div className="flex items-center gap-2">
                <User size={10} className="text-violet-500" />
                <code style={{ fontSize: "11px", color: "#7c3aed" }}>priya.mehta@email.com</code>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={10} className="text-emerald-500" />
                <code style={{ fontSize: "11px", color: "#059669" }}>admin@consultiq.io</code>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div className="rounded-xl border border-gray-100 bg-white shadow-sm p-3 mb-5">
            <p style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.07em", marginBottom: "10px" }}>SECURITY &amp; COMPLIANCE</p>
            <div className="grid grid-cols-2 gap-2">
              {trust.map(t => (
                <div key={t.label} className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <t.icon size={11} className="text-indigo-500" />
                  </div>
                  <p style={{ fontSize: "11px", color: "#374151", fontWeight: 500 }}>{t.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p style={{ fontSize: "10px", color: "#9ca3af" }}>Version 1.0 · Built for Doctors, Therapists, Astrologers &amp; Consultants</p>
            <p style={{ fontSize: "10px", color: "#d1d5db", marginTop: "2px" }}>© 2026 ConsultIQ · HIPAA-compliant · 256-bit TLS</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Product Showcase Panel ───────────────────────────────── */}
      <div
        className="hidden lg:flex w-[58%] relative overflow-y-auto"
        style={{
          background: "linear-gradient(145deg, #0f0a2e 0%, #1e1060 25%, #2d1472 50%, #1a0d4e 75%, #0f0a2e 100%)",
        }}
      >
        {/* Background texture shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", top: "-100px", right: "-100px", background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 65%)", filter: "blur(30px)" }} />
          <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", bottom: "0px", left: "-80px", background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 65%)", filter: "blur(40px)" }} />
          <div style={{ position: "absolute", width: 250, height: 250, borderRadius: "50%", top: "40%", left: "30%", background: "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 60%)", filter: "blur(50px)" }} />
          {/* Floating dots grid */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              width: "2px", height: "2px", borderRadius: "50%",
              background: "rgba(167,139,250,0.25)",
              top: `${(i % 6) * 17 + 5}%`,
              left: `${Math.floor(i / 6) * 22 + 4}%`,
            }} />
          ))}
        </div>

        <div className="relative flex flex-col gap-6 px-10 py-10 w-full">

          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <Zap size={13} className="text-white" />
              </div>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.5)" }}>ConsultIQ</span>
            </div>
            <h2 style={{ fontSize: "26px", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.2, marginBottom: "8px" }}>
              {role === "consultant" ? "Every consultation,\nperfectly recorded." : "Your health journey,\nalways at hand."}
            </h2>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
              {role === "consultant"
                ? "AI-powered platform for recording, transcribing, and summarizing consultations."
                : "Access all your consultation data in one secure, easy-to-use portal."}
            </p>
          </div>

          {/* ── Carousel ── */}
          <div className="rounded-2xl overflow-hidden" style={{
            boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            {/* Tab strip */}
            <div className="flex items-center gap-1 px-3 py-2.5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.04)" }}>
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setSlide(i)}
                  className="px-2.5 py-1 rounded-lg transition-all duration-200"
                  style={{
                    fontSize: "10px",
                    fontWeight: 500,
                    background: slide === i ? "rgba(255,255,255,0.15)" : "transparent",
                    color: slide === i ? "#fff" : "rgba(255,255,255,0.4)",
                    border: slide === i ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent",
                  }}
                >
                  {s.label}
                </button>
              ))}
              {/* Progress dots */}
              <div className="ml-auto flex items-center gap-1">
                {SLIDES.map((_, i) => (
                  <div key={i} className="rounded-full transition-all duration-300" style={{
                    width: slide === i ? "16px" : "5px",
                    height: "5px",
                    background: slide === i ? "#818cf8" : "rgba(255,255,255,0.2)",
                  }} />
                ))}
              </div>
            </div>
            {/* Screenshot */}
            <div className="p-3">
              <SlideComponent />
            </div>
          </div>

          {/* Workflow + Activity */}
          <div className="grid grid-cols-2 gap-4">
            {/* Workflow */}
            <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(10px)" }}>
              <p style={{ fontSize: "9.5px", fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", marginBottom: "12px" }}>WORKFLOW</p>
              <div className="space-y-1.5">
                {workflowSteps.map((step, i) => (
                  <div key={step} className="flex items-center gap-2.5">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: i === 0 ? "linear-gradient(135deg,#818cf8,#a78bfa)" : "rgba(255,255,255,0.1)", fontSize: "9px", fontWeight: 700, color: i === 0 ? "#fff" : "rgba(255,255,255,0.4)", border: i === 0 ? "none" : "1px solid rgba(255,255,255,0.12)" }}>
                        {i + 1}
                      </div>
                      {i < workflowSteps.length - 1 && <div className="w-px mt-1" style={{ height: "8px", background: "rgba(255,255,255,0.1)" }} />}
                    </div>
                    <p style={{ fontSize: "11px", color: i === 0 ? "#c7d2fe" : "rgba(255,255,255,0.45)" }}>{step}</p>
                    {i === 0 && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div className="space-y-3">
              <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(10px)" }}>
                <p style={{ fontSize: "9.5px", fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em", marginBottom: "10px" }}>RECENT ACTIVITY</p>
                <div className="space-y-2">
                  {activity.map(a => (
                    <div key={a.text} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0" style={{ background: `${a.color}22` }}>
                        <a.icon size={9} style={{ color: a.color }} />
                      </div>
                      <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)" }}>{a.text}</p>
                      <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", marginLeft: "auto", whiteSpace: "nowrap" }}>{a.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(10px)" }}>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Bell size={9} style={{ color: "#fcd34d" }} />
                  <p style={{ fontSize: "9.5px", fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>NOTIFICATIONS</p>
                </div>
                <div className="space-y-2">
                  {notifications.map(n => (
                    <div key={n.text} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: n.bg }}>
                        <n.icon size={9} style={{ color: n.color }} />
                      </div>
                      <div>
                        <p style={{ fontSize: "10px", fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>{n.text}</p>
                        <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)" }}>{n.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { v: "128", l: "Consultations" },
              { v: "96", l: "AI Summaries" },
              { v: "8", l: "Consultants" },
              { v: "48m", l: "Avg Session" },
            ].map(s => (
              <div key={s.l} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", backdropFilter: "blur(8px)" }}>
                <p style={{ fontSize: "20px", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em" }}>{s.v}</p>
                <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)" }}>{s.l}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>Version 1.0 · ConsultIQ</p>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>Built for Doctors, Therapists &amp; Consultants</p>
          </div>
        </div>
      </div>
    </div>
  );
}
