import { Store, HardHat, Users, Wrench, GraduationCap, MessageSquare, FileBadge } from 'lucide-react';
export const wards = ['Aujara','Gangawa','Gauza','Gunka','Harɓo Sabuwa','Harɓo Tsohuwa','Idanduna','Jabarna','Jahun','Kale','Kanwa'] as const;

export const tradeCategories = [
  'Agricultural Produce, Grains & Seeds',
  'Livestock, Cattle & Poultry Trade',
  'Retail & Wholesale Provisions',
  'Food, Bakeries & Catering Services',
  'Building Materials & Hardware',
  'Pharmaceuticals, Chemists & Healthcare',
  'Textiles, Garments & Tailoring',
  'Automobile, Motorcycle & Spare Parts',
  'Phone Accessories, ICT & Digital Services',
  'General Trade & Commercial Enterprise'
] as const;

export const publicWorksCategories = [
  'Civil Engineering, Roads & Culverts',
  'Building Construction & Renovation',
  'Water Engineering, Boreholes & Reticulation',
  'Rural Electrification & Solar Installations',
  'Agricultural Inputs, Fertilizers & Implements',
  'Educational Supplies & Furniture',
  'Medical Equipment & Health Supplies',
  'General Council Procurement'
] as const;

export const skillCategories = [
  'Welding & Metal Fabrication',
  'Carpentry, Furniture & Woodwork',
  'Electrical Installation & Solar Power',
  'Plumbing & Water Systems',
  'Masonry, Block-Making & Tiling',
  'Auto Mechanic, Heavy Machinery & Motorcycle Repair',
  'Tailoring, Fashion Design & Embroidery',
  'Computer Hardware, Software & Phone Repair',
  'Irrigation Systems & Agro-Tech Operations',
  'Leatherworking & Shoe Craft',
  'Other Artisan Trade'
] as const;

export const certificationStatuses = [
  'Certified (Trade Test / City & Guilds / NABTEB)',
  'Apprenticeship Completed with Master Craftsman',
  'Practicing Craftsman (Self-Taught)',
  'Currently Under Training / Apprentice'
] as const;

export const yearsOfStudy = [
  '100 Level / ND I',
  '200 Level / ND II',
  '300 Level / HND I',
  '400 Level / HND II',
  '500 Level',
  '600 Level (Medical / Veterinary Sciences)',
  'Postgraduate (PGD / Master’s / PhD)'
] as const;

export const complaintCategories = [
  'Potable Water & Borehole Breakdown',
  'Feeder Road, Culvert & Bridge Repair',
  'Primary Healthcare Centre Services & Drugs',
  'Primary / Junior Secondary School Facilities',
  'Drainage Blockage & Flood Hazard',
  'Market Sanitation & Waste Management',
  'Council Revenue / Staff Service Conduct',
  'Public Peace & Community Security',
  'Other Civic Infrastructure Matter'
] as const;

export const indigenePurposes = [
  'Tertiary Institution Admission & Registration',
  'Federal / State Civil Service Employment',
  'Armed Forces, Police & Paramilitary Recruitment',
  'NYSC Mobilization & Posting',
  'State / Federal Scholarship & Bursary Screening',
  'Statutory & Official Documentation',
  'Other Council Verification'
] as const;

export const nigerianBanks = [
  'Access Bank',
  'First Bank of Nigeria',
  'Guaranty Trust Bank (GTBank)',
  'United Bank for Africa (UBA)',
  'Zenith Bank',
  'Fidelity Bank',
  'Stanbic IBTC Bank',
  'Union Bank of Nigeria',
  'Sterling Bank',
  'First City Monument Bank (FCMB)',
  'Wema Bank / ALAT',
  'Jaiz Bank',
  'Taj Bank',
  'Lotus Bank',
  'Jigawa State Microfinance Bank',
  'OPay Digital Services',
  'PalmPay',
  'Kuda Bank',
  'Other Commercial / Microfinance Bank'
] as const;

export const councilTSADetails = {
  accountName: 'Jahun Local Government Council - Treasury Single Account (TSA)',
  bankName: 'Jigawa State Central Revenue Pool / Microfinance Bank',
  accountNumber: '2004819023',
  tin: 'JLG-TIN-98402188',
  billerCode: 'JLG-REV-04821',
  currency: 'NGN (₦)'
} as const;

