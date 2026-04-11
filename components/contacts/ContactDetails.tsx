'use client';
import { useState } from 'react';
import { Contact } from '@/types/crm';

const FIELDS: { key: keyof Contact; label: string; type?: string }[] = [
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phone', label: 'Phone' },
  { key: 'company', label: 'Company' },
  { key: 'title', label: 'Title' },
  { key: 'location', label: 'Location' },
  { key: 'linkedin_url', label: 'LinkedIn URL', type: 'url' },
  { key: 'priority', label: 'Priority' },
  { key: 'relationship_strength', label: 'Relationship Strength', type: 'number' },
  { key: 'contact_cadence', label: 'Contact Cadence' },
  { key: 'next_follow_up', label: 'Next Follow-up', type: 'date' },
  { key: 'birthday', label: 'Birthday', type: 'date' },
  { key: 'anniversary', label: 'Anniversary', type: 'date' },
  { key: 'kids', label: 'Kids' },
  { key: 'notes', label: 'Notes' },
  { key: 'interesting_facts', label: 'Interesting Facts' },
];

export function ContactDetails({ contact, onSave }: { contact: Contact; onSave: (c: Contact) => void }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Contact>(contact);

  const handleSave = async () => {
    const res = await fetch(`/api/contacts/${contact.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    onSave(updated);
    setEditing(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end gap-2">
        {editing ? (
          <>
            <button onClick={() => setEditing(false)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
            <button onClick={handleSave} className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded">Save</button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded">Edit</button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {FIELDS.map(({ key, label, type }) => (
          <div key={key} className="col-span-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
            {editing ? (
              <input
                type={type ?? 'text'}
                value={String(form[key] ?? '')}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm mt-1"
              />
            ) : (
              <div className="text-sm text-gray-900 mt-1">{String(contact[key] ?? '—')}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
