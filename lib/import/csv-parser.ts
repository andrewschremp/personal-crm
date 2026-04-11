import { ImportedContact } from '@/types/crm';

function parseCsvRows(csv: string): Record<string, string>[] {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map((h) => h.replace(/^"|"$/g, '').trim());
  return lines.slice(1).map((line, i) => {
    const values = line.split(',').map((v) => v.replace(/^"|"$/g, '').trim());
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => { row[h] = values[idx] ?? ''; });
    row['__row'] = String(i + 1);
    return row;
  });
}

export function parseGoogleContactsCsv(csv: string): ImportedContact[] {
  return parseCsvRows(csv)
    .filter((row) => row['Name'] || row['Given Name'])
    .map((row) => ({
      name: row['Name'] || `${row['Given Name']} ${row['Family Name']}`.trim(),
      email: row['E-mail 1 - Value'] || undefined,
      phone: row['Phone 1 - Value'] || undefined,
      company: row['Organization 1 - Name'] || undefined,
      title: row['Organization 1 - Title'] || undefined,
      location: row['Address 1 - City'] || undefined,
      source_row: parseInt(row['__row'], 10),
    }));
}

export function parseLinkedInCsv(csv: string): ImportedContact[] {
  return parseCsvRows(csv)
    .filter((row) => row['First Name'] || row['Last Name'])
    .map((row) => ({
      name: `${row['First Name']} ${row['Last Name']}`.trim(),
      email: row['Email Address'] || undefined,
      company: row['Company'] || undefined,
      title: row['Position'] || undefined,
      source_row: parseInt(row['__row'], 10),
    }));
}
