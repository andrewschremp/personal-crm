CREATE TABLE IF NOT EXISTS granola_sync_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  name TEXT,
  email TEXT,
  company TEXT,
  meeting_title TEXT,
  meeting_date TIMESTAMPTZ,
  granola_transcript_excerpt TEXT,
  suggested_contact_id TEXT,
  source TEXT DEFAULT 'granola',
  gmail_context TEXT,
  status TEXT DEFAULT 'pending',
  resolved_at TIMESTAMPTZ,
  resolved_by TEXT,
  CONSTRAINT chk_source CHECK (source IN ('granola', 'gmail')),
  CONSTRAINT chk_status CHECK (status IN ('pending', 'created', 'linked', 'dismissed'))
);

CREATE INDEX IF NOT EXISTS idx_granola_sync_queue_status
  ON granola_sync_queue(status);

CREATE INDEX IF NOT EXISTS idx_granola_sync_queue_created
  ON granola_sync_queue(created_at DESC);
