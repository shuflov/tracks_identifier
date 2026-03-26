import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onReset: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onReset }) => {
  return (
    <div className="text-center">
      <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md mb-4">
        <p className="font-bold">Error</p>
        <p className="text-sm">{message}</p>
      </div>
      <button
        onClick={onReset}
        className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorDisplay;