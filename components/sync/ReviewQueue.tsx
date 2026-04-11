'use client';
import { useEffect, useState } from 'react';
import { QueueItem } from '@/types/crm';

export function ReviewQueue() {
  const [items, setItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/queue')
      .then((r) => r.json())
      .then((d) => { setItems(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const resolve = async (id: string, action: 'create' | 'link' | 'dismiss') => {
    await fetch('/api/queue', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (loading) return <div className="text-sm text-gray-400">Loading…</div>;
  if (!items.length) return <div className="text-sm text-gray-500 bg-gray-50 rounded p-4">No items pending review.</div>;

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="font-medium text-gray-900">{item.name ?? 'Unknown'}</div>
              <div className="text-sm text-gray-500">
                {item.email && <span>{item.email} · </span>}
                {item.company && <span>{item.company} · </span>}
                <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{item.source}</span>
              </div>
              {item.meeting_title && (
                <div className="text-xs text-gray-400 mt-1">Meeting: {item.meeting_title}</div>
              )}
              {item.gmail_context && (
                <div className="text-xs text-gray-400 mt-1 italic">{item.gmail_context}</div>
              )}
            </div>
            <div className="flex gap-2 text-sm shrink-0">
              <button onClick={() => resolve(item.id, 'create')}
                className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">Create</button>
              <button onClick={() => resolve(item.id, 'dismiss')}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200">Dismiss</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
