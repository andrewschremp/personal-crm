import { parseGoogleContactsCsv, parseLinkedInCsv } from '@/lib/import/csv-parser';

const googleCsv = `Name,Given Name,Family Name,E-mail 1 - Value,Phone 1 - Value,Organization 1 - Name,Organization 1 - Title,Address 1 - City
John Doe,John,Doe,john@example.com,555-1234,Acme Corp,Engineer,Denver`;

const linkedinCsv = `First Name,Last Name,Email Address,Company,Position
Jane,Smith,jane@example.com,Beta Inc,Director`;

describe('parseGoogleContactsCsv', () => {
  it('parses name, email, company, title, location', () => {
    const contacts = parseGoogleContactsCsv(googleCsv);
    expect(contacts).toHaveLength(1);
    expect(contacts[0].name).toBe('John Doe');
    expect(contacts[0].email).toBe('john@example.com');
    expect(contacts[0].company).toBe('Acme Corp');
    expect(contacts[0].title).toBe('Engineer');
    expect(contacts[0].location).toBe('Denver');
  });
});

describe('parseLinkedInCsv', () => {
  it('parses first+last name, email, company, title', () => {
    const contacts = parseLinkedInCsv(linkedinCsv);
    expect(contacts).toHaveLength(1);
    expect(contacts[0].name).toBe('Jane Smith');
    expect(contacts[0].email).toBe('jane@example.com');
    expect(contacts[0].company).toBe('Beta Inc');
    expect(contacts[0].title).toBe('Director');
  });
});
