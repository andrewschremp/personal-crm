import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('search');
  const priority = searchParams.get('priority');

  let query = supabase
    .from('contacts')
    .select('*')
    .order('name');

  if (search) query = (query as any).ilike('name', `%${search}%`);
  if (priority && priority !== 'All') query = (query as any).eq('priority', priority);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();
  const { data, error } = await supabase.from('contacts').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
