export type PageId =
  | 'scan-crop'
  | 'diagnosis-history'
  | 'plant-health-analysis'
  | 'agro-tips'
  | 'user-profile'
  | 'admin-profile';

export type UserRole = 'user' | 'admin';

export interface UserAccount {
  id: string;
  name: string;
  organization: string;
  title: string;
  email: string;
  role: UserRole;
  avatar: string;
  assignedParcels: string[];
  certificationId: string;
  lastLogin: string;
}

export interface TreatmentProtocol {
  icon: string;
  name: string;
  badge?: string;
  description: string;
}

export interface SamplePreset {
  key: 'tomato' | 'corn' | 'potato' | 'rice' | 'wheat';
  label: string;
  selectLabel: string;
  name: string;
  taxon: string;
  severity: 'High Severity' | 'Moderate Severity' | 'Critical Severity';
  conf: string;
  roiText: string;
  roiArea: string;
  lot: string;
  gps: string;
  image: string;
  prompt: string;
  symptoms: { icon: string; colorClass: string; text: string }[];
  organicProtocols: TreatmentProtocol[];
  chemicalProtocols: TreatmentProtocol[];
  preventionProtocols: { icon: string; title: string; subtitle: string }[];
}

export interface DiagnosisRecord {
  id: string;
  timestamp: string;
  dateFormatted: string;
  parcelName: string;
  lotCode: string;
  gps: string;
  cropName: string;
  diseaseName: string;
  scientificName: string;
  confidence: string;
  severity: 'High Severity' | 'Moderate Severity' | 'Critical Severity' | 'Low Severity';
  status: 'Active Treatment' | 'Resolved' | 'Monitoring' | 'Escalated';
  symptoms: string[];
  recommendedAction: string;
  imageUrl: string;
  analyzedBy: string;
  method: 'Vision Capture' | 'Symptom Analysis' | 'Copilot Triage';
}

export interface MajorDiseaseInfo {
  id: string;
  name: string;
  scientificName: string;
  pathogenType: 'Fungal' | 'Oomycete' | 'Bacterial' | 'Viral' | 'Pest / Physiological';
  affectedCrops: string[];
  severity: 'High Severity' | 'Critical Severity' | 'Moderate Severity';
  typicalConfidence: string;
  image: string;
  overview: string;
  environmentalTriggers: string;
  keySymptoms: string[];
  organicControl: string[];
  chemicalControl: string[];
  prevention: string;
}

export interface AgroTipItem {
  id: string;
  category: 'Irrigation & Soil' | 'Disease Prevention' | 'Crop Nutrition' | 'Spray & Pruning' | 'Seasonal Maintenance';
  title: string;
  cropFocus: string;
  readTime: string;
  impactMetric: string;
  icon: string;
  summary: string;
  actionChecklist: string[];
  proMetric: string;
}

export const HOTLINKED_ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1XoiHH9YPPbukbhTrhFnF2JuJIK82VBhz_iGhuJgMT9NdlhiqMGP8KtnleNHfuIHYQ6F6mpTanFJIxrB9zKAdpeGNgXRV7ojSUjbOq0xl7KtpWl-V2LQKbPQ9HtwpiRFdY7co7gk4vNLY4CLPPc85Cy76i28YpkpBNCY5jz0KYNAZ9rqeAA_qUb6cMkotwJ_eSVBe66nuiOcn93-XnQUdqznb8iOmJt7kfRmrrM60UZMe74BDtMco7jPQA',
  profileAvatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDlU7lB01Rxlun1sza0h37TfZBFYBoGbsx47R_4-IE62-2fY8ocIn12uAqSsZVYqkl3Om89mGu7kzlSd-2Q8Q046HHzNPF2LUzmcxmQPxwcQum3EOEq6dtXgVKF6pgWmFwpYHmuPREE36M4d2KefKHGAGdQx3si4vFRmhllt4_SMCAAeHHp9JzAPcmnYSFaPv8Pc6wFCO9ZiWIxcLhNrw9AZtxii6KyhqoD0DTsWn1oXV-XEQDzEC8P',
  sampleLeaf:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDhxssnix2_wXEq6Eo7a3eQL7pNbtXgCtmVy9nspWCWQftYfEqYSemJR1UaribgecUoUaaSJ03VyrjFzpwOU-XT9QPlj0KnTuNMZJIjvychhzsyf9_m474rlYBHhYBBoo8DR-oywhXKhKJg3RHbcRkqjPxHitcrY_jQrtii8q1DBW2Bo_tRLBBQT42iOO7kLIrZ7KFb_kI9Q24qo4qJOyabqbUP3vpSt8WVWALIB9DB-d24myu9aNYS',
};

export const USER_ACCOUNTS: Record<UserRole, UserAccount> = {
  user: {
    id: 'USR-2048',
    name: 'Elena Vance',
    organization: 'Oakridge Smart Farm',
    title: 'Lead Agronomist',
    email: 'elena.vance@oakridgeag.io',
    role: 'user',
    avatar: HOTLINKED_ASSETS.profileAvatar,
    assignedParcels: [
      'Green Valley Field #4 - Corn & Tomato',
      'Oakridge North Block #2 - Potato & Wheat',
      'Riverbend Greenhouse Sector A - Heirloom Tomato',
    ],
    certificationId: 'CCA-CA-99481',
    lastLogin: 'Today, 06:42 AM PST',
  },
  admin: {
    id: 'ADM-0001',
    name: 'Dr. Marcus Sterling',
    organization: 'AgroAI Regional Command',
    title: 'Chief Systems & Biosecurity Administrator',
    email: 'm.sterling@agroai.precision.org',
    role: 'admin',
    avatar: HOTLINKED_ASSETS.profileAvatar,
    assignedParcels: [
      'All Regional Parcels (14 Active Farms • 4,820 Acres)',
      'Green Valley Field #4 - Corn & Tomato',
      'San Joaquin Experimental Station #1',
    ],
    certificationId: 'ADMIN-SYS-ROOT-01',
    lastLogin: 'Today, 07:15 AM PST',
  },
};

