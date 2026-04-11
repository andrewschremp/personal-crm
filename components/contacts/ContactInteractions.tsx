'use client';
import { useEffect, useState } from 'react';
import { Interaction } from '@/types/crm';

const TYPES = ['call', 'email', 'meeting', 'other'] as const;

export function ContactInteractions({ contactId }: { contactId: string }) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [form, setForm] = useState({ interaction_type: 'call', interaction_date: new Date().toISOString().split('T')[0], summary: '' });
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch(`/api/interactions?contact_id=${contactId}`)
      .then(r => r.json())
      .then(d => setInteractions(Array.isArray(d) ? d : []));
  }, [contactId]);

  const handleLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.summary.trim()) return;
    setSaving(true);
    const res = await fetch('/api/interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact_id: contactId, ...form }),
    });
    const created = await res.json();
    setInteractions(prev => [created, ...prev]);
    setForm({ interaction_type: 'call', interaction_date: new Date().toISOString().split('T')[0], summary: '' });
    setSaving(false);
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded"
        >
          + Log Interaction
        </button>
      ) : (
        <form onSubmit={handleLog} className="border border-gray-200 rounded p-4 space-y-3 bg-gray-50">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Type</label>
              <select
                value={form.interaction_type}
                onChange={e => setForm({ ...form, interaction_type: e.target.value })}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm mt-1"
              >
                {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Date</label>
              <input
                type="date"
                value={form.interaction_date}
                onChange={e => setForm({ ...form, interaction_date: e.target.value })}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm mt-1"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Notes</label>
            <textarea
              value={form.summary}
              onChange={e => setForm({ ...form, summary: e.target.value })}
              rows={3}
              placeholder="What happened? Key topics, decisions, follow-ups..."
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm mt-1"
            />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
            <button type="submit" disabled={saving} className="text-sm bg-gray-900 text-white px-3 py-1.5 rounded disabled:opacity-60">
              {saving ? 'Saving…' : 'Log'}
            </button>
          </div>
        </form>
      )}

      {interactions.length === 0 ? (
        <div className="text-sm text-gray-400">No interactions logged yet.</div>
      ) : (
        <div className="space-y-3">
          {interactions.map(i => (
            <div key={i.id} className="border border-gray-200 rounded p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-500 uppercase">{i.interaction_type.replace('_', ' ')}</span>
                <span className="text-xs text-gray-400">{new Date(i.interaction_date).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{i.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
