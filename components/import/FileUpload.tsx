'use client';
import { useRef } from 'react';
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

  const handleFile = async (source: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source', source);
    const res = await fetch('/api/import', { method: 'POST', body: formData });
    const data = await res.json();
    onParsed(source, data);
  };

  return (
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
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded hover:bg-gray-700"
          >
            Choose File
          </button>
        </div>
      ))}
    </div>
  );
}
