import fs from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let body: { message?: unknown; page?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const page = typeof body.page === 'string' ? body.page.slice(0, 300) : '';
  if (message.length < 1 || message.length > 2000) {
    return NextResponse.json({ error: 'Message must be 1 to 2000 characters' }, { status: 400 });
  }
  const record = { message, page, at: new Date().toISOString() };
  try {
    const webhook = process.env.FEEDBACK_WEBHOOK_URL;
    if (webhook) {
      const text = `Feedback${page ? ` on ${page}` : ''}: ${message}`;
      const res = await fetch(webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, content: text, ...record }) });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    } else {
      const dir = path.join(process.cwd(), '.data');
      await fs.mkdir(dir, { recursive: true });
      await fs.appendFile(path.join(dir, 'feedback.jsonl'), `${JSON.stringify(record)}\n`);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Feedback save failed', err);
    return NextResponse.json({ error: 'Could not save feedback' }, { status: 500 });
  }
}
