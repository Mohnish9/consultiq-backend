import { useState } from "react";
import { Search, Play, Pause, Download, SkipBack, SkipForward, Mic2, Video, ChevronDown, FileText, Sparkles } from "lucide-react";

const recordings = [
  { id: "R-048", name: "Therapy Session — Jun 11, 2026", file: "consultation_arjun_jun11.mp3", consultant: "Dr. Arjun Rajan", type: "Therapy", date: "Jun 11, 2026", duration: "52:00", size: "48.2 MB", format: "audio", hasTranscript: true, hasSummary: true },
  { id: "R-040", name: "Medical Check-up — May 28, 2026", file: "medical_riya_may28.mp3", consultant: "Dr. Riya Sharma", type: "Medical", date: "May 28, 2026", duration: "38:15", size: "35.4 MB", format: "audio", hasTranscript: true, hasSummary: true },
  { id: "R-032", name: "Therapy Session — May 14, 2026", file: "therapy_arjun_may14.mp4", consultant: "Dr. Arjun Rajan", type: "Therapy", date: "May 14, 2026", duration: "60:00", size: "312 MB", format: "video", hasTranscript: false, hasSummary: true },
  { id: "R-025", name: "Advisory — Apr 30, 2026", file: "advisory_karan_apr30.mp3", consultant: "Dr. Karan Mehta", type: "Advisory", date: "Apr 30, 2026", duration: "45:22", size: "42.1 MB", format: "audio", hasTranscript: true, hasSummary: false },
  { id: "R-018", name: "Therapy Session — Apr 16, 2026", file: "therapy_arjun_apr16.mp3", consultant: "Dr. Arjun Rajan", type: "Therapy", date: "Apr 16, 2026", duration: "55:10", size: "51.3 MB", format: "audio", hasTranscript: true, hasSummary: true },
];

const speeds = ["0.75×", "1×", "1.25×", "1.5×", "2×"];

