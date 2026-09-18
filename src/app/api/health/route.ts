import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Lightweight healthcheck endpoint for Supabase keep-alive monitoring.
 * 
 * Connect a free uptime service (UptimeRobot, cron-job.org) to ping
 * GET /api/health every 24-48 hours. This prevents Supabase free-tier
 * projects from auto-pausing after 7 days of inactivity.
 */
export async function GET() {
  const timestamp = new Date().toISOString();

  const supabase = getSupabaseClient();
  let dbStatus = 'no-client';
  if (supabase) {
    try {
      const { error } = await supabase.from('events').select('id').limit(1);
      dbStatus = error ? `error: ${error.message}` : 'connected';
    } catch (e) {
      dbStatus = 'unreachable';
    }
  }

  return NextResponse.json({
    status: 'ok',
    timestamp,
    db: dbStatus,
    version: '1.0.0',
  });
}
