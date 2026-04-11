'use client';
import { useEffect, useState } from 'react';
import { Interaction } from '@/types/crm';

export function ContactInteractions({ contactId }: { contactId: string }) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);

  useEffect(() => {
    fetch(`/api/interactions?contact_id=${contactId}`)
      .then((r) => r.json())
      .then((d) => setInteractions(Array.isArray(d) ? d : []));
  }, [contactId]);

  if (!interactions.length) return <div className="text-sm text-gray-400">No interactions yet.</div>;

  return (
    <div className="space-y-3">
      {interactions.map((i) => (
        <div key={i.id} className="border border-gray-200 rounded p-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-500 uppercase">{i.interaction_type.replace('_', ' ')}</span>
            <span className="text-xs text-gray-400">{new Date(i.interaction_date).toLocaleDateString()}</span>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{i.summary}</p>
        </div>
      ))}
    </div>
  );
}
