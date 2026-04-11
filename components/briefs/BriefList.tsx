'use client';
import { useEffect, useState } from 'react';
import { Interaction } from '@/types/crm';

export function BriefList() {
  const [briefs, setBriefs] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/interactions?type=meeting_brief')
      .then((r) => r.json())
      .then((d) => { setBriefs(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  if (loading) return <div className="text-sm text-gray-400">Loading…</div>;
  if (!briefs.length) return <div className="text-sm text-gray-500">No briefs generated yet.</div>;

  return (
    <div className="space-y-4">
      {briefs.map((b) => (
        <div key={b.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-900">{new Date(b.interaction_date).toLocaleDateString()}</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Meeting Brief</span>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{b.summary}</p>
        </div>
      ))}
    </div>
  );
}
