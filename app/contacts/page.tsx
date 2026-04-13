'use client';
import { useState } from 'react';
import { Contact } from '@/types/crm';
import { ContactList } from '@/components/contacts/ContactList';
import { ContactModal } from '@/components/contacts/ContactModal';
import { AddContactModal } from '@/components/contacts/AddContactModal';

export default function ContactsPage() {
  const [selected, setSelected] = useState<Contact | null>(null);
  const [adding, setAdding] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAdded = (contact: Contact) => {
    setAdding(false);
    setSelected(contact);
    setRefreshKey(k => k + 1);
  };

  const handleExport = async () => {
    const res = await fetch('/api/contacts');
    const contacts: Contact[] = await res.json();
    if (!Array.isArray(contacts) || contacts.length === 0) {
      alert('No contacts to export.');
      return;
    }
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Title', 'Location', 'LinkedIn', 'Priority', 'Notes'];
    const rows = contacts.map(c => [
      c.name, c.email ?? '', c.phone ?? '', c.company ?? '', c.title ?? '',
      c.location ?? '', c.linkedin_url ?? '', c.priority ?? '', c.notes ?? ''
    ].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="text-sm border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">
            Export CSV
          </button>
          <button
            onClick={() => setAdding(true)}
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
          >
            + Add Contact
          </button>
        </div>
      </div>
      <ContactList key={refreshKey} onSelect={setSelected} />
      {selected && (
        <ContactModal contact={selected} onClose={() => setSelected(null)} />
      )}
      {adding && (
        <AddContactModal onAdded={handleAdded} onClose={() => setAdding(false)} />
      )}
    </div>
  );
}
