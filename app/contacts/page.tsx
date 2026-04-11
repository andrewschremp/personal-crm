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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
        <button
          onClick={() => setAdding(true)}
          className="bg-gray-900 text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
        >
          + Add Contact
        </button>
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
