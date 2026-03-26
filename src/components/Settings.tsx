import React, { useState } from 'react';
import { AppSettings } from '../types';

interface SettingsProps {
  initialSettings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ initialSettings, onSave }) => {
  const [apiKey, setApiKey] = useState(initialSettings.apiKey || '');
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = () => {
    onSave({ apiKey: apiKey.trim() || undefined });
    setSaveMessage('Settings saved!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Settings</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Gemini API Key
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-gray-200 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          placeholder="Enter your Gemini API key"
        />
        <p className="mt-1 text-xs text-gray-500">
          Get your key from Google AI Studio. Required for identification.
        </p>
      </div>

      <button
        onClick={handleSave}
        className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition"
      >
        Save Settings
      </button>
      
      {saveMessage && (
        <p className="mt-2 text-sm text-green-400 text-center">{saveMessage}</p>
      )}
    </div>
  );
};

export default Settings;