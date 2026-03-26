import React, { useState, useEffect } from 'react';
import { Track } from '../types';
import { getTracks, downloadCSV } from '../services/apiService';
import Spinner from './Spinner';

const HistoryView: React.FC = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTracks();
      if (result.success) {
        setTracks(result.tracks);
      } else {
        setError(result.error || 'Failed to load tracks');
      }
    } catch (err) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString('sk-SK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <Spinner message="Loading history..." />;

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-400 mb-4">{error}</p>
        <button onClick={loadTracks} className="px-4 py-2 bg-gray-700 rounded">Retry</button>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-400">No tracks recorded yet</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Track History</h2>
        <button
          onClick={downloadCSV}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
        >
          Download CSV
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {tracks.map((track) => (
          <div key={track.id} className="bg-gray-900/60 rounded-lg p-3 border border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-white">{track.species}</h3>
                <p className="text-xs text-gray-400 italic">{track.scientificName}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${
                track.confidence === 'high' ? 'bg-green-900 text-green-300' :
                track.confidence === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                'bg-red-900 text-red-300'
              }`}>
                {track.confidence}
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {formatDate(track.timestamp)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;