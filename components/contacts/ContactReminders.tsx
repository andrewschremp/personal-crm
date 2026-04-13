'use client';
import { useEffect, useState } from 'react';
import { Reminder } from '@/types/crm';

export function ContactReminders({ contactId }: { contactId: string }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/reminders?contact_id=${contactId}`)
      .then(r => r.json())
      .then(d => setReminders(Array.isArray(d) ? d : []));
  }, [contactId]);

  const handleAdd = async () => {
    if (!date || !note.trim()) return;
    setSaving(true);
    const res = await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact_id: contactId, reminder_date: date, note }),
    });
    const created = await res.json();
    setReminders(prev => [...prev, created]);
    setDate('');
    setNote('');
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/reminders?id=${id}`, { method: 'DELETE' });
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const handleToggle = async (r: Reminder) => {
    const newStatus = r.status === 'completed' ? 'pending' : 'completed';
    await fetch(`/api/reminders`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: r.id, status: newStatus }),
    });
    setReminders(prev => prev.map(x => x.id === r.id ? { ...x, status: newStatus } : x));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1.5 text-sm"
        />
        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Reminder note..."
          className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm"
        />
        <button
          onClick={handleAdd}
          disabled={saving}
          className="bg-gray-900 text-white text-sm px-3 py-1.5 rounded disabled:opacity-60"
        >
          Add
        </button>
      </div>
      {reminders.length === 0 ? (
        <div className="text-sm text-gray-400">No reminders set.</div>
      ) : (
        <div className="space-y-2">
          {reminders.map(r => (
            <div key={r.id} className={`flex items-center gap-3 border rounded p-3 ${r.status === 'completed' ? 'opacity-50' : ''}`}>
              <input
                type="checkbox"
                checked={r.status === 'completed'}
                onChange={() => handleToggle(r)}
                className="cursor-pointer"
              />
              <div className="flex-1">
                <div className="text-sm text-gray-700">{r.message}</div>
                <div className="text-xs text-gray-400">{new Date(r.reminder_date).toLocaleDateString()}</div>
              </div>
              <button onClick={() => handleDelete(r.id)} className="text-gray-400 hover:text-red-500 text-sm">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