export const services = [
  {
    id: 'indigene',
    title: 'Local government indigene certificate',
    short: 'Apply for indigene certificate',
    category: 'Civic & statutory',
    icon: FileBadge,
    fee: 2500,
    feeFormatted: '₦2,500.00',
    feeTitle: 'Statutory Indigene Certification & Registry Tariff',
    certificateTitle: 'Certificate of Local Government Origin & Indigene Status',
    certificateSubtitle: 'Office of the Executive Chairman · Jahun Local Government Council',
    description: 'Verify your ancestral origin and obtain an official Jahun Local Government Council indigene certificate.',
    fields: ['Date of birth', 'Village / Community', 'Family / Compound name', 'National Identification Number (NIN)', 'Father’s full name', 'Mother’s full name (optional)', 'Purpose of certificate'],
    document: 'Proof of birth / age or Ward Head identification letter (PDF)'
  },
  {
    id: 'business',
    title: 'Business premises registration',
    short: 'Register a business',
    category: 'Business & trade',
    icon: Store,
    fee: 5000,
    feeFormatted: '₦5,000.00',
    feeTitle: 'Local Government Business Premises Statutory Assessment Levy',
    certificateTitle: 'Certificate of Business Premises Registration',
    certificateSubtitle: 'Department of Commerce & Local Government Revenue Service',
    description: 'Formalise your enterprise and apply for a council premises certificate.',
    fields: ['Business name', 'CAC / BN number (optional)', 'Trade category', 'Premises address', 'Owner NIN']
  },
  {
    id: 'contractor',
    title: 'Contractor & vendor enrollment',
    short: 'Become a council vendor',
    category: 'Business & trade',
    icon: HardHat,
    fee: 15000,
    feeFormatted: '₦15,000.00',
    feeTitle: 'Council Contractor Gazette & Prequalification Levy',
    certificateTitle: 'Certificate of Contractor & Vendor Enrollment',
    certificateSubtitle: 'Tenders Board & Works Directorate · Jahun LGA',
    description: 'Register your company for public works and council procurement.',
    fields: ['Company name', 'CAC RC number', 'Public works category', 'Past job references'],
    document: 'Tax clearance certificate (PDF)'
  },
  {
    id: 'cooperative',
    title: 'Cooperative societies registration',
    short: 'Register a cooperative',
    category: 'Community',
    icon: Users,
    fee: 3500,
    feeFormatted: '₦3,500.00',
    feeTitle: 'Cooperative Society Statutory Charter & Registry Fee',
    certificateTitle: 'Statutory Charter & Cooperative Registration Certificate',
    certificateSubtitle: 'Department of Community Development & Cooperative Affairs',
    description: 'Connect farmer clusters, artisan groups and market associations.',
    fields: ['Society name', 'Executive committee details', 'Member count', 'Bank name', 'Account number']
  },
  {
    id: 'skills',
    title: 'Youth & artisans skills inventory',
    short: 'Join the skills register',
    category: 'Education & youth',
    icon: Wrench,
    fee: 1000,
    feeFormatted: '₦1,000.00',
    feeTitle: 'Council Artisan Verification & Registry Enrollment Fee',
    certificateTitle: 'Certificate of Vocational & Artisan Registration',
    certificateSubtitle: 'Youth Empowerment & Vocational Training Directorate',
    description: 'Register your skills and tooling needs for enterprise opportunities.',
    fields: ['Date of birth', 'Skill category', 'Tooling needs', 'Certification status']
  },
  {
    id: 'bursary',
    title: 'Student bursary & allowance',
    short: 'Apply for a bursary',
    category: 'Education & youth',
    icon: GraduationCap,
    fee: 0,
    feeFormatted: '₦0.00 (100% Subsidized)',
    feeTitle: 'Student Civic Welfare & Bursary Screening (100% Subsidized)',
    certificateTitle: 'Student Bursary Enrollment & Clearance Certificate',
    certificateSubtitle: 'Education & Civic Welfare Directorate · Jahun LGA',
    description: 'Submit your student details for indigene verification and bursary screening.',
    fields: ['Matriculation number', 'Institution name', 'Course of study', 'Year of study', 'BVN', 'Bank name', 'Account number'],
    document: 'LGA indigene certificate (PDF)'
  },
  {
    id: 'complaint',
    title: 'Civic complaints & feedback',
    short: 'Report a community concern',
    category: 'Community',
    icon: MessageSquare,
    fee: 0,
    feeFormatted: '₦0.00 (Free Civic Service)',
    feeTitle: 'Public Infrastructure & Civic Ombudsman Registry (Gratis)',
    certificateTitle: 'Civic Complaint Lodgment & Ombudsman Certificate',
    certificateSubtitle: 'Public Complaints & Civil Ombudsman Office · Jahun LGA',
    description: 'Report infrastructure faults or share concerns with the council.',
    fields: ['Complaint category', 'Description'],
    document: 'Supporting photograph (optional) (JPG, PNG or WebP)'
  },
] as const;
export type ServiceId = typeof services[number]['id'];
export const welcome = 'Peace be upon you all. On behalf of the Jahun Local Government Council, I welcome you to our official civic and digital administration portal. Our commitment under our continuous development agenda is centered on empowering our agrarian communities, expanding education and rural access, providing reliable healthcare, and modernizing governance. Through this platform, our citizens across all eleven wards can directly access statutory services, apply for student bursaries, formalize their enterprises, and contribute to the economic prosperity of Jahun. We serve with transparency, equity, and dedication to the people.';
export function pageHead(title:string,description:string) { return {meta:[{title:`${title} | Jahun Local Government Council`},{name:'description',content:description},{property:'og:title',content:`${title} | Jahun Local Government Council`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}; }

