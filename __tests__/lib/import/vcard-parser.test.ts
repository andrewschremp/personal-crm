import { parseVcard } from '@/lib/import/vcard-parser';

const singleVcard = `BEGIN:VCARD
VERSION:3.0
FN:Alice Johnson
EMAIL;type=INTERNET:alice@example.com
TEL;type=CELL:555-9876
ORG:Gamma LLC
TITLE:VP Sales
ADR;type=HOME:;;123 Main St;Boulder;CO;80301;USA
URL:https://linkedin.com/in/alicejohnson
END:VCARD`;

describe('parseVcard', () => {
  it('parses a single vCard', () => {
    const contacts = parseVcard(singleVcard);
    expect(contacts).toHaveLength(1);
    expect(contacts[0].name).toBe('Alice Johnson');
    expect(contacts[0].email).toBe('alice@example.com');
    expect(contacts[0].company).toBe('Gamma LLC');
    expect(contacts[0].title).toBe('VP Sales');
    expect(contacts[0].linkedin_url).toBe('https://linkedin.com/in/alicejohnson');
  });

  it('parses multiple vCards in one file', () => {
    const multi = singleVcard + '\nBEGIN:VCARD\nVERSION:3.0\nFN:Bob Lee\nEND:VCARD';
    const contacts = parseVcard(multi);
    expect(contacts).toHaveLength(2);
  });
});
