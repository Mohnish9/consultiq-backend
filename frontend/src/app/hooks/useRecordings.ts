import { useState, useMemo, useEffect, useCallback } from "react";
import { getRecordings } from "../services/recordingService";
import type { Recording } from "../types/recording";

interface UseRecordingsReturn {
  recordings: Recording[];
  selectedId: string | null;
  selectedRecording: Recording | null;
  playing: boolean;
  progress: number;
  isLoading: boolean;
  isError: boolean;
  selectRecording: (id: string) => void;
  togglePlay: () => void;
  setProgress: (p: number) => void;
  refetch: () => void;
}

export function useRecordings(patientId?: string): UseRecordingsReturn {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await getRecordings(patientId);
      setRecordings(data);
      setSelectedId(prev => prev ?? data[0]?.id ?? null);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  useEffect(() => { fetch(); }, [fetch]);

  const selectedRecording = useMemo(
    () => recordings.find(r => r.id === selectedId) ?? null,
    [recordings, selectedId],
  );

  const selectRecording = (id: string) => {
    setSelectedId(id);
    setPlaying(false);
    setProgress(0);
  };

  const togglePlay = () => setPlaying(p => !p);

  return {
    recordings,
    selectedId,
    selectedRecording,
    playing,
    progress,
    isLoading,
    isError,
    selectRecording,
    togglePlay,
    setProgress,
    refetch: fetch,
  };
}