export const SAMPLE_PRESETS: Record<string, SamplePreset> = {
  tomato: {
    key: 'tomato',
    label: 'Tomato Blight',
    selectLabel: 'Tomato (Solanum lycopersicum) - Early Fruiting Stage',
    name: 'Tomato Early Blight',
    taxon: 'Alternaria solani fungal complex',
    severity: 'High Severity',
    conf: '98.4%',
    roiText: 'LESION: Alternaria #1',
    roiArea: '44.8mm²',
    lot: 'GV-BLK-04B',
    gps: '38.541°N, 121.782°W',
    image: HOTLINKED_ASSETS.sampleLeaf,
    prompt:
      'Close up scientific macro photography of a broad green tomato leaf infected with concentric ring early blight lesions, bright natural greenhouse lighting with crisp leaf veins and diagnostic target pattern spots',
    symptoms: [
      {
        icon: 'lens_blur',
        colorClass: 'text-error',
        text: 'Concentric brown ring lesions ("target-board" pattern)',
      },
      {
        icon: 'energy_savings_leaf',
        colorClass: 'text-secondary',
        text: 'Lower foliage chlorosis & leaf yellowing halo',
      },
      {
        icon: 'grain',
        colorClass: 'text-on-surface-variant',
        text: 'Dark sunken stem collar lesions near soil line',
      },
    ],
    organicProtocols: [
      {
        icon: 'spa',
        name: 'Copper Octanoate Bio-Spray',
        badge: 'Primary Active',
        description:
          'Dose: 3 tbsp (45 ml) per gallon of soft water. Thoroughly coat underside and topside of infected foliage every 7-10 days.',
      },
      {
        icon: 'microbiology',
        name: 'Bacillus subtilis (Serenade ASO)',
        badge: 'Microbial Shield',
        description:
          'Rate: 2-4 qt/acre. Establishes beneficial bacterial colonization preventing fungal mycelium spread across neighboring nodes.',
      },
      {
        icon: 'content_cut',
        name: 'Sanitary Canopy Pruning',
        description:
          'Excise bottom 25% of leaves touching soil. Sterilize shears with 70% isopropyl alcohol between plants. Bag and burn discarded matter.',
      },
    ],
    chemicalProtocols: [
      {
        icon: 'science',
        name: 'Chlorothalonil 720g/L (Bravo WeatherStik)',
        badge: 'FRAC M05',
        description:
          'Preventive multisite barrier: 1.5 - 2.0 pt/acre. Apply before next forecast precipitation event. Max 15 lb ai/acre/season.',
      },
      {
        icon: 'vaccines',
        name: 'Azoxystrobin (Quadris Flowable)',
        badge: 'FRAC 11',
        description:
          'Systemic curative: 6.0 - 9.0 fl oz/acre. Tank mix with non-ionic surfactant. Do not apply more than two consecutive applications.',
      },
      {
        icon: 'shield',
        name: 'Mancozeb WG (Dithane F-45)',
        description:
          'Broad spectrum protective contact fungicide. 1.6 - 2.4 qt/acre. Minimum 5 days pre-harvest interval (PHI).',
      },
    ],
    preventionProtocols: [
      {
        icon: 'shower',
        title: 'Sub-Surface Drip Irrigation',
        subtitle: 'Zero foliage overhead wetting',
      },
      {
        icon: 'sync',
        title: '3-Year Crop Rotation',
        subtitle: 'Exclude Solanaceae nightshades',
      },
    ],
  },
  corn: {
    key: 'corn',
    label: 'Corn Leaf Rust',
    selectLabel: 'Corn / Maize (Zea mays) - V6 Vegetative Stage',
    name: 'Common Rust (Puccinia sorghi)',
    taxon: 'Basidiomycete obligate parasite',
    severity: 'Moderate Severity',
    conf: '96.1%',
    roiText: 'PUSTULE: P. sorghi #4',
    roiArea: '31.2mm²',
    lot: 'GV-CRN-09A',
    gps: '38.544°N, 121.779°W',
    image: HOTLINKED_ASSETS.sampleLeaf,
    prompt:
      'Macro close-up shot of agricultural corn maize leaf showing scattered reddish brown elongated rust pustules rupturing leaf surface in field sunlight',
    symptoms: [
      {
        icon: 'lens_blur',
        colorClass: 'text-error',
        text: 'Cinnamon-brown elongated pustules on upper leaf epidermis',
      },
      {
        icon: 'energy_savings_leaf',
        colorClass: 'text-secondary',
        text: 'Golden-yellow flecking preceding powdery spore release',
      },
      {
        icon: 'grain',
        colorClass: 'text-on-surface-variant',
        text: 'Reduced canopy photosynthetic active radiation (PAR)',
      },
    ],
    organicProtocols: [
      {
        icon: 'spa',
        name: 'Micronized Wettable Sulfur (80% WP)',
        badge: 'Primary Active',
        description:
          'Apply 4-6 lbs/acre in early morning dew. Inhibits urediniospore germination on emerging whorl leaves.',
      },
      {
        icon: 'microbiology',
        name: 'Bacillus amyloliquefaciens Strain D747',
        badge: 'Bio-Fungicide',
        description:
          'Rate: 2 qt/acre foliar mist. Induces systemic acquired resistance (SAR) across upper corn canopy.',
      },
      {
        icon: 'air',
        name: 'Inter-Row Airflow Optimization',
        description:
          'Clear volunteer weeds along field borders to reduce localized relative humidity pockets below 65%.',
      },
    ],
    chemicalProtocols: [
      {
        icon: 'vaccines',
        name: 'Azoxystrobin + Propiconazole (Quilt Xcel)',
        badge: 'FRAC 11 + 3',
        description:
          'Dual-mode systemic protection: 10.5 - 14.0 fl oz/acre at VT/R1 tasseling threshold.',
      },
      {
        icon: 'science',
        name: 'Pyraclostrobin (Headline EC)',
        badge: 'FRAC 11',
        description:
          'Rate: 6.0 - 12.0 fl oz/acre. Arrests pustule rupture and improves stalk integrity.',
      },
      {
        icon: 'shield',
        name: 'Tebuconazole 3.6F',
        description:
          'Apply 4.0 - 6.0 fl oz/acre with adjuvant when pustules exceed 5% leaf area prior to silking.',
      },
    ],
    preventionProtocols: [
      {
        icon: 'verified',
        title: 'Rp1-D Gene Resistant Hybrids',
        subtitle: 'Plant certified rust-resistant seed stock',
      },
      {
        icon: 'calendar_month',
        title: 'Early Planting Window',
        subtitle: 'Achieve canopy closure before peak spore migration',
      },
    ],
  },
  potato: {
    key: 'potato',
    label: 'Potato Blight',
    selectLabel: 'Potato (Solanum tuberosum) - Tuber Initiation',
    name: 'Late Blight (Phytophthora infestans)',
    taxon: 'Oomycete water mold pathogen',
    severity: 'Critical Severity',
    conf: '99.2%',
    roiText: 'NECROSIS: P. infestans #2',
    roiArea: '68.5mm²',
    lot: 'GV-POT-02C',
    gps: '38.539°N, 121.785°W',
    image: HOTLINKED_ASSETS.sampleLeaf,
    prompt:
      'Detailed agricultural agronomy inspection image of a potato leaf with dark water soaked late blight necrotic patches and light fuzzy spore growth',
    symptoms: [
      {
        icon: 'lens_blur',
        colorClass: 'text-error',
        text: 'Water-soaked dark lesions spreading rapidly across foliage',
      },
      {
        icon: 'energy_savings_leaf',
        colorClass: 'text-secondary',
        text: 'White delicate fungal bloom visible on leaf undersides during high humidity',
      },
      {
        icon: 'grain',
        colorClass: 'text-on-surface-variant',
        text: 'Rapid collapse and petiole necrosis within 48h',
      },
    ],
    organicProtocols: [
      {
        icon: 'spa',
        name: 'Copper Hydroxide (Kocide 3000-O)',
        badge: 'OMRI Listed',
        description:
          'Apply 0.75 - 1.5 lbs/acre every 5 days during cool, wet weather. Releases cupric ions lethal to zoospore motility.',
      },
      {
        icon: 'microbiology',
        name: 'Reynoutria sachalinensis Extract (Regalia)',
        badge: 'Plant Immunity',
        description:
          'Rate: 1-2 qt/acre. Stimulates phytoalexin accumulation and cell wall lignification in potato haulms.',
      },
      {
        icon: 'content_cut',
        name: 'Immediate Hotspot Roguing',
        description:
          'Destroy infected haulms within a 3-meter buffer zone around primary foci to prevent sporangia wind dispersal.',
      },
    ],
    chemicalProtocols: [
      {
        icon: 'science',
        name: 'Oxathiapiprolin + Mandipropamid (Orondis Ultra)',
        badge: 'FRAC 49 + 40',
        description:
          'Targeted oomycete specialist: 5.5 - 8.0 fl oz/acre. Exceptional rainfastness and translaminar leaf movement.',
      },
      {
        icon: 'vaccines',
        name: 'Cymoxanil + Famoxadone (Tanos)',
        badge: 'FRAC 27 + 11',
        description:
          'Rate: 8.0 oz/acre. Kick-back curative activity within 24 hours of infection event.',
      },
      {
        icon: 'shield',
        name: 'Fluazinam (Omega 500F)',
        description:
          'Apply 5.5 fl oz/acre during late tuber bulking to prevent zoospore wash-down into soil and tuber rot.',
      },
    ],
    preventionProtocols: [
      {
        icon: 'agriculture',
        title: 'Deep Hilling & Ridge Integrity',
        subtitle: 'Maintain 15cm soil cover over developing tubers',
      },
      {
        icon: 'delete_forever',
        title: 'Cull Pile Sanitation',
        subtitle: 'Eliminate overwintering volunteer tubers',
      },
    ],
  },
  rice: {
    key: 'rice',
    label: 'Rice Blast',
    selectLabel: 'Rice (Oryza sativa) - Tillering Phase',
    name: 'Rice Leaf Blast (Magnaporthe oryzae)',
    taxon: 'Ascomycete filamentous fungus',
    severity: 'High Severity',
    conf: '97.5%',
    roiText: 'LESION: M. oryzae #3',
    roiArea: '39.0mm²',
    lot: 'GV-RIC-11D',
    gps: '38.548°N, 121.790°W',
    image: HOTLINKED_ASSETS.sampleLeaf,
    prompt: 'Rice leaf showing diamond shaped spindle lesions with gray centers and brown margins',
    symptoms: [
      {
        icon: 'lens_blur',
        colorClass: 'text-error',
        text: 'Diamond-shaped spindle lesions with gray-white centers and reddish-brown borders',
      },
      {
        icon: 'energy_savings_leaf',
        colorClass: 'text-secondary',
        text: 'Collar rot and necrotic darkening at leaf-sheath junction',
      },
      {
        icon: 'grain',
        colorClass: 'text-on-surface-variant',
        text: 'Stunted tillering and coalescing foliar burn in high-nitrogen plots',
      },
    ],
    organicProtocols: [
      {
        icon: 'microbiology',
        name: 'Pseudomonas fluorescens Bio-Drench',
        badge: 'Primary Active',
        description:
          'Foliar spray at 0.5% concentration during active tillering to suppress appressorium penetration.',
      },
      {
        icon: 'spa',
        name: 'Potassium Silicate Foliar Amendment',
        badge: 'Epidermal Armor',
        description:
          'Fortifies silica phytolith layer in rice leaf epidermis, mechanically blocking fungal peg entry.',
      },
      {
        icon: 'water_drop',
        name: 'Continuous Flood Depth Management',
        description:
          'Maintain consistent 10cm flood water depth; draining paddy increases blast susceptibility 3-fold.',
      },
    ],
    chemicalProtocols: [
      {
        icon: 'science',
        name: 'Tricyclazole 75% WP',
        badge: 'FRAC I1',
        description:
          'Melanin biosynthesis inhibitor: 300g/hectare at late tillering and booting stages.',
      },
      {
        icon: 'vaccines',
        name: 'Trifloxystrobin + Propiconazole (Stratego)',
        badge: 'FRAC 11 + 3',
        description:
          'Rate: 14–19 fl oz/acre prior to panicle emergence to prevent neck blast.',
      },
      {
        icon: 'shield',
        name: 'Isoprothiolane 40% EC',
        description:
          'Systemic curative fungicide arresting intracellular hyphae growth within 36 hours.',
      },
    ],
    preventionProtocols: [
      {
        icon: 'science',
        title: 'Split Nitrogen Application',
        subtitle: 'Avoid excessive N top-dressing during mid-tillering',
      },
      {
        icon: 'verified_user',
        title: 'Pi-ta / Pi-b Resistant Cultivars',
        subtitle: 'Deploy broad-spectrum blast resistance genes',
      },
    ],
  },
  wheat: {
    key: 'wheat',
    label: 'Wheat Stripe Rust',
    selectLabel: 'Wheat (Triticum aestivum) - Heading Stage',
    name: 'Wheat Stripe Rust (Puccinia striiformis)',
    taxon: 'Basidiomycete yellow rust pathogen',
    severity: 'High Severity',
    conf: '97.9%',
    roiText: 'STRIPE: P. striiformis #7',
    roiArea: '52.1mm²',
    lot: 'GV-WHT-06F',
    gps: '38.535°N, 121.774°W',
    image: HOTLINKED_ASSETS.sampleLeaf,
    prompt: 'Wheat flag leaf with linear parallel rows of bright yellow-orange rust uredinia stripes',
    symptoms: [
      {
        icon: 'lens_blur',
        colorClass: 'text-error',
        text: 'Linear parallel streaks of bright yellow-orange pustules along leaf veins',
      },
      {
        icon: 'energy_savings_leaf',
        colorClass: 'text-secondary',
        text: 'Flag leaf desiccation and chlorotic striping reducing grain fill',
      },
      {
        icon: 'grain',
        colorClass: 'text-on-surface-variant',
        text: 'Powdery yellow spore clouds dislodged upon canopy contact',
      },
    ],
    organicProtocols: [
      {
        icon: 'spa',
        name: 'Wettable Sulfur + Botanical Oil Emulsion',
        badge: 'Primary Active',
        description:
          'Apply 5 lbs/acre at flag leaf emergence (Feekes 8) to protect primary photosynthetic tissue.',
      },
      {
        icon: 'microbiology',
        name: 'Trichoderma harzianum T-22',
        badge: 'Biocontrol',
        description:
          'Competitive phyllosphere colonization reducing urediniospore viability by 78%.',
      },
      {
        icon: 'grass',
        name: 'Green Bridge Elimination',
        description:
          'Terminate volunteer wheat and wild barley grass hosts 3 weeks prior to autumn seeding.',
      },
    ],
    chemicalProtocols: [
      {
        icon: 'vaccines',
        name: 'Prothioconazole + Tebuconazole (Prosaro 421 SC)',
        badge: 'FRAC 3',
        description:
          'Apply 6.5 - 8.2 fl oz/acre at Feekes 10.5.1 for simultaneous rust and Fusarium head blight control.',
      },
      {
        icon: 'science',
        name: 'Benzovindiflupyr + Azoxystrobin + Propiconazole (Trivapro)',
        badge: 'FRAC 7 + 11 + 3',
        description:
          'Rate: 13.7 fl oz/acre. Triple-mode flag leaf protection lasting 28 days.',
      },
      {
        icon: 'shield',
        name: 'Metconazole (Caramba)',
        description:
          'Rate: 10 - 14 fl oz/acre. Rapid systemic uptake into flag leaf and emerging spikelets.',
      },
    ],
    preventionProtocols: [
      {
        icon: 'genetics',
        title: 'Yr5 / Yr15 Adult Plant Resistance',
        subtitle: 'Select certified high-temperature adult-plant resistant lines',
      },
      {
        icon: 'monitoring',
        title: 'Flag Leaf Scouting Threshold',
        subtitle: 'Inspect canopy weekly once night temps hit 10–15°C',
      },
    ],
  },
};

