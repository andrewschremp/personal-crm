import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.BRIEF_AGENT_WEBHOOK_URL;

  if (!webhookUrl) {
    return NextResponse.json(
      { error: 'Brief agent not yet configured. Set BRIEF_AGENT_WEBHOOK_URL in env vars.' },
      { status: 503 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) return NextResponse.json({ error: 'Agent trigger failed' }, { status: 502 });
  return NextResponse.json({ triggered: true });
}
