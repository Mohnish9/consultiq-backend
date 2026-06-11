export interface Recording {
  id: string;
  name: string;
  patient: string;
  consultant: string;
  date: string;
  duration: string;
  fileSize: string;
  fileType: "audio" | "video";
  status: "available" | "processing" | "failed";
  consultationId: string;
}
