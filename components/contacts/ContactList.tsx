'use client';
import { useState, useEffect } from 'react';
import { Contact } from '@/types/crm';
import { ContactCard } from './ContactCard';

const priorities = ['All', 'High', 'Medium', 'Low'];

export function ContactList({ onSelect }: { onSelect: (c: Contact) => void }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (priority !== 'All') params.set('priority', priority);
    fetch(`/api/contacts?${params}`)
      .then((r) => r.json())
      .then((data) => { setContacts(Array.isArray(data) ? data : []); setLoading(false); });
  }, [search, priority]);

  return (
    <div>
      <div className="flex gap-3 mb-4">
        <input
          type="search"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
        />
        <div className="flex gap-1">
          {priorities.map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={`px-3 py-1.5 rounded text-sm ${priority === p ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="text-gray-400 text-sm">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {contacts.map((c) => (
            <ContactCard key={c.id} contact={c} onClick={() => onSelect(c)} />
          ))}
        </div>
      )}
      <div className="text-xs text-gray-400 mt-3">{contacts.length} contacts</div>
    </div>
  );
}
