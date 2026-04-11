import { ImportedContact } from '@/types/crm';

function parseCsvRows(csv: string): Record<string, string>[] {
  // RFC 4180 compliant CSV parser
  function parseRow(line: string): string[] {
    const fields: string[] = [];
    let i = 0;
    while (i < line.length) {
      if (line[i] === '"') {
        // Quoted field
        let field = '';
        i++; // skip opening quote
        while (i < line.length) {
          if (line[i] === '"' && line[i + 1] === '"') {
            field += '"';
            i += 2;
          } else if (line[i] === '"') {
            i++; // skip closing quote
            break;
          } else {
            field += line[i++];
          }
        }
        fields.push(field.trim());
        if (line[i] === ',') i++; // skip comma
      } else {
        // Unquoted field
        const end = line.indexOf(',', i);
        if (end === -1) {
          fields.push(line.slice(i).trim());
          break;
        } else {
          fields.push(line.slice(i, end).trim());
          i = end + 1;
        }
      }
    }
    return fields;
  }

  // Split on newlines but handle \r\n
  const lines = csv.trim().split(/\r?\n/);
  const headers = parseRow(lines[0]);
  return lines.slice(1)
    .filter(line => line.trim())
    .map((line, i) => {
      const values = parseRow(line);
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