export const INITIAL_DIAGNOSIS_HISTORY: DiagnosisRecord[] = [
  {
    id: 'DIAG-9042',
    timestamp: '2026-10-09 14:22',
    dateFormatted: 'Oct 9, 2026 • 2:22 PM',
    parcelName: 'Green Valley Field #4',
    lotCode: 'GV-BLK-04B',
    gps: '38.541°N, 121.782°W',
    cropName: 'Tomato (Solanum lycopersicum)',
    diseaseName: 'Tomato Early Blight',
    scientificName: 'Alternaria solani fungal complex',
    confidence: '98.4%',
    severity: 'High Severity',
    status: 'Active Treatment',
    symptoms: [
      'Concentric brown ring lesions ("target-board" pattern)',
      'Lower foliage chlorosis & leaf yellowing halo',
      'Dark sunken stem collar lesions near soil line',
    ],
    recommendedAction: 'Copper Octanoate Bio-Spray (45ml/gal) + Sanitary Canopy Pruning of bottom 25% foliage.',
    imageUrl: HOTLINKED_ASSETS.sampleLeaf,
    analyzedBy: 'Elena Vance (Lead Agronomist)',
    method: 'Vision Capture',
  },
  {
    id: 'DIAG-9039',
    timestamp: '2026-10-08 09:15',
    dateFormatted: 'Oct 8, 2026 • 9:15 AM',
    parcelName: 'Green Valley Field #4',
    lotCode: 'GV-CRN-09A',
    gps: '38.544°N, 121.779°W',
    cropName: 'Corn / Maize (Zea mays)',
    diseaseName: 'Common Rust (Puccinia sorghi)',
    scientificName: 'Basidiomycete obligate parasite',
    confidence: '96.1%',
    severity: 'Moderate Severity',
    status: 'Monitoring',
    symptoms: [
      'Cinnamon-brown elongated pustules on upper leaf epidermis',
      'Golden-yellow flecking preceding powdery spore release',
    ],
    recommendedAction: 'Micronized Wettable Sulfur (5 lbs/acre) applied during morning dew window.',
    imageUrl: HOTLINKED_ASSETS.sampleLeaf,
    analyzedBy: 'Elena Vance (Lead Agronomist)',
    method: 'Vision Capture',
  },
  {
    id: 'DIAG-9034',
    timestamp: '2026-10-06 16:48',
    dateFormatted: 'Oct 6, 2026 • 4:48 PM',
    parcelName: 'Oakridge North Block #2',
    lotCode: 'GV-POT-02C',
    gps: '38.539°N, 121.785°W',
    cropName: 'Potato (Solanum tuberosum)',
    diseaseName: 'Late Blight (Phytophthora infestans)',
    scientificName: 'Oomycete water mold pathogen',
    confidence: '99.2%',
    severity: 'Critical Severity',
    status: 'Escalated',
    symptoms: [
      'Water-soaked dark lesions spreading rapidly across foliage',
      'White delicate fungal bloom visible on leaf undersides during high humidity',
    ],
    recommendedAction: 'Orondis Ultra (6.5 fl oz/acre) barrier application + 3m hotspot roguing.',
    imageUrl: HOTLINKED_ASSETS.sampleLeaf,
    analyzedBy: 'Dr. Marcus Sterling (Admin)',
    method: 'Vision Capture',
  },
  {
    id: 'DIAG-9028',
    timestamp: '2026-10-04 11:05',
    dateFormatted: 'Oct 4, 2026 • 11:05 AM',
    parcelName: 'Riverbend Greenhouse Sector A',
    lotCode: 'RB-GH-01A',
    gps: '38.552°N, 121.768°W',
    cropName: 'Cucumber & Squash (Cucurbitaceae)',
    diseaseName: 'Powdery Mildew',
    scientificName: 'Podosphaera xanthii',
    confidence: '95.8%',
    severity: 'Moderate Severity',
    status: 'Resolved',
    symptoms: [
      'Talcum-like white powdery fungal patches on upper leaf lamina',
      'Premature curling and desiccation of mid-canopy leaves',
    ],
    recommendedAction: 'Potassium Bicarbonate foliar wash + greenhouse louver ventilation boost.',
    imageUrl: HOTLINKED_ASSETS.sampleLeaf,
    analyzedBy: 'Elena Vance (Lead Agronomist)',
    method: 'Symptom Analysis',
  },
  {
    id: 'DIAG-9019',
    timestamp: '2026-10-01 08:30',
    dateFormatted: 'Oct 1, 2026 • 8:30 AM',
    parcelName: 'Oakridge North Block #2',
    lotCode: 'GV-WHT-06F',
    gps: '38.535°N, 121.774°W',
    cropName: 'Wheat (Triticum aestivum)',
    diseaseName: 'Wheat Stripe Rust',
    scientificName: 'Puccinia striiformis',
    confidence: '97.9%',
    severity: 'High Severity',
    status: 'Resolved',
    symptoms: [
      'Linear parallel streaks of bright yellow-orange pustules along leaf veins',
      'Flag leaf chlorotic striping',
    ],
    recommendedAction: 'Prosaro 421 SC (7.0 fl oz/acre) flag leaf protectant completed.',
    imageUrl: HOTLINKED_ASSETS.sampleLeaf,
    analyzedBy: 'Elena Vance (Lead Agronomist)',
    method: 'Copilot Triage',
  },
];

