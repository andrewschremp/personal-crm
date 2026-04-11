import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('granola_sync_queue')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const supabase = createServerClient();
  const { id, action, contact_id } = await req.json();
  const statusMap: Record<string, string> = {
    create: 'created', link: 'linked', dismiss: 'dismissed'
  };

  const updates: Record<string, unknown> = {
    status: statusMap[action],
    resolved_at: new Date().toISOString(),
    resolved_by: 'andrew',
  };
  if (contact_id) updates.suggested_contact_id = contact_id;

  const { data, error } = await supabase
    .from('granola_sync_queue')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
