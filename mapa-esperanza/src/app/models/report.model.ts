export interface ReportI {
  id: number;
  lat: number;
  lng: number;
  category: string;
  description: string;
  created_at?: string;
}