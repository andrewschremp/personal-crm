'use client';
import { useState } from 'react';
import { Contact } from '@/types/crm';
import { ContactDetails } from './ContactDetails';
import { ContactInteractions } from './ContactInteractions';
import { ContactReminders } from './ContactReminders';

type Tab = 'details' | 'interactions' | 'reminders';

export function ContactModal({ contact: initial, onClose }: { contact: Contact; onClose: () => void }) {
  const [contact, setContact] = useState(initial);
  const [tab, setTab] = useState<Tab>('details');
  const [generating, setGenerating] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${contact.name}? This cannot be undone.`)) return;
    await fetch(`/api/contacts/${contact.id}`, { method: 'DELETE' });
    onClose();
  };

  const generateBrief = async () => {
    setGenerating(true);
    await fetch('/api/briefs/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact_id: contact.id, contact_name: contact.name }),
    });
    setGenerating(false);
    alert('Brief generation triggered — check Slack in a moment.');
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-start justify-between p-5 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{contact.name}</h2>
            {contact.title && contact.company && (
              <p className="text-sm text-gray-500">{contact.title} · {contact.company}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="text-sm text-red-600 hover:text-red-800 px-3 py-1.5 rounded border border-red-200 hover:border-red-400"
            >
              Delete
            </button>
            <button
              onClick={generateBrief}
              disabled={generating}
              className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {generating ? 'Generating…' : 'Generate Brief'}
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>
        </div>

        <div className="flex border-b border-gray-200 px-5">
          {(['details', 'interactions', 'reminders'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 px-4 text-sm font-medium capitalize border-b-2 transition-colors ${
                tab === t ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 p-5">
          {tab === 'details' && <ContactDetails contact={contact} onSave={setContact} />}
          {tab === 'interactions' && <ContactInteractions contactId={contact.id} />}
          {tab === 'reminders' && <ContactReminders contactId={contact.id} />}
        </div>
      </div>
    </div>
  );
}
