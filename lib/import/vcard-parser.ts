import { ImportedContact } from '@/types/crm';

export function parseVcard(vcf: string): ImportedContact[] {
  const cards = vcf.split(/BEGIN:VCARD/i).slice(1);
  return cards.map((card, i) => {
    const get = (field: string): string | undefined => {
      const match = card.match(new RegExp(`^${field}[^:]*:(.+)$`, 'im'));
      return match ? match[1].trim() : undefined;
    };

    const name = get('FN') ?? '';
    const email = get('EMAIL');
    const phone = get('TEL');
    const company = get('ORG');
    const title = get('TITLE');
    const linkedin_url = (() => {
      const url = get('URL');
      return url?.includes('linkedin') ? url : undefined;
    })();

    // ADR format: ;;street;city;state;zip;country
    const adr = get('ADR');
    const location = adr ? adr.split(';')[3]?.trim() || undefined : undefined;

    return { name, email, phone, company, title, location, linkedin_url, source_row: i };
  });
}
