import React from 'react';
import { Track } from '../types';

interface ResultsDisplayProps {
  imageSrc: string | null;
  track: Track | null;
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ imageSrc, track, onReset }) => {
  if (!track) return null;

  const confidenceColors = {
    low: 'bg-red-500',
    medium: 'bg-yellow-500',
    high: 'bg-green-500'
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-green-900/50 border border-green-700 text-green-300 px-4 py-3 rounded-md mb-4">
        <p className="font-bold">Track Identified!</p>
      </div>

      {imageSrc && (
        <div className="mb-4">
          <img src={imageSrc} alt="Track" className="rounded-lg w-full max-h-48 object-contain bg-gray-900" />
        </div>
      )}

      <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700 mb-4">
        <h3 className="text-xl font-bold text-white mb-2">{track.species}</h3>
        <p className="text-gray-400 text-sm italic mb-3">{track.scientificName}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="px-2 py-1 bg-gray-700 rounded text-sm">
            <span className="text-gray-400">Family: </span>
            {track.family}
          </span>
          <span className={`px-2 py-1 rounded text-sm text-white ${confidenceColors[track.confidence]}`}>
            Confidence: {track.confidence}
          </span>
        </div>

        {track.imageUrl && (
          <div className="mt-3">
            <p className="text-gray-400 text-sm mb-1">Reference image:</p>
            <img src={track.imageUrl} alt={track.species} className="rounded w-full max-h-40 object-contain" />
          </div>
        )}

        {track.notes && (
          <p className="text-gray-400 text-sm mt-3">Notes: {track.notes}</p>
        )}
      </div>

      <button
        onClick={onReset}
        className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
      >
        Identify Another
      </button>
    </div>
  );
};

export default ResultsDisplay;