export const MAJOR_PLANT_DISEASES: MajorDiseaseInfo[] = [
  {
    id: 'early-blight',
    name: 'Tomato & Solanaceae Early Blight',
    scientificName: 'Alternaria solani',
    pathogenType: 'Fungal',
    affectedCrops: ['Tomato', 'Potato', 'Eggplant', 'Bell Pepper'],
    severity: 'High Severity',
    typicalConfidence: '98.4%',
    image: HOTLINKED_ASSETS.sampleLeaf,
    overview:
      'A pervasive necrotrophic fungal pathogen that overwinters in crop debris and soil. It initiates infection on older, lower foliage via rain splash or overhead irrigation and progresses upward through the canopy, causing defoliation and sunscald on fruit.',
    environmentalTriggers: 'Warm temperatures (24°C–29°C) alternating with heavy morning dew or humid intervals (>65% RH).',
    keySymptoms: [
      'Concentric dark brown rings forming a diagnostic "target-board" or bullseye pattern',
      'Pronounced bright yellow chlorotic halo surrounding necrotic leaf spots',
      'Sunken, dark collar lesions on stems and concentric leathery decay at fruit calyx',
    ],
    organicControl: [
      'Copper Octanoate Bio-Spray (45 ml / gallon) applied every 7–10 days',
      'Bacillus subtilis (Serenade ASO) microbial foliar shield at 2–4 qt/acre',
      'Prune lowest 25% of leaves and apply organic straw mulch to block soil splash',
    ],
    chemicalControl: [
      'Chlorothalonil 720g/L (Bravo WeatherStik) at 1.5–2.0 pt/acre (FRAC M05)',
      'Azoxystrobin (Quadris Flowable) systemic curative at 6.0–9.0 fl oz/acre (FRAC 11)',
    ],
    prevention: 'Strict 3-year non-nightshade crop rotation and sub-surface drip irrigation.',
  },
  {
    id: 'late-blight',
    name: 'Late Blight (Foliar & Tuber Necrosis)',
    scientificName: 'Phytophthora infestans',
    pathogenType: 'Oomycete',
    affectedCrops: ['Potato', 'Tomato'],
    severity: 'Critical Severity',
    typicalConfidence: '99.2%',
    image: HOTLINKED_ASSETS.sampleLeaf,
    overview:
      'An aggressive oomycete water mold capable of decimating an entire field canopy within 7 to 10 days. Wind-borne sporangia travel kilometers between parcels and release swimming zoospores on wet leaf surfaces.',
    environmentalTriggers: 'Cool to moderate temperatures (12°C–21°C) paired with relative humidity exceeding 90% or persistent leaf wetness.',
    keySymptoms: [
      'Irregular, pale-green to dark water-soaked blotches starting at leaf tips and margins',
      'Delicate white cottony sporulation halo on the underside of leaves in morning dew',
      'Greasy dark brown lesions on stems and petioles causing rapid top-down collapse',
    ],
    organicControl: [
      'Copper Hydroxide (Kocide 3000-O) protectant barrier every 5 days during wet weather',
      'Immediate thermal flaming or roguing of primary infection hotspots',
    ],
    chemicalControl: [
      'Oxathiapiprolin + Mandipropamid (Orondis Ultra) at 5.5–8.0 fl oz/acre',
      'Cymoxanil + Famoxadone (Tanos) curative kick-back spray within 24h of infection',
    ],
    prevention: 'Plant certified disease-free seed tubers, eliminate cull piles, and maintain 15cm soil hilling.',
  },
  {
    id: 'common-rust',
    name: 'Common Corn & Cereal Leaf Rust',
    scientificName: 'Puccinia sorghi / Puccinia striiformis',
    pathogenType: 'Fungal',
    affectedCrops: ['Corn / Maize', 'Wheat', 'Barley', 'Oats'],
    severity: 'Moderate Severity',
    typicalConfidence: '96.1%',
    image: HOTLINKED_ASSETS.sampleLeaf,
    overview:
      'An obligate biotrophic parasite that drains host carbohydrates directly from living leaf mesophyll cells, rupturing the epidermis with thousands of brick-red or yellow-orange urediniospores.',
    environmentalTriggers: 'Moderate diurnal temperatures (16°C–23°C) with 6+ hours of nocturnal dew on whorl leaves.',
    keySymptoms: [
      'Cinnamon-brown or bright orange-yellow elongated pustules on both leaf surfaces',
      'Chlorotic flecking that evolves into dusty spore-releasing blisters',
      'Premature flag-leaf senescence and reduced kernel weight / stalk lodging',
    ],
    organicControl: [
      'Micronized Wettable Sulfur (80% WP) dusted or sprayed at 4–6 lbs/acre',
      'Bacillus amyloliquefaciens strain D747 bio-fungicide to prime systemic immunity',
    ],
    chemicalControl: [
      'Azoxystrobin + Propiconazole (Quilt Xcel) at 10.5–14.0 fl oz/acre at VT/R1',
      'Prothioconazole + Tebuconazole (Prosaro) at 6.5–8.2 fl oz/acre',
    ],
    prevention: 'Cultivate Rp1-D (corn) or Yr5/Yr15 (wheat) resistant hybrids and eliminate green bridges.',
  },
  {
    id: 'powdery-mildew',
    name: 'Powdery Mildew Complex',
    scientificName: 'Podosphaera xanthii / Erysiphe necator',
    pathogenType: 'Fungal',
    affectedCrops: ['Cucurbits', 'Grapes', 'Tomato', 'Strawberries', 'Peppers'],
    severity: 'Moderate Severity',
    typicalConfidence: '95.8%',
    image: HOTLINKED_ASSETS.sampleLeaf,
    overview:
      'Unlike most fungal pathogens, Powdery Mildew thrives in dry leaf conditions as long as ambient canopy humidity is elevated. Superficial white mycelia blanket the upper leaf surface, blocking photosynthesis.',
    environmentalTriggers: 'High relative humidity (50%–85%) WITHOUT free water on leaves; shaded dense canopies at 20°C–27°C.',
    keySymptoms: [
      'Distinct white, talcum-powder-like fungal colonies across upper and lower leaf surfaces',
      'Upward leaf curling, brittle foliage texture, and premature leaf drop',
      'Stunted fruit development with russeting and reduced Brix sugar content',
    ],
    organicControl: [
      'Potassium Bicarbonate (MilStop) foliar wash at 2.5 lbs/acre to disrupt osmotic pressure',
      'Cold-pressed Neem Oil (0.5%) or Horticultural Mineral Oil suffocant spray',
    ],
    chemicalControl: [
      'Myclobutanil (Rally 40WSP) at 2.5–5.0 oz/acre (FRAC 3)',
      'Quinoxyfen (Quintec) protectant at 4.0–6.0 fl oz/acre (FRAC 13)',
    ],
    prevention: 'Thin interior canopy for sunlight penetration and avoid excessive nitrogen top-dressing.',
  },
  {
    id: 'bacterial-spot',
    name: 'Bacterial Leaf Spot & Speck',
    scientificName: 'Xanthomonas campestris / Pseudomonas syringae',
    pathogenType: 'Bacterial',
    affectedCrops: ['Pepper', 'Tomato', 'Lettuce', 'Stone Fruit'],
    severity: 'High Severity',
    typicalConfidence: '94.6%',
    image: HOTLINKED_ASSETS.sampleLeaf,
    overview:
      'Pathogenic bacteria enter plants through natural stomatal openings and wind-driven sand or pruning wounds. Lesions rapidly coalesce, causing ragged "shot-hole" tearing and severe defoliation.',
    environmentalTriggers: 'Driving rain, high wind abrasion, overhead sprinkler irrigation, and temperatures between 24°C–30°C.',
    keySymptoms: [
      'Small, angular water-soaked spots (<3mm) that turn greasy dark brown to black',
      'Centers of lesions dry out and tear away, leaving a "shot-hole" appearance',
      'Raised, scabby corky warts on developing green fruit skins',
    ],
    organicControl: [
      'Fixed Copper + Bacteriophage therapy (AgriPhage) applied at dusk',
      'Streptomyces lydicus (Actinovate AG) biological foliar colonizer',
    ],
    chemicalControl: [
      'Copper Hydroxide tank-mixed with Mancozeb to boost free copper ion availability',
      'Acibenzolar-S-methyl (Actigard 50WG) plant defense activator',
    ],
    prevention: 'Hot-water seed treatment (50°C for 25 min) and strict prohibition of working in wet fields.',
  },
  {
    id: 'fusarium-wilt',
    name: 'Fusarium & Verticillium Vascular Wilt',
    scientificName: 'Fusarium oxysporum / Verticillium dahliae',
    pathogenType: 'Fungal',
    affectedCrops: ['Tomato', 'Banana', 'Cotton', 'Melon', 'Eggplant'],
    severity: 'High Severity',
    typicalConfidence: '93.9%',
    image: HOTLINKED_ASSETS.sampleLeaf,
    overview:
      'Soil-borne vascular pathogens that penetrate root tips and colonize xylem vessels. Mycelia and tyloses clog water transport, causing permanent daytime wilting even when soil moisture is optimal.',
    environmentalTriggers: 'Warm, acidic sandy soils (27°C–32°C), root-knot nematode feeding wounds, and ammoniacal nitrogen.',
    keySymptoms: [
      'Asymmetric "one-sided" yellowing and wilting of lower leaves or single branches',
      'Daytime wilting with partial overnight recovery until permanent collapse occurs',
      'Reddish-brown vascular ring discoloration visible when slicing the lower main stem',
    ],
    organicControl: [
      'Trichoderma virens & Bacillusvelezensis root-zone bio-drench at transplanting',
      'Soil solarization with clear UV polyethylene film for 6 weeks during peak summer',
    ],
    chemicalControl: [
      'Fludioxonil + Pydiflumetofen root-zone soil drench (where registered)',
      'Nematicide management to eliminate root-knot nematode entry wounds',
    ],
    prevention: 'Graft susceptible scions onto resistant rootstocks (I-3 / Ve genes) and raise soil pH to 6.5–7.0.',
  },
];

