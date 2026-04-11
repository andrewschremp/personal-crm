'use client';
import { useEffect, useState } from 'react';
import { SyncPanel } from '@/components/sync/SyncPanel';
import { ReviewQueue } from '@/components/sync/ReviewQueue';
import { QueueItem } from '@/types/crm';

export default function SyncPage() {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);

  useEffect(() => {
    fetch('/api/queue')
      .then((r) => r.json())
      .then((d) => setQueueItems(Array.isArray(d) ? d : []));
  }, []);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sync & Review Queue</h1>
      <SyncPanel queueCount={queueItems.length} />
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Review Queue</h2>
      <ReviewQueue />
    </div>
  );
}
