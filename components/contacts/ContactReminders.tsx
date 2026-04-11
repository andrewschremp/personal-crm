'use client';
import { useEffect, useState } from 'react';
import { Reminder } from '@/types/crm';

export function ContactReminders({ contactId }: { contactId: string }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    fetch(`/api/reminders?contact_id=${contactId}`)
      .then((r) => r.json())
      .then((d) => setReminders(Array.isArray(d) ? d : []));
  }, [contactId]);

  const addReminder = async () => {
    if (!date || !note) return;
    const res = await fetch('/api/reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact_id: contactId, reminder_date: date, note, completed: false }),
    });
    const created = await res.json();
    setReminders((prev) => [...prev, created]);
    setDate(''); setNote('');
  };

  const deleteReminder = async (id: string) => {
    await fetch(`/api/reminders?id=${id}`, { method: 'DELETE' });
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-sm" />
        <input placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm" />
        <button onClick={addReminder} className="bg-gray-900 text-white px-3 py-1 rounded text-sm">Add</button>
      </div>
      {reminders.map((r) => (
        <div key={r.id} className="flex items-center justify-between border border-gray-200 rounded p-2">
          <div>
            <span className="text-sm font-medium">{new Date(r.reminder_date).toLocaleDateString()}</span>
            <span className="text-sm text-gray-600 ml-2">{r.note}</span>
          </div>
          <button onClick={() => deleteReminder(r.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
        </div>
      ))}
    </div>
  );
}
