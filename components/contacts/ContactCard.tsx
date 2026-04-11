import { Contact } from '@/types/crm';

const priorityColors: Record<string, string> = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};

export function ContactCard({ contact, onClick }: { contact: Contact; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-medium text-gray-900">{contact.name}</div>
          {contact.title && contact.company && (
            <div className="text-sm text-gray-500">{contact.title} · {contact.company}</div>
          )}
          {contact.email && (
            <div className="text-xs text-gray-400 mt-1">{contact.email}</div>
          )}
        </div>
        {contact.priority && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[contact.priority] ?? ''}`}>
            {contact.priority}
          </span>
        )}
      </div>
    </button>
  );
}
