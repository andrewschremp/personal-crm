import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const contactId = new URL(req.url).searchParams.get('contact_id');
  if (!contactId) return NextResponse.json({ error: 'contact_id required' }, { status: 400 });

  const { data, error } = await supabase
    .from('contact_reminders')
    .select('*')
    .eq('contact_id', contactId)
    .order('reminder_date');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();
  const { data, error } = await supabase.from('contact_reminders').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const supabase = createServerClient();
  const id = new URL(req.url).searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { error } = await supabase.from('contact_reminders').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
