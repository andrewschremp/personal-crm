export interface Contact {
  id: string;
  created_at: string;
  updated_at?: string;
  // Core identity
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  location?: string;
  linkedin_url?: string;
  // Relationship
  priority?: 'High' | 'Medium' | 'Low';
  relationship_strength?: string;
  contact_cadence?: string;
  next_follow_up?: string;
  // Personal
  birthday?: string;
  anniversary?: string;
  age?: number;
  kids?: string;
  // Content
  tags?: string[];
  notes?: string;
  interesting_facts?: string;
  // Team
  team?: string;
  shared_with?: string[];
}

export interface Interaction {
  id: string;
  contact_id: string;
  created_at: string;
  interaction_type: 'granola_note' | 'meeting_brief' | 'email' | 'call' | 'meeting' | 'other';
  summary: string;
  interaction_date: string;
  metadata?: Record<string, unknown>;
}

export interface Reminder {
  id: string;
  contact_id: string;
  created_at: string;
  reminder_date: string;
  message: string;
  status: string;
  reminder_type?: string;
}

export interface QueueItem {
  id: string;
  created_at: string;
  name?: string;
  email?: string;
  company?: string;
  meeting_title?: string;
  meeting_date?: string;
  granola_transcript_excerpt?: string;
  suggested_contact_id?: string;
  source: 'granola' | 'gmail';
  gmail_context?: string;
  status: 'pending' | 'created' | 'linked' | 'dismissed';
  resolved_at?: string;
  resolved_by?: string;
}

export interface ImportedContact {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  location?: string;
  linkedin_url?: string;
  notes?: string;
  source_row: number;
}

export interface DuplicateMatch {
  incoming: ImportedContact;
  existing?: Contact;
  match_type: 'exact_email' | 'fuzzy_name' | 'none';
  similarity?: number;
}
