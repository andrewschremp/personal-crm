'use client';
import { useState } from 'react';
import { Contact } from '@/types/crm';
import { ContactList } from '@/components/contacts/ContactList';
import { ContactModal } from '@/components/contacts/ContactModal';

export default function ContactsPage() {
  const [selected, setSelected] = useState<Contact | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
      </div>
      <ContactList onSelect={setSelected} />
      {selected && (
        <ContactModal contact={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
