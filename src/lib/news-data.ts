export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: 
    | 'Empowerment & Welfare'
    | 'Constructions & Infrastructure'
    | 'Agricultural Inputs & Distribution'
    | 'Education & Youth'
    | 'Healthcare & Community'
    | 'Security Logistics'
    | 'Public Gazette';
  date: string;
  author: string;
  location: string;
  summary: string;
  content: string[];
  image: string;
  imageCaption: string;
  tags: string[];
  gazetteRef: string;
  featured?: boolean;
}

export const newsArticles: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Food Security Drive: Hon. Danmalam Distributes Thousands of Fertilizer Bags, Improved Rice Seeds & Solar Pumps to Jahun Farmers',
    slug: 'danmalam-agricultural-input-distribution-rice-fertilizer',
    category: 'Agricultural Inputs & Distribution',
    date: 'October 18, 2024',
    author: 'Directorate of Information & Civic Strategy',
    location: 'Central Agricultural Inputs Depot, Jahun Town',
    summary: 'Executive Chairman Hon. Jamilu Muhammad Danmalam flags off a massive agricultural empowerment drive, distributing subsidized NPK fertilizer, certified Faro-44 rice seed varieties, and solar-powered irrigation pumps to over 2,500 smallholder agrarian families.',
    content: [
      'In a decisive move to bolster agrarian productivity and consolidate Jahun’s status as a major food basket in Jigawa State, the Executive Chairman of Jahun Local Government Council, Hon. Jamilu Muhammad Danmalam, officially launched the Council’s Mega Dry-Season Agricultural Input Distribution Programme.',
      'Drawing on his extensive technocratic background as former Special Assistant to the Governor of Jigawa State on Rice Production, Chairman Danmalam emphasized that grassroots prosperity in Jahun is inextricably linked to empowered farmers and modern irrigation infrastructure.',
      'Under the initiative, smallholder farmer clusters across all eleven administrative wards received heavily subsidized NPK 15-15-15 and Urea fertilizer bags, high-germination Faro-44 improved paddy rice seeds, agro-chemicals, and heavy-duty solar-powered irrigation water pumping units.',
      '"Our administration understands that when a farmer harvests bountifully, the entire community thrives with stable prices and economic vitality," Hon. Danmalam declared during the ceremonial flag-off. "We are eliminating the crippling bottlenecks of expensive fuel for irrigation by distributing solar pumping machines, allowing our youth and women to farm all year round along our fertile floodplains."',
      'Beneficiaries drawn from farmer cooperatives in Gauza, Gangawa, Harɓo, and Aujara commended the Council Chairman for his prompt intervention, noting that the timely availability of inputs will protect local yields against climatic stress.'
    ],
    image: '/news/danmalam-agriculture-rice-fertilizer.jpg',
    imageCaption: 'Hon. Jamilu Muhammad Danmalam delivering remarks while presenting fertilizer bags, improved seeds, and solar irrigation pumps to farmers.',
    tags: ['Agriculture', 'Food Security', 'Rice Production', 'Empowerment', 'Jahun LGA'],
    gazetteRef: 'JLG/AGR/2024/092',
    featured: true
  },
  {
    id: 'news-2',
    title: 'Council Launches Educational Relief: Chairman Danmalam Sponsors First-Class Graduates, Volunteer Teachers & Enrolls 3,000 Out-of-School Pupils',
    slug: 'danmalam-education-scholarships-volunteer-teachers',
    category: 'Education & Youth',
    date: 'August 15, 2024',
    author: 'Council Press Secretariat',
    location: 'Jahun Local Government Secretariat Assembly Hall',
    summary: 'Over 3,000 vulnerable children return to formal classrooms under Chairman Danmalam’s educational revival agenda, alongside monthly stipends for volunteer teachers and full scholarship awards for outstanding tertiary scholars.',
    content: [
      'The Jahun Local Government Council Secretariat Hall was filled with jubilant students, parents, and community stakeholders as Executive Chairman Hon. Jamilu Muhammad Danmalam presided over the formal distribution of scholarship certificates, tuition grants, and educational starter packs.',
      'In a bid to address rural teacher deficits, Hon. Danmalam approved the immediate enrollment of volunteer community teachers across primary and junior secondary schools into a sustained monthly council stipend scheme. This decisive action has restored instructional continuity across dozens of rural schools in Kale, Idanduna, and Jabarna.',
      'Furthermore, the Chairman announced full council sponsorship for first-class and high-achieving indigenes admitted into postgraduate degree programmes, alongside tuition and accommodation grants for students securing admissions into federal universities and colleges of education across Nigeria.',
      '"Education is the most formidable weapon against poverty," Chairman Danmalam stated. "No bright son or daughter of Jahun should have their academic ambitions terminated due to financial handicaps. We have also procured and distributed free JAMB/UTME registration PINs to secondary school leavers across our 11 wards."',
      'Local education authorities reported that the combined back-to-school mobilization has enabled over 3,000 previously out-of-school pupils—particularly young girls—to successfully re-enroll in basic educational institutions with council-provided uniforms and notebooks.'
    ],
    image: '/news/danmalam-education-scholarships.jpg',
    imageCaption: 'Executive Chairman Hon. Jamilu Muhammad Danmalam presenting scholarship certificates and educational support packages to students in Jahun.',
    tags: ['Education', 'Scholarships', 'Youth Empowerment', 'Teacher Support', 'Basic Education'],
    gazetteRef: 'JLG/EDU/2024/074',
    featured: true
  },
  {
    id: 'news-3',
    title: 'Rural Water Renewal: Jahun Council Commissions High-Capacity Solar-Powered Water Schemes in Shagari Quarters & Rural Wards',
    slug: 'danmalam-solar-borehole-water-schemes-infrastructure',
    category: 'Constructions & Infrastructure',
    date: 'October 24, 2024',
    author: 'Works & Public Infrastructure Directorate',
    location: 'Shagari Quarters, Dan Kakar Quarters & Gauza',
    summary: 'A comprehensive potable water transformation project executed by the Council brings modern solar-powered motorized boreholes and reticulated tap networks to over 45,000 residents across dry-season vulnerable communities.',
    content: [
      'Ending decades of chronic water distress during harsh dry seasons, the Jahun Local Government Council has officially commissioned a network of industrial-grade solar-powered motorized borehole water projects strategically sited across densely populated residential quarters and agrarian settlements.',
      'The newly commissioned facilities in Shagari Quarters, Dan Kakar Quarters, Gauza, and Harɓo Sabuwa feature elevated steel storage tanks, high-output photovoltaic solar arrays, and multiple public discharge points designed to serve households, livestock, and small-scale agro-processing needs.',
      'In addition to the water schemes, Chairman Danmalam’s infrastructural blueprint has delivered iconic town entrance monument gates in Jahun, Bawada, Danmalam, and Danmodi, alongside the comprehensive perimeter fencing and preservation of the historic Aujara Cemetery.',
      '"Access to clean, potable water is an undeniable human right and the cornerstone of primary healthcare," Hon. Danmalam remarked at the ribbon-cutting ceremony. "By deploying robust solar power rather than diesel-reliant generators, we have guaranteed uninterrupted water supply for our mothers and children while eliminating recurrent operational overheads."',
      'Community elders and women leaders celebrated the project, noting that waterborne ailments have dropped sharply since the taps began flowing with clean, tested subterranean water.'
    ],
    image: '/news/danmalam-solar-water-boreholes.jpg',
    imageCaption: 'Official ribbon-cutting and commissioning of the solar-powered municipal borehole water scheme executed by Jahun Local Government Council.',
    tags: ['Infrastructure', 'Solar Water', 'Public Utilities', 'Boreholes', 'Sanitation'],
    gazetteRef: 'JLG/WRK/2024/110',
    featured: false
  },
  {
    id: 'news-4',
    title: 'Maternal Health Compassion: Council Chairman Presents Medical Grants & Livelihood Toolkits to VVF Survivors at Jahun General Hospital',
    slug: 'danmalam-vvf-healthcare-maternal-empowerment',
    category: 'Healthcare & Community',
    date: 'November 12, 2024',
    author: 'Health & Social Welfare Department',
    location: 'Jahun General Hospital VVF Medical Centre',
    summary: 'Hon. Jamilu Muhammad Danmalam, in partnership with traditional leaders, distributes financial recovery grants, sewing machines, and trade rehabilitation toolkits to women recovering from Vesicovaginal Fistula (VVF) surgery.',
    content: [
      'In an emotionally resonant humanitarian initiative, the Executive Chairman of Jahun Local Government Council, Hon. Jamilu Muhammad Danmalam, visited the specialized Vesicovaginal Fistula (VVF) treatment wing at the Jahun General Hospital to champion the dignity, healing, and economic independence of recovering patients.',
      'Accompanied by prominent community leaders, including Alhaji Aminu Dan Malam (District Head of Aujara), Council supervisors, and medical personnel, Chairman Danmalam interacted warmly with the women, praising their resilience and assuring them of the council’s steadfast backing.',
      'The Chairman presented substantial non-repayable cash grants, brand-new sewing machines, fabric bundles, and vocational empowerment toolkits to dozens of rehabilitated survivors, ensuring that upon discharge, every patient can establish a sustainable livelihood and reintegrate proudly into her home community.',
      '"These courageous women deserve empathy, honor, and economic empowerment, not stigmatization," Hon. Danmalam asserted. "Our local government council is committed to covering medication costs and providing self-reliance tools so that every survivor leaves this hospital as a proud, self-sufficient entrepreneur."',
      'Hospital medical directors expressed profound gratitude to the Executive Chairman, citing his personal presence and generous material donation as a shining paradigm of compassionate, grassroots governance.'
    ],
    image: '/news/danmalam-hospital-vvf-empowerment.jpg',
    imageCaption: 'Hon. Jamilu Muhammad Danmalam presenting livelihood empowerment kits and medical recovery grants to women at Jahun General Hospital.',
    tags: ['Healthcare', 'Maternal Health', 'VVF Rehabilitation', 'Women Empowerment', 'Jahun Hospital'],
    gazetteRef: 'JLG/HLT/2024/088',
    featured: false
  },
  {
    id: 'news-5',
    title: 'Grassroots Security Reinforcement: Hon. Danmalam Procures Patrol Motorcycles, Communication Kits & Uniforms for Jahun Vigilante Groups',
    slug: 'danmalam-vigilante-security-logistics-procurement',
    category: 'Security Logistics',
    date: 'January 14, 2025',
    author: 'Peace & Community Security Bureau',
    location: 'Jahun Council Secretariat Parade Grounds',
    summary: 'To fortify rural peace, deter banditry incursions, and safeguard agricultural farmlands, Chairman Danmalam equips local vigilante and voluntary security formations with brand-new motorcycles and communication gadgets.',
    content: [
      'In a decisive boost to community policing and public peace across rural borderlines, the Executive Chairman of Jahun Local Government Council, Hon. Jamilu Muhammad Danmalam, formally handed over a fleet of heavy-duty patrol motorcycles, two-way communication walkie-talkies, tactical boots, and protective uniforms to local vigilante commands.',
      'The presentation ceremony, held at the Jahun Council Secretariat parade ground, was attended by traditional rulers, divisional police leadership, DSS representatives, and vigilante group sector commanders representing all eleven wards of the local government.',
      'Chairman Danmalam lauded the vigilante corps for their selflessness in assisting formal security agencies, highlighting that peace is the non-negotiable bedrock upon which commerce, education, and farming can flourish.',
      '"Security of lives and properties remains the foremost constitutional responsibility of leadership," Hon. Danmalam emphasized. "Our rural communities and cattle corridors must remain safe for our farmers and merchants day and night. These patrol motorcycles and communication radios will drastically improve response times to any distress calls."',
      'Vigilante commanders expressed deep gratitude, affirming that the unprecedented logistical support will enhance patrols along remote boundary feeder roads and inter-state crossings.'
    ],
    image: '/news/danmalam-vigilante-security-logistics.jpg',
    imageCaption: 'Chairman Hon. Jamilu Muhammad Danmalam handing over motorcycle ignition keys and communication kits to vigilante commanders in Jahun.',
    tags: ['Security', 'Vigilante Logistics', 'Public Peace', 'Community Policing', 'Jahun LGA'],
    gazetteRef: 'JLG/SEC/2025/014',
    featured: false
  },
  {
    id: 'news-6',
    title: 'Legislative Accolades: Jigawa State House of Assembly Commends Hon. Jamilu Danmalam for Exemplary Project Execution and Prudence',
    slug: 'jigawa-house-of-assembly-commends-jamilu-danmalam',
    category: 'Public Gazette',
    date: 'December 20, 2024',
    author: 'Jigawa State Assembly Press Corps & Council Secretariat',
    location: 'Assembly Complex, Dutse / Jahun Council Headquarters',
    summary: 'The Jigawa State House of Assembly Committee on Local Government Administration officially awards high marks to Hon. Jamilu Muhammad Danmalam for fiscal transparency and visible grassroots project execution.',
    content: [
      'Following an extensive legislative oversight tour assessing developmental projects across local government councils in Jigawa State, the Jigawa State House of Assembly Standing Committee on Local Government Affairs has formally passed a resounding vote of confidence on Hon. Jamilu Muhammad Danmalam.',
      'The lawmakers inspected ongoing and completed council interventions in Jahun, including solar-powered borehole water facilities, renovated primary healthcare clinics, school classroom rehabilitation projects, town entrance monument gateways, and agricultural dry-season irrigation dams.',
      'The Committee commended Chairman Danmalam for his proactive approach, financial discipline, and equitable distribution of projects ensuring that all eleven administrative wards received tangible social infrastructure tailored to their immediate communal priorities.',
      '"Jahun Local Government Council under Hon. Jamilu Muhammad Danmalam stands out as an exemplary benchmark of what local government autonomy and responsive governance can achieve," the Committee stated in its official gazetted appraisal.',
      'Reacting to the commendation, Hon. Danmalam expressed gratitude to the Executive Governor of Jigawa State, Malam Umar A. Namadi, FCA, for providing an enabling environment for grassroots development, while reaffirming his resolve to work tirelessly for the masses of Jahun.'
    ],
    image: '/news/chairman-jamilu-danmalam.jpg',
    imageCaption: 'Hon. Jamilu Muhammad Danmalam, Executive Chairman of Jahun Local Government Council, Jigawa State.',
    tags: ['Gazette', 'Good Governance', 'State Assembly', 'Commendation', 'Fiscal Transparency'],
    gazetteRef: 'JHA/LG/OVERSIGHT/2024/09',
    featured: false
  },
  {
    id: 'news-7',
    title: 'Social Harmony Drive: Over 1,500 Imams, District Heads & Vulnerable Families Receive Festive Food Grains and Direct Cash Transfers',
    slug: 'danmalam-sallah-welfare-distribution-imams-traditional-rulers',
    category: 'Empowerment & Welfare',
    date: 'March 28, 2025',
    author: 'Social Welfare & Community Relations Bureau',
    location: 'Jahun Council Central Palace & Ward Distribution Hubs',
    summary: 'Chairman Hon. Jamilu Muhammad Danmalam executes a comprehensive social welfare package distributing food staples, quality textiles, and financial grants to traditional authorities, Islamic clerics, widows, and vulnerable households.',
    content: [
      'In line with his continuous social safety-net philosophy, the Executive Chairman of Jahun Local Government Council, Hon. Jamilu Muhammad Danmalam, rolled out a wide-reaching welfare intervention benefiting over 1,500 respected Islamic scholars, chief imams, district rulers, widows, and people living with disabilities (PWDs).',
      'The welfare package, distributed in an orderly manner across designated ward centers, featured 50kg bags of food grains (millet, maize, and rice), high-quality fabric and clothing materials for festive celebrations, alongside direct cash allowances to cushion economic headwinds.',
      'Hon. Danmalam praised the traditional and religious institutions in Jahun for their tireless prayers, moral counsel, and instrumental role in maintaining communal harmony and mutual respect across all cultural demographics in the local government.',
      '"Our traditional leaders and clerics are the moral pillars of our society. It is the duty of responsible civic leadership to ensure that they and the most vulnerable in our midst celebrate festive periods with abundant joy and dignity," the Chairman said.',
      'Representatives of the Council of Ulama and Association of Persons with Disabilities lauded the Council Chairman for his consistent kindness, describing him as a compassionate leader whose heart beats for the vulnerable.'
    ],
    image: '/news/danmalam-agriculture-rice-fertilizer.jpg',
    imageCaption: 'Distribution of grains, textile materials, and welfare packages organized by Jahun Local Government Council.',
    tags: ['Welfare', 'Social Support', 'Imams', 'Traditional Rulers', 'Disability Inclusion'],
    gazetteRef: 'JLG/WEL/2025/031',
    featured: false
  }
];
