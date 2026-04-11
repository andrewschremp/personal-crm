import { createBrowserClient } from '@/lib/supabase';

describe('supabase client', () => {
  it('creates a browser client without throwing', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
    expect(() => createBrowserClient()).not.toThrow();
  });
});
