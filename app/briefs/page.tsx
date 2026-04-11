import { BriefList } from '@/components/briefs/BriefList';

export default function BriefsPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Meeting Briefs</h1>
      <BriefList />
    </div>
  );
}
