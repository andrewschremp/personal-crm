import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const url = new URL(req.url);
  const contactId = url.searchParams.get('contact_id');
  const type = url.searchParams.get('type');

  let query = supabase
    .from('contact_interactions')
    .select('*')
    .order('interaction_date', { ascending: false });

  if (contactId) query = (query as any).eq('contact_id', contactId);
  if (type) query = (query as any).eq('interaction_type', type);

  if (!contactId && !type) {
    return NextResponse.json({ error: 'contact_id or type required' }, { status: 400 });
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();
  const { data, error } = await supabase.from('contact_interactions').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
