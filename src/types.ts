export interface Track {
  id: string;
  timestamp: string;
  species: string;
  scientificName: string;
  family: string;
  confidence: 'low' | 'medium' | 'high';
  imageUrl?: string;
  notes: string;
}

export interface ApiIdentifyRequest {
  image: string; // base64
  mimeType: string;
}

export interface ApiIdentifyResponse {
  success: boolean;
  track?: Track;
  error?: string;
}

export interface ApiTracksResponse {
  success: boolean;
  tracks: Track[];
  error?: string;
}

export enum UploadState {
  IDLE,
  PROCESSING,
  RESULTS,
  ERROR,
}

export interface AppSettings {
  apiKey?: string;
}