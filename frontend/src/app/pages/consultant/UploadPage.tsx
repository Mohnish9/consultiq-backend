import { useState, useRef } from "react";
import { Upload, FileAudio, FileVideo, X, CheckCircle2, AlertCircle, Cloud } from "lucide-react";
import { CONSULTATION_TYPES, CONSULTANTS } from "../../utils/constants";

interface UploadPageProps {
  onNavigate: (page: string) => void;
}

export function UploadPage({ onNavigate }: UploadPageProps) {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    patient: "",
    consultant: CONSULTANTS[0],
    date: "2026-06-11",
    type: CONSULTATION_TYPES[0],
    notes: "",
  });

  const handleFile = (f: File) => {
    const valid = f.type.startsWith("audio/") || f.type.startsWith("video/");
    if (!valid) {
      setToast("Only audio and video files are supported.");
      setTimeout(() => setToast(null), 3000);
      return;
    }
    if (f.size > 500 * 1024 * 1024) {
      setToast("File must be under 500 MB.");
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { setToast("Please attach a recording file."); setTimeout(() => setToast(null), 3000); return; }
    if (!form.patient.trim()) { setToast("Patient name is required."); setTimeout(() => setToast(null), 3000); return; }
    setUploading(true);
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadDone(true);
          return 100;
        }
        return p + 8;
      });
    }, 180);
  };

  const isAudio = file?.type.startsWith("audio/");

  if (uploadDone) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl border border-border p-10 text-center max-w-sm w-full">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-foreground mb-2" style={{ fontWeight: 600 }}>Upload Successful!</h2>
          <p className="text-sm text-muted-foreground mb-6">
            The consultation recording for <strong>{form.patient}</strong> has been uploaded and is being processed.
          </p>
          <div className="space-y-2">
            <button onClick={() => onNavigate("consultations")} className="w-full py-2.5 rounded-lg bg-primary text-white text-sm" style={{ fontWeight: 500 }}>
              View All Consultations
            </button>
            <button onClick={() => { setUploadDone(false); setFile(null); setUploadProgress(0); setForm({ ...form, patient: "", notes: "" }); }} className="w-full py-2.5 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors">
              Upload Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg text-sm">
          <AlertCircle size={15} /> {toast}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Patient & Consultant */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm text-foreground mb-4" style={{ fontWeight: 600 }}>Consultation Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5" style={{ fontWeight: 500 }}>Patient Name *</label>
              <input
                value={form.patient}
                onChange={e => setForm({ ...form, patient: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="e.g. Priya Mehta"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5" style={{ fontWeight: 500 }}>Consultant *</label>
              <select
                value={form.consultant}
                onChange={e => setForm({ ...form, consultant: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {CONSULTANTS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5" style={{ fontWeight: 500 }}>Consultation Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1.5" style={{ fontWeight: 500 }}>Consultation Type</label>
              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {CONSULTATION_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs text-muted-foreground mb-1.5" style={{ fontWeight: 500 }}>Consultation Notes</label>
            <textarea
              value={form.notes}
              onChange={e => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-border bg-input-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              placeholder="Brief notes about this consultation session..."
            />
          </div>
        </div>

        {/* Upload area */}
        <div className="bg-white rounded-xl border border-border p-5">
          <h3 className="text-sm text-foreground mb-4" style={{ fontWeight: 600 }}>Recording File</h3>

          {!file ? (
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/30"
              }`}
            >
              <input ref={fileRef} type="file" accept="audio/*,video/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Cloud size={22} className="text-primary" />
              </div>
              <p className="text-sm text-foreground mb-1" style={{ fontWeight: 500 }}>
                {dragOver ? "Drop your file here" : "Drag & drop your recording"}
              </p>
              <p className="text-xs text-muted-foreground mb-3">or click to browse files</p>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs" style={{ fontWeight: 500 }}>
                Audio & Video supported · Max 500 MB
              </span>
            </div>
          ) : (
            <div className="rounded-xl border border-border p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${isAudio ? "bg-violet-50 text-violet-600" : "bg-blue-50 text-blue-600"}`}>
                  {isAudio ? <FileAudio size={20} /> : <FileVideo size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate" style={{ fontWeight: 500 }}>{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB · {file.type}</p>
                </div>
                {!uploading && (
                  <button type="button" onClick={() => setFile(null)} className="text-muted-foreground hover:text-red-500 transition-colors">
                    <X size={16} />
                  </button>
                )}
              </div>

              {uploading && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Uploading...</span>
                    <span className="text-xs text-primary" style={{ fontWeight: 500 }}>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={uploading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm disabled:opacity-60 hover:bg-primary/90 transition-colors"
            style={{ fontWeight: 500 }}
          >
            {uploading ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Uploading...</>
            ) : (
              <><Upload size={15} /> Upload Consultation</>
            )}
          </button>
          <button
            type="button"
            onClick={() => onNavigate("consultations")}
            className="px-5 py-2.5 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
