'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/contacts', label: 'Contacts' },
  { href: '/import', label: 'Import' },
  { href: '/sync', label: 'Sync / Queue' },
  { href: '/briefs', label: 'Meeting Briefs' },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <nav className="w-48 min-h-screen bg-gray-900 text-gray-100 flex flex-col p-4 gap-1">
      <div className="text-lg font-semibold mb-6 text-white">CRM</div>
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`px-3 py-2 rounded text-sm transition-colors ${
            pathname.startsWith(item.href)
              ? 'bg-gray-700 text-white'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
