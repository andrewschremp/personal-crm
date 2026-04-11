'use client';
import { useState } from 'react';
import { DuplicateMatch, ImportedContact } from '@/types/crm';

type Decision = { contact: ImportedContact; action: 'create' | 'skip' | 'merge'; merge_id?: string };

export function DedupResolver({ matches, onCommit }: {
  matches: DuplicateMatch[];
  onCommit: (decisions: Decision[]) => void;
}) {
  const [decisions, setDecisions] = useState<Decision[]>(
    matches.map((m) => ({
      contact: m.incoming,
      action: m.match_type === 'none' ? 'create' : 'skip',
      merge_id: m.existing?.id,
    }))
  );

  const update = (i: number, action: Decision['action'], merge_id?: string) => {
    setDecisions((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], action, merge_id };
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <div className="text-sm text-gray-600 mb-2">
        Review {matches.length} contacts — resolve any duplicates before committing.
      </div>
      {matches.map((m, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-medium text-sm">{m.incoming.name}</div>
              <div className="text-xs text-gray-500">{m.incoming.email} · {m.incoming.company}</div>
              {m.match_type !== 'none' && m.existing && (
                <div className="text-xs text-yellow-700 mt-1">
                  Possible duplicate: {m.existing.name} ({m.match_type === 'exact_email' ? 'same email' : `${Math.round((m.similarity ?? 0) * 100)}% name match`})
                </div>
              )}
            </div>
            <div className="flex gap-2 text-sm">
              {m.match_type !== 'none' && (
                <>
                  <button
                    onClick={() => update(i, 'merge', m.existing?.id)}
                    className={`px-2 py-1 rounded ${decisions[i].action === 'merge' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >Merge</button>
                  <button
                    onClick={() => update(i, 'skip')}
                    className={`px-2 py-1 rounded ${decisions[i].action === 'skip' ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >Skip</button>
                </>
              )}
              <button
                onClick={() => update(i, 'create')}
                className={`px-2 py-1 rounded ${decisions[i].action === 'create' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >Create New</button>
            </div>
          </div>
        </div>
      ))}
      <div className="pt-2">
        <button
          onClick={() => onCommit(decisions)}
          className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
        >
          Commit {decisions.filter((d) => d.action !== 'skip').length} contacts
        </button>
      </div>
    </div>
  );
}
