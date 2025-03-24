import { NextResponse } from 'next/server';

export async function GET() {
    await fetch(`https://${process.env.VERCEL_URL}/`)
  return NextResponse.json({ ok: true });
}