import { NextResponse } from 'next/server';

export async function POST() {
  const webhookUrl = process.env.SYNC_AGENT_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: 'Sync agent not yet configured. Set SYNC_AGENT_WEBHOOK_URL in env vars.' },
      { status: 503 }
    );
  }

  const res = await fetch(webhookUrl, { method: 'POST' });
  if (!res.ok) return NextResponse.json({ error: 'Agent trigger failed' }, { status: 502 });
  return NextResponse.json({ triggered: true });
}
