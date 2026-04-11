'use client';
import { useState } from 'react';
import { FileUpload } from '@/components/import/FileUpload';
import { DedupResolver } from '@/components/import/DedupResolver';
import { DuplicateMatch } from '@/types/crm';

export default function ImportPage() {
  const [matches, setMatches] = useState<DuplicateMatch[] | null>(null);
  const [result, setResult] = useState<{ created: number; merged: number } | null>(null);

  const handleParsed = (_source: string, data: { imported: unknown[]; matches: DuplicateMatch[] }) => {
    setMatches(data.matches);
    setResult(null);
  };

  const handleCommit = async (decisions: unknown[]) => {
    const res = await fetch('/api/import/commit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decisions }),
    });
    const data = await res.json();
    setResult(data);
    setMatches(null);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Import Contacts</h1>
      {result ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
          Import complete: {result.created} created, {result.merged} merged.
          <button onClick={() => setResult(null)} className="ml-4 text-sm underline">Import more</button>
        </div>
      ) : matches ? (
        <DedupResolver matches={matches} onCommit={handleCommit} />
      ) : (
        <FileUpload onParsed={handleParsed} />
      )}
    </div>
  );
}
