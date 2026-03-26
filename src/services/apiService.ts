import type { ApiIdentifyResponse, ApiTracksResponse } from '../types';

export const identifyTrack = async (
  base64Image: string,
  mimeType: string,
  apiKey: string
): Promise<ApiIdentifyResponse> => {
  const response = await fetch('/api/identify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: base64Image,
      mimeType,
      apiKey
    })
  });
  
  return response.json();
};

export const getTracks = async (): Promise<ApiTracksResponse> => {
  const response = await fetch('/api/tracks');
  return response.json();
};

export const downloadCSV = () => {
  window.open('/api/csv', '_blank');
};