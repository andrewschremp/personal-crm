import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { parseGoogleContactsCsv, parseLinkedInCsv } from '@/lib/import/csv-parser';
import { parseVcard } from '@/lib/import/vcard-parser';
import { findDuplicates } from '@/lib/dedup';
import { Contact } from '@/types/crm';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const sourceType = formData.get('source') as string;

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const text = await file.text();

  let imported;
  if (sourceType === 'google') imported = parseGoogleContactsCsv(text);
  else if (sourceType === 'linkedin') imported = parseLinkedInCsv(text);
  else if (sourceType === 'vcard') imported = parseVcard(text);
  else return NextResponse.json({ error: 'Unknown source type' }, { status: 400 });

  const supabase = createServerClient();
  const { data: existing, error } = await supabase.from('documents').select('id, name, email, created_at');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const matches = findDuplicates(imported, (existing ?? []) as Contact[]);
  return NextResponse.json({ imported, matches });
}
