import React, { useState, useEffect } from 'react';
import { AppSettings, Track, UploadState } from './types';
import { identifyTrack } from './services/apiService';
import FileUploader from './components/FileUploader';
import ResultsDisplay from './components/ResultsDisplay';
import Spinner from './components/Spinner';
import ErrorDisplay from './components/ErrorDisplay';
import HistoryView from './components/HistoryView';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [currentView, setCurrentView] = useState<'upload' | 'history' | 'settings'>('upload');
  const [uploadState, setUploadState] = useState<UploadState>(UploadState.IDLE);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem('trackSettings');
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        setSettings(parsed);
        if (!parsed.apiKey) {
          setCurrentView('settings');
        }
      } else {
        setSettings({});
        setCurrentView('settings');
      }
    } catch (e) {
      console.error('Could not parse settings', e);
      setSettings({});
      setCurrentView('settings');
    }
  }, []);

  const handleSaveSettings = (newSettings: AppSettings) => {
    localStorage.setItem('trackSettings', JSON.stringify(newSettings));
    setSettings(newSettings);
    if (currentView === 'settings' && newSettings.apiKey) {
      setCurrentView('upload');
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!settings?.apiKey) {
      setError('Gemini API Key is required. Please add it in Settings.');
      setUploadState(UploadState.ERROR);
      return;
    }

    setUploadState(UploadState.PROCESSING);
    setError(null);
    setTrack(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = (reader.result as string).split(',')[1];
      setUploadedImage(reader.result as string);

      try {
        const result = await identifyTrack(base64Image, file.type, settings.apiKey!);
        if (result.success && result.track) {
          setTrack(result.track);
          setUploadState(UploadState.RESULTS);
        } else {
          setError(result.error || 'Could not identify track');
          setUploadState(UploadState.ERROR);
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setUploadState(UploadState.ERROR);
      }
    };
    reader.onerror = () => {
      setError('Failed to read image file');
      setUploadState(UploadState.ERROR);
    };
  };

  const handleReset = () => {
    setUploadState(UploadState.IDLE);
    setUploadedImage(null);
    setTrack(null);
    setError(null);
  };

  const renderView = () => {
    if (settings === null) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <Spinner message="Loading..." />
        </div>
      );
    }

    switch (currentView) {
      case 'settings':
        return <Settings initialSettings={settings} onSave={handleSaveSettings} />;
      case 'history':
        return <HistoryView />;
      case 'upload':
      default:
        switch (uploadState) {
          case UploadState.IDLE:
            return <FileUploader onFileUpload={handleImageUpload} />;
          case UploadState.PROCESSING:
            return <Spinner message="Analyzing track..." />;
          case UploadState.RESULTS:
            return (
              <ResultsDisplay
                imageSrc={uploadedImage}
                track={track}
                onReset={handleReset}
              />
            );
          case UploadState.ERROR:
            return <ErrorDisplay message={error || 'Unknown error'} onReset={handleReset} />;
          default:
            return null;
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4">
      <div className="w-full max-w-md mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-green-400">Tracks Identifier</h1>
          <p className="text-sm text-gray-400">Slovakia & Central Europe</p>
        </header>

        <nav className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setCurrentView('upload')}
            className={`px-4 py-2 rounded-lg transition ${
              currentView === 'upload' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Identify
          </button>
          <button
            onClick={() => setCurrentView('history')}
            className={`px-4 py-2 rounded-lg transition ${
              currentView === 'history' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setCurrentView('settings')}
            className={`px-4 py-2 rounded-lg transition ${
              currentView === 'settings' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Settings
          </button>
        </nav>

        <main className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          {renderView()}
        </main>

        <footer className="text-center mt-6 text-gray-500 text-xs">
          <p>Powered by Google Gemini AI</p>
        </footer>
      </div>
    </div>
  );
};

export default App;