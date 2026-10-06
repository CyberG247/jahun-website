import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CouncilCertificate } from '@/components/council-certificate';
import { services, councilTSADetails } from '@/lib/portal-data';

describe('CouncilCertificate Component', () => {
  it('renders official Chairman signature and council seal', () => {
    render(
      <CouncilCertificate
        applicationId="550e8400-e29b-41d4-a716-446655440000"
        serviceId="indigene"
        fullName="Fatima Aliyu"
        ward="Jahun"
        details={{
          'Village / Community': 'Jahun Central',
          'Family / Compound name': 'Gidan Magaji',
          'National Identification Number (NIN)': '12345678901',
          'Father’s full name': 'Aliyu Mohammed',
          'TSA Reference': 'TSA-JLG-2026-X88B9Q',
          'Amount Paid': '₦2,500.00'
        }}
      />
    );

    // Verifies official Chairman sign and title
    expect(screen.getByText('Hon. Jamilu M. Danmalam')).toBeDefined();
    expect(screen.getByText('Hon. Jamilu Muhammad Danmalam')).toBeDefined();
    expect(screen.getByText(/Executive Chairman, Jahun LGA/i)).toBeDefined();

    // Verifies official seal stamp text
    expect(screen.getByText('OFFICIAL SEAL')).toBeDefined();
    expect(screen.getByText('EXECUTIVE CHAIRMAN')).toBeDefined();

    // Verifies certificate title and citizen particulars
    expect(screen.getByText(/Certificate of Local Government Origin & Indigene Status/i)).toBeDefined();
    expect(screen.getAllByText('Fatima Aliyu').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Jahun Ward').length).toBeGreaterThanOrEqual(1);

    // Verifies Treasury Single Account (TSA) clearance
    expect(screen.getByText(/Treasury Single Account \(TSA\) Clearance:/i)).toBeDefined();
    expect(screen.getByText('TSA-JLG-2026-X88B9Q')).toBeDefined();
    expect(screen.getByText(councilTSADetails.accountNumber, { exact: false })).toBeDefined();
  });

  it('renders business premises registration certificate with Chairman seal', () => {
    render(
      <CouncilCertificate
        applicationId="6ba7b810-9dad-11d1-80b4-00c04fd430c8"
        serviceId="business"
        fullName="Ibrahim Sani"
        ward="Aujara"
        details={{
          'Business name': 'Danmalam Agro Services',
          'Trade category': 'Agricultural Produce, Grains & Seeds',
          'Premises address': 'Aujara Central Market',
          'TSA Reference': 'TSA-JLG-2026-B12Z9P',
          'Amount Paid': '₦5,000.00'
        }}
      />
    );

    expect(screen.getByText(/Certificate of Business Premises Registration/i)).toBeDefined();
    expect(screen.getByText('Danmalam Agro Services')).toBeDefined();
    expect(screen.getByText('TSA-JLG-2026-B12Z9P')).toBeDefined();
    expect(screen.getByText('Hon. Jamilu M. Danmalam')).toBeDefined();
  });
});
