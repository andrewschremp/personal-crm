import { similarity, findDuplicates } from '@/lib/dedup';
import { Contact, ImportedContact } from '@/types/crm';

const makeContact = (overrides: Partial<Contact>): Contact => ({
  id: '1', created_at: '', name: 'John Doe', ...overrides
});

const makeImported = (overrides: Partial<ImportedContact>): ImportedContact => ({
  name: 'John Doe', source_row: 0, ...overrides
});

describe('similarity', () => {
  it('returns 1 for identical strings', () => {
    expect(similarity('John Doe', 'John Doe')).toBe(1);
  });

  it('returns 0 for completely different strings', () => {
    expect(similarity('abc', 'xyz')).toBeLessThan(0.2);
  });

  it('returns high score for minor typo', () => {
    expect(similarity('John Doe', 'Jon Doe')).toBeGreaterThan(0.8);
  });
});

describe('findDuplicates', () => {
  it('matches by exact email', () => {
    const incoming = [makeImported({ email: 'john@example.com' })];
    const existing = [makeContact({ email: 'john@example.com' })];
    const results = findDuplicates(incoming, existing);
    expect(results[0].match_type).toBe('exact_email');
    expect(results[0].existing?.id).toBe('1');
  });

  it('matches by fuzzy name when email missing', () => {
    const incoming = [makeImported({ name: 'Jon Doe', email: undefined })];
    const existing = [makeContact({ name: 'John Doe', email: undefined })];
    const results = findDuplicates(incoming, existing);
    expect(results[0].match_type).toBe('fuzzy_name');
    expect(results[0].similarity).toBeGreaterThan(0.6);
  });

  it('returns none when no match', () => {
    const incoming = [makeImported({ name: 'Alice Smith', email: 'alice@x.com' })];
    const existing = [makeContact({ name: 'Bob Jones', email: 'bob@x.com' })];
    const results = findDuplicates(incoming, existing);
    expect(results[0].match_type).toBe('none');
    expect(results[0].existing).toBeUndefined();
  });

  it('prefers exact email over fuzzy name', () => {
    const incoming = [makeImported({ name: 'Johnny Doe', email: 'john@example.com' })];
    const existing = [makeContact({ name: 'John Doe', email: 'john@example.com' })];
    const results = findDuplicates(incoming, existing);
    expect(results[0].match_type).toBe('exact_email');
  });
});