export function PatientRecordings({ onNavigate }: { onNavigate?: (page: string, id?: string) => void }) {
  const [search, setSearch] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [speed, setSpeed] = useState<Record<string, string>>({});

  const filtered = recordings.filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.consultant.toLowerCase().includes(search.toLowerCase()));

  const togglePlay = (id: string) => {
    setPlayingId(p => p === id ? null : id);
    if (!progress[id]) setProgress(prev => ({ ...prev, [id]: 8 }));
  };

  const formatTime = (rec: typeof recordings[0], pct: number) => {
    const totalSecs = parseInt(rec.duration.split(":")[0]) * 60 + parseInt(rec.duration.split(":")[1]);
    const current = Math.floor(totalSecs * pct / 100);
    return `${String(Math.floor(current / 60)).padStart(2, "0")}:${String(current % 60).padStart(2, "0")}`;
  };

  return (
    <div className="p-5 space-y-3">
      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search recordings…"
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-border bg-white focus:outline-none focus:ring-1 focus:ring-violet-500/30" style={{ fontSize: "13px" }} />
        </div>
        <span className="text-muted-foreground" style={{ fontSize: "12px" }}>{filtered.length} recordings</span>
      </div>

      {/* Recording cards */}
      <div className="space-y-3">
        {filtered.map(r => {
          const isPlaying = playingId === r.id;
          const prog = progress[r.id] || 0;
          const spd = speed[r.id] || "1×";

          return (
            <div key={r.id} className={`bg-white rounded-xl border transition-all overflow-hidden ${isPlaying ? "border-violet-300 shadow-md shadow-violet-100/50" : "border-border"}`}>
              {/* Top bar */}
              <div className="px-4 pt-4 pb-3">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${r.format === "audio" ? "bg-violet-50 text-violet-600" : "bg-blue-50 text-blue-600"}`}>
                    {r.format === "audio" ? <Mic2 size={18} /> : <Video size={18} />}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-foreground" style={{ fontSize: "14px", fontWeight: 600 }}>{r.name}</p>
                        <p className="text-muted-foreground mt-0.5" style={{ fontSize: "12px" }}>{r.consultant} · {r.duration} · {r.size}</p>
                        {/* Badges */}
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span className={`px-2 py-0.5 rounded-full ${r.format === "audio" ? "bg-violet-50 text-violet-600" : "bg-blue-50 text-blue-600"}`} style={{ fontSize: "10px", fontWeight: 500 }}>
                            {r.format === "audio" ? "Audio" : "Video"}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground" style={{ fontSize: "10px", fontWeight: 500 }}>{r.type}</span>
                          {r.hasTranscript && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700" style={{ fontSize: "10px", fontWeight: 500 }}>
                              📝 Transcript
                            </span>
                          )}
                          {r.hasSummary && (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700" style={{ fontSize: "10px", fontWeight: 500 }}>
                              ✨ AI Summary
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors" style={{ fontSize: "11px" }}>
                          <Download size={12} /> Download
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Waveform + player */}
                <div className="mt-3">
                  {/* Waveform */}
                  <div className="h-12 bg-muted/40 rounded-lg flex items-center px-3 gap-px overflow-hidden cursor-pointer mb-2"
                    onClick={() => togglePlay(r.id)}>
                    {Array.from({ length: 100 }, (_, i) => (
                      <div key={i}
                        className={`flex-1 rounded-sm transition-colors ${i / 100 < prog / 100 ? "bg-violet-500" : "bg-slate-200"}`}
                        style={{ height: `${20 + Math.abs(Math.sin(i * 0.4 + r.id.charCodeAt(2)) * 16 + Math.sin(i * 0.9 + 1) * 12)}%`, minWidth: "2px" }}
                      />
                    ))}
                  </div>

                  {/* Progress bar */}
                  <input type="range" min={0} max={100} value={prog}
                    onChange={e => setProgress(prev => ({ ...prev, [r.id]: Number(e.target.value) }))}
                    className="w-full accent-violet-600 mb-1" style={{ height: "2px" }} />
                  <div className="flex justify-between text-muted-foreground mb-3" style={{ fontSize: "10px" }}>
                    <span>{formatTime(r, prog)}</span>
                    <span>{r.duration}</span>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-3">
                    <button onClick={() => setProgress(prev => ({ ...prev, [r.id]: Math.max(0, (prev[r.id] || 0) - 5) }))} className="text-muted-foreground hover:text-foreground">
                      <SkipBack size={15} />
                    </button>
                    <button onClick={() => togglePlay(r.id)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${isPlaying ? "bg-violet-600 text-white hover:bg-violet-700" : "bg-violet-100 text-violet-600 hover:bg-violet-200"}`}>
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button onClick={() => setProgress(prev => ({ ...prev, [r.id]: Math.min(100, (prev[r.id] || 0) + 5) }))} className="text-muted-foreground hover:text-foreground">
                      <SkipForward size={15} />
                    </button>

                    {/* Speed selector */}
                    <div className="relative ml-2">
                      <select value={spd} onChange={e => setSpeed(prev => ({ ...prev, [r.id]: e.target.value }))}
                        className="appearance-none pl-2 pr-6 py-1 rounded-md border border-border bg-white text-muted-foreground focus:outline-none cursor-pointer"
                        style={{ fontSize: "11px" }}>
                        {speeds.map(s => <option key={s}>{s}</option>)}
                      </select>
                      <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 ml-auto">
                      {r.hasTranscript && onNavigate && (
                        <button onClick={() => onNavigate("p-transcript")}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted hover:bg-emerald-50 hover:text-emerald-700 text-muted-foreground transition-colors"
                          style={{ fontSize: "11px" }}>
                          <FileText size={11} /> Transcript
                        </button>
                      )}
                      {r.hasSummary && onNavigate && (
                        <button onClick={() => onNavigate("p-summaries")}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted hover:bg-indigo-50 hover:text-indigo-700 text-muted-foreground transition-colors"
                          style={{ fontSize: "11px" }}>
                          <Sparkles size={11} /> AI Summary
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white border border-border rounded-xl py-12 text-center">
            <Mic2 size={24} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground" style={{ fontSize: "13px" }}>No recordings match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
