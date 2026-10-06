import { describe,it,expect } from 'vitest';
import { applicationSchema } from '@/lib/application-schema';
const valid={service:'business',fullName:'Amina Ibrahim',phone:'08012345678',ward:'Jahun',details:{'Business name':'Amina Grain','CAC / BN number (optional)':'','Trade category':'Grain','Premises address':'Market road','Owner NIN':'12345678901'}};
const validIndigene={service:'indigene',fullName:'Usman Bello',phone:'08098765432',ward:'Aujara',documentPath:'user-id/cert.pdf',details:{'Date of birth':'1998-05-12','Village / Community':'Aujara Town','Family / Compound name':'Gidan Sarki','National Identification Number (NIN)':'12345678901','Father’s full name':'Bello Haruna','Mother’s full name (optional)':'Fati Bello','Purpose of certificate':'Tertiary Institution Admission & Registration'}};
describe('Civic application validation',()=>{
  it('accepts a valid business application',()=>expect(applicationSchema.safeParse(valid).success).toBe(true));
  it('rejects invalid NIN',()=>expect(applicationSchema.safeParse({...valid,details:{...valid.details,'Owner NIN':'123'}}).success).toBe(false));
  it('rejects invalid phone and ward',()=>expect(applicationSchema.safeParse({...valid,phone:'123',ward:'Unknown'}).success).toBe(false));
  it('requires contractor credentials',()=>expect(applicationSchema.safeParse({...valid,service:'contractor',details:{'Company name':'Firm','CAC RC number':'RC123','Public works category':'Roads','Past job references':'School'}}).success).toBe(false));
  it('accepts a valid indigene certificate application',()=>expect(applicationSchema.safeParse(validIndigene).success).toBe(true));
  it('requires PDF document for indigene certificate',()=>expect(applicationSchema.safeParse({...validIndigene,documentPath:undefined}).success).toBe(false));
  it('accepts applications with Treasury Single Account (TSA) payment metadata', () => {
    const paidBusiness = {
      ...valid,
      details: {
        ...valid.details,
        'Payment Status': 'PAID - TREASURY CLEARED',
        'TSA Reference': 'TSA-JLG-2026-X94B2Q',
        'Amount Paid': '₦5,000.00',
        'Payment Date': '06/10/2026'
      }
    };
    expect(applicationSchema.safeParse(paidBusiness).success).toBe(true);
  });
});