export const AGRO_TIPS_DATA: AgroTipItem[] = [
  {
    id: 'tip-irrigation',
    category: 'Irrigation & Soil',
    title: 'Sub-Surface Drip & Stomatal Moisture Equilibrium',
    cropFocus: 'Tomato, Corn & Row Crops',
    readTime: '3 min guide',
    impactMetric: '-42% Fungal Spore Splash',
    icon: 'water_drop',
    summary:
      'Overhead sprinklers wet the leaf phyllosphere for 4–8 hours, creating the exact germination window required by Alternaria and Phytophthora spores. Transitioning to sub-surface drip lines at 15–25cm depth keeps foliage bone-dry while maintaining root-zone moisture at 26–32%.',
    actionChecklist: [
      'Irrigate between 04:00 AM and 07:00 AM so any incidental dew evaporates rapidly with sunrise',
      'Monitor soil tensiometers at 35cm root depth; trigger irrigation before matric potential drops below -35 kPa',
      'Flush drip laterals bi-weekly with mild citric acid solution to prevent emitter calcification',
    ],
    proMetric: 'Target VWC: 28.4% • EC: 1.8 dS/m',
  },
  {
    id: 'tip-pruning',
    category: 'Spray & Pruning',
    title: 'Sanitary Canopy Architecture & Bottom-Up Pruning',
    cropFocus: 'Greenhouse & Field Solanaceae',
    readTime: '4 min guide',
    impactMetric: '+31% Canopy Airflow',
    icon: 'content_cut',
    summary:
      'Soil-borne pathogens bridge onto plants via the lowest leaves touching damp soil or mulch. Removing the bottom 20–25% of senescing leaves once the first fruit cluster sets dramatically lowers within-canopy relative humidity and improves spray penetration.',
    actionChecklist: [
      'Excise all leaves below the lowest developing fruit cluster once stems reach 60cm height',
      'Dip pruning shears in 70% isopropyl alcohol or 10% household bleach between every plant row',
      'Perform pruning only on sunny, dry mornings so stem wounds callus rapidly before nightfall',
    ],
    proMetric: 'Target Canopy RH: <65% • Clearance: 25cm',
  },
  {
    id: 'tip-spray-window',
    category: 'Spray & Pruning',
    title: 'Delta-T Precision Spray Window & Droplet Optimization',
    cropFocus: 'All Commercial Parcels',
    readTime: '3 min guide',
    impactMetric: '+28% Active Uptake',
    icon: 'air',
    summary:
      'Spraying fungicides or bio-controls during mid-day heat causes rapid droplet evaporation (scorch) or thermal drift, whereas spraying during temperature inversions leads to off-target runoff. Always verify Delta-T (wet-bulb depression) is between 2°C and 8°C.',
    actionChecklist: [
      'Execute foliar sprays when wind speed is steady between 3 km/h and 12 km/h (avoid dead calm inversions)',
      'Use hollow-cone nozzles at 45–60 PSI for fungicides to coat abaxial (underside) leaf surfaces',
      'Check leaf water pH before mixing; buffer spray tank water to pH 6.0–6.5 to prevent alkaline hydrolysis',
    ],
    proMetric: 'Optimal Delta-T: 2.0–8.0 • Wind: <12 km/h',
  },
  {
    id: 'tip-nutrition',
    category: 'Crop Nutrition',
    title: 'Balanced NPK-Calcium Ratios to Fortify Cell Walls',
    cropFocus: 'Fruiting Vegetables & Cereals',
    readTime: '5 min guide',
    impactMetric: '-35% Tissue Susceptibility',
    icon: 'science',
    summary:
      'Excessive ammoniacal nitrogen forces lush, thin-walled vegetative growth with high free amino acids—acting as a magnet for aphids, powdery mildew, and bacterial spot. Pairing nitrate nitrogen with soluble Calcium and Potassium Silicon builds mechanical cell-wall armor.',
    actionChecklist: [
      'Split nitrogen applications into 4–6 spoon-fed fertigation events rather than heavy pre-plant dumps',
      'Supplement foliar Calcium-Boron during early flowering to prevent blossom-end rot and strengthen middle lamella',
      'Apply Potassium Silicate (100 ppm Si) every 14 days to harden epidermal cuticles against fungal pegs',
    ],
    proMetric: 'Soil pH: 6.4–6.8 • K:N Ratio: 1.5:1 at fruiting',
  },
  {
    id: 'tip-rotation',
    category: 'Disease Prevention',
    title: '3-Year Non-Host Crop Rotation & Bio-Fumigation',
    cropFocus: 'Multi-Parcel Field Operations',
    readTime: '4 min guide',
    impactMetric: '-68% Soil Inoculum',
    icon: 'sync',
    summary:
      'Planting tomatoes, potatoes, or peppers in the same block year after year exponentially multiplies overwintering Alternaria, Verticillium, and cyst nematode populations. Rotating with brassica cover crops or grasses breaks the pathogen life cycle.',
    actionChecklist: [
      'Never follow Potato with Tomato, Eggplant, or Pepper (all share Solanaceae pathogens)',
      'Seed high-glucosinolate Mustard (Brassica juncea) as a winter cover crop and incorporate before full bloom for natural bio-fumigation',
      'Log every parcel diagnosis in AgroAI Diagnosis History to map persistent hotspot coordinates across seasons',
    ],
    proMetric: 'Rotation Cycle: 36 Months • Cover Biomass: 4.5 t/ac',
  },
  {
    id: 'tip-scouting',
    category: 'Seasonal Maintenance',
    title: 'Proactive W-Pattern Field Scouting & Early Triage',
    cropFocus: 'Daily Routine Maintenance',
    readTime: '3 min guide',
    impactMetric: '4.2x Faster Containment',
    icon: 'visibility',
    summary:
      'Catching a fungal or bacterial outbreak when lesion incidence is below 1% allows organic bio-fungicides to halt spread completely. Walking a systematic W-pattern across parcels twice weekly ensures edge-effect and low-lying wet spots are inspected.',
    actionChecklist: [
      'Inspect 5 plants at each of 10 stops along a W-shaped transect through every parcel block',
      'Examine both upper canopy (for wind-borne rust/mildew) and lowest shaded leaves (for soil-borne blight)',
      'Use AgroAI Vision Capture or the AgroAI Copilot chatbot immediately upon spotting unfamiliar chlorosis or lesions',
    ],
    proMetric: 'Scouting Cadence: Every 72h • Sample Size: 50 plants/block',
  },
];
