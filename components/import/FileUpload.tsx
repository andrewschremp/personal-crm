'use client';
import { useRef, useState } from 'react';
import { DuplicateMatch, ImportedContact } from '@/types/crm';

const sources = [
  { id: 'google', label: 'Google Contacts', hint: 'CSV export from contacts.google.com', accept: '.csv' },
  { id: 'linkedin', label: 'LinkedIn Connections', hint: 'CSV from LinkedIn data export', accept: '.csv' },
  { id: 'vcard', label: 'iPhone / iCloud (vCard)', hint: '.vcf file from contacts app', accept: '.vcf' },
];

export function FileUpload({ onParsed }: {
  onParsed: (source: string, data: { imported: ImportedContact[]; matches: DuplicateMatch[] }) => void
}) {
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (source: string, file: File) => {
    setLoading(source);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('source', source);
      const res = await fetch('/api/import', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? 'Import failed. Please try again.');
        return;
      }
      if (!data.matches || !Array.isArray(data.matches)) {
        setError('Unexpected response from server. Please try again.');
        return;
      }
      onParsed(source, data);
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="grid gap-4">
        {sources.map((s) => (
          <div key={s.id} className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">{s.label}</div>
              <div className="text-sm text-gray-500">{s.hint}</div>
            </div>
            <input
              type="file"
              accept={s.accept}
              ref={(el) => { fileRefs.current[s.id] = el; }}
              onChange={(e) => { if (e.target.files?.[0]) handleFile(s.id, e.target.files[0]); }}
              className="hidden"
            />
            <button
              onClick={() => fileRefs.current[s.id]?.click()}
              disabled={loading === s.id}
              className="bg-gray-900 text-white text-sm px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-60 min-w-[110px]"
            >
              {loading === s.id ? 'Parsing…' : 'Choose File'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
