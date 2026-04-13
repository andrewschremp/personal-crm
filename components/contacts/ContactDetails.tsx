'use client';
import { useState } from 'react';
import { Contact } from '@/types/crm';

const CADENCE_OPTIONS = ['No cadence', 'Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Annually'];
const STRENGTH_OPTIONS = ['Not set', 'Weak', 'Moderate', 'Good', 'Strong', 'Very Strong'];

export function ContactDetails({ contact, onSave, onCancel }: {
  contact: Contact;
  onSave: (c: Contact) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Contact>({ ...contact });
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [shareInput, setShareInput] = useState('');

  const set = (key: keyof Contact, value: unknown) => setForm(f => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch(`/api/contacts/${contact.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const updated = await res.json();
      onSave(updated);
    }
    setSaving(false);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t) return;
    const tags = [...(form.tags ?? [])];
    if (!tags.includes(t)) tags.push(t);
    set('tags', tags);
    setTagInput('');
  };

  const removeTag = (tag: string) => set('tags', (form.tags ?? []).filter(t => t !== tag));

  const addShare = () => {
    const s = shareInput.trim();
    if (!s) return;
    const list = [...(form.shared_with ?? [])];
    if (!list.includes(s)) list.push(s);
    set('shared_with', list);
    setShareInput('');
  };

  const removeShare = (name: string) => set('shared_with', (form.shared_with ?? []).filter(s => s !== name));

  const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50';
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';

  return (
    <div className="space-y-6 pb-4">
      {/* Core Contact Info */}
      <div className="space-y-4">
        {form.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>✉</span>
            <span>{form.email}</span>
          </div>
        )}
        {form.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📞</span>
            <span>{form.phone}</span>
          </div>
        )}

        {/* Priority */}
        <div>
          <label className={labelCls}>Priority</label>
          <div className="flex gap-2">
            {(['High', 'Medium', 'Low'] as const).map(p => (
              <button
                key={p}
                onClick={() => set('priority', form.priority === p ? undefined : p)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  form.priority === p
                    ? p === 'High' ? 'bg-red-500 text-white border-red-500'
                    : p === 'Medium' ? 'bg-yellow-500 text-white border-yellow-500'
                    : 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Relationship Strength & Cadence */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>↗ Relationship Strength</label>
            <select
              value={form.relationship_strength ?? ''}
              onChange={e => set('relationship_strength', e.target.value || undefined)}
              className={inputCls}
            >
              {STRENGTH_OPTIONS.map(o => <option key={o} value={o === 'Not set' ? '' : o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>📅 Contact Cadence</label>
            <select
              value={form.contact_cadence ?? ''}
              onChange={e => set('contact_cadence', e.target.value || undefined)}
              className={inputCls}
            >
              {CADENCE_OPTIONS.map(o => <option key={o} value={o === 'No cadence' ? '' : o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Next Follow-up */}
        <div>
          <label className={labelCls}>Next Follow-up</label>
          <input
            type="date"
            value={form.next_follow_up ?? ''}
            onChange={e => set('next_follow_up', e.target.value || undefined)}
            className={inputCls}
          />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Personal Information */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Personal Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>🎁 Birthday</label>
            <input type="date" value={form.birthday ?? ''} onChange={e => set('birthday', e.target.value || undefined)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>📅 Anniversary</label>
            <input type="date" value={form.anniversary ?? ''} onChange={e => set('anniversary', e.target.value || undefined)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Age</label>
            <input type="number" value={form.age ?? ''} onChange={e => set('age', e.target.value ? parseInt(e.target.value) : undefined)} placeholder="Age" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>📍 Location</label>
            <input type="text" value={form.location ?? ''} onChange={e => set('location', e.target.value || undefined)} placeholder="City, State" className={inputCls} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>👥 Kids</label>
            <input type="text" value={form.kids ?? ''} onChange={e => set('kids', e.target.value || undefined)} placeholder="e.g., 2 kids (Emma 8, Jake 5)" className={inputCls} />
          </div>
          <div className="col-span-2">
            <label className={labelCls}>🔗 LinkedIn URL</label>
            <input type="url" value={form.linkedin_url ?? ''} onChange={e => set('linkedin_url', e.target.value || undefined)} placeholder="https://linkedin.com/in/..." className={inputCls} />
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Contact Info fields (editable) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className={labelCls}>Email</label>
          <input type="email" value={form.email ?? ''} onChange={e => set('email', e.target.value || undefined)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input type="tel" value={form.phone ?? ''} onChange={e => set('phone', e.target.value || undefined)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Company</label>
          <input type="text" value={form.company ?? ''} onChange={e => set('company', e.target.value || undefined)} className={inputCls} />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Title</label>
          <input type="text" value={form.title ?? ''} onChange={e => set('title', e.target.value || undefined)} className={inputCls} />
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Interesting Facts */}
      <div>
        <label className={labelCls}>Interesting Facts</label>
        <textarea
          value={form.interesting_facts ?? ''}
          onChange={e => set('interesting_facts', e.target.value || undefined)}
          rows={3}
          placeholder="Hobbies, interests, fun facts..."
          className={inputCls}
        />
      </div>

      {/* Tags */}
      <div>
        <label className={labelCls}>🏷 Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
            placeholder="Add tag..."
            className={`flex-1 ${inputCls}`}
          />
          <button onClick={addTag} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">Add</button>
        </div>
        {(form.tags ?? []).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {(form.tags ?? []).map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full">
                {tag}
                <button onClick={() => removeTag(tag)} className="hover:text-blue-900">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className={labelCls}>📄 Notes</label>
        <textarea
          value={form.notes ?? ''}
          onChange={e => set('notes', e.target.value || undefined)}
          rows={4}
          placeholder="Add notes about this contact..."
          className={inputCls}
        />
      </div>

      <hr className="border-gray-100" />

      {/* Team & Sharing */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Team & Sharing</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Owner</label>
            <select
              value={form.team ?? 'Andrew'}
              onChange={e => set('team', e.target.value)}
              className={inputCls}
            >
              <option value="Andrew">Andrew</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Shared With</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={shareInput}
                onChange={e => setShareInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addShare())}
                placeholder="Add name..."
                className={`flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50`}
              />
              <button onClick={addShare} className="bg-gray-200 text-gray-700 text-sm px-3 py-2 rounded-lg hover:bg-gray-300">+</button>
            </div>
            {(form.shared_with ?? []).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(form.shared_with ?? []).map(name => (
                  <span key={name} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-full">
                    {name}
                    <button onClick={() => removeShare(name)} className="hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
        <button onClick={onCancel} className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="text-sm bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60 font-medium"
        >
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
