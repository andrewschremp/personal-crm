import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { ImportedContact } from '@/types/crm';

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const { decisions } = await req.json() as {
    decisions: Array<{
      contact: ImportedContact;
      action: 'create' | 'skip' | 'merge';
      merge_id?: string;
    }>
  };

  const created: unknown[] = [];
  const merged: unknown[] = [];

  for (const d of decisions) {
    if (d.action === 'skip') continue;

    const payload = {
      name: d.contact.name,
      email: d.contact.email,
      phone: d.contact.phone,
      company: d.contact.company,
      title: d.contact.title,
      location: d.contact.location,
      linkedin_url: d.contact.linkedin_url,
      notes: d.contact.notes,
    };

    if (d.action === 'create') {
      const { data, error } = await supabase.from('contacts').insert(payload).select().single();
      if (!error && data) created.push(data);
    } else if (d.action === 'merge' && d.merge_id) {
      const { data, error } = await supabase
        .from('contacts')
        .update(payload)
        .eq('id', d.merge_id)
        .select()
        .single();
      if (!error && data) merged.push(data);
    }
  }

  return NextResponse.json({ created: created.length, merged: merged.length });
}
