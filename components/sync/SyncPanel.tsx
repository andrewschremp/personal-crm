'use client';
import { useState } from 'react';

export function SyncPanel({ queueCount }: { queueCount: number }) {
  const [syncing, setSyncing] = useState(false);

  const triggerSync = async () => {
    setSyncing(true);
    await fetch('/api/sync/trigger', { method: 'POST' });
    setTimeout(() => setSyncing(false), 3000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">Granola Sync</h2>
          <p className="text-sm text-gray-500 mt-1">
            Nightly at 11pm MT — or trigger manually
            {queueCount > 0 && (
              <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-full">
                {queueCount} pending review
              </span>
            )}
          </p>
        </div>
        <button
          onClick={triggerSync}
          disabled={syncing}
          className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 disabled:opacity-60"
        >
          {syncing ? 'Sync in progress…' : 'Sync from Granola'}
        </button>
      </div>
    </div>
  );
}
