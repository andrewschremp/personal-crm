import { Contact, ImportedContact, DuplicateMatch } from '@/types/crm';

// Levenshtein distance-based similarity (0–1)
export function similarity(a: string, b: string): number {
  const s1 = a.toLowerCase().trim();
  const s2 = b.toLowerCase().trim();
  if (s1 === s2) return 1;
  const len1 = s1.length, len2 = s2.length;
  const matrix: number[][] = Array.from({ length: len1 + 1 }, (_, i) =>
    Array.from({ length: len2 + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      matrix[i][j] = s1[i - 1] === s2[j - 1]
        ? matrix[i - 1][j - 1]
        : 1 + Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]);
    }
  }
  return 1 - matrix[len1][len2] / Math.max(len1, len2);
}

const FUZZY_THRESHOLD = 0.6;

export function findDuplicates(
  incoming: ImportedContact[],
  existing: Contact[]
): DuplicateMatch[] {
  return incoming.map((item) => {
    // 1. Exact email match
    if (item.email) {
      const emailMatch = existing.find(
        (c) => c.email && c.email.toLowerCase() === item.email!.toLowerCase()
      );
      if (emailMatch) return { incoming: item, existing: emailMatch, match_type: 'exact_email' as const };
    }

    // 2. Fuzzy name match
    let bestMatch: Contact | undefined;
    let bestScore = 0;
    for (const c of existing) {
      const score = similarity(item.name, c.name);
      if (score > bestScore) { bestScore = score; bestMatch = c; }
    }
    if (bestScore >= FUZZY_THRESHOLD) {
      return { incoming: item, existing: bestMatch, match_type: 'fuzzy_name' as const, similarity: bestScore };
    }

    return { incoming: item, match_type: 'none' as const };
  });
}
