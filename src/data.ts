import { OpalRecord, RarityTier } from './types';

export const GRADE_COLORS: Record<number, string> = {
  1: '#1E293B', // Obsidian Mists
  2: '#334155', // Slate Fog
  3: '#00D1FF', // Electric Blue
  4: '#00FF88', // Emerald Laser
  5: '#FFD700', // Solar Gold
  6: '#FF4D97', // Neon Pink
  7: '#E84393', // Prismatic Fuchsia
  8: '#6C5CE7', // Royal Indigo
  9: '#FFFFFF'  // Pure Diamond
};

export const RARITY_TIERS: Record<string, RarityTier> = {
  Zenith: { label: 'Zenith', color: '#FFFFFF', minGrade: 9, xp: 1000, multi: 5.0 },
  Legendary: { label: 'Legendary', color: '#6C5CE7', minGrade: 7, xp: 250, multi: 2.5 },
  Epic: { label: 'Epic', color: '#FFD700', minGrade: 5, xp: 100, multi: 1.8 },
  Rare: { label: 'Rare', color: '#00D1FF', minGrade: 3, xp: 50, multi: 1.3 },
  Common: { label: 'Common', color: '#334155', minGrade: 1, xp: 20, multi: 1.0 }
};

export const getRarity = (grade: number) => {
  if (grade >= 9) return RARITY_TIERS.Zenith;
  if (grade >= 7) return RARITY_TIERS.Legendary;
  if (grade >= 5) return RARITY_TIERS.Epic;
  if (grade >= 3) return RARITY_TIERS.Rare;
  return RARITY_TIERS.Common;
};

export const USERS = {
  'mattk': {
    id: 'mattk', name: 'Matt Kathagen', role: 'Miner · Origin Specialist',
    color: '#D4AF37', initials: 'MK', wallet: 'OPN-MK-GENESIS-001', desc: 'Andamooka · Genesis Mine'
  },
  'mattr': {
    id: 'mattr', name: 'Matt Rogers', role: 'Cutter · Market Specialist',
    color: '#2DD4BF', initials: 'MR', wallet: 'OPN-MROG-002', desc: 'Hahndorf · Lapidary Studio'
  }
};

export const SEEDS = [
  { id: 1, name: "Low Grade Soft Matrix", mk_ppg: 0.30, mk_ppc_cut: 1.50, mk_rough_total: 9.24, mk_cut_total: 231.00, mk_grade: 2, mr_offer: 0.62, mr_ppg_implied: 0.02, mr_grade: 1, wg: 30.8, ct: 154, brightness: "B6", bodyTone: "N7", pattern: "Pinfire", treatmentQuality: "Poor", stabilityRisk: "High", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777163110/LM2_nkylci.jpg" },
  { id: 2, name: "High Saturation Matrix", mk_ppg: 3.00, mk_ppc_cut: null, mk_rough_total: 77.40, mk_cut_total: null, mk_grade: 4, mr_offer: null, mr_ppg_implied: 2.50, mr_grade: 3, wg: 25.8, ct: 129, brightness: "B4", bodyTone: "N5", pattern: "Flash", treatmentQuality: "Standard", stabilityRisk: "Medium", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777163115/1_lkkddr.jpg" },
  { id: 3, name: "Low Grade Colour Concrete Treated", mk_ppg: 0.075, mk_ppc_cut: 0.38, mk_rough_total: 0.90, mk_cut_total: 22.88, mk_grade: 1, mr_offer: 0.24, mr_ppg_implied: 0.02, mr_grade: 1, wg: 12.04, ct: 60.2, brightness: "B7", bodyTone: "N8", pattern: "Pinfire", treatmentQuality: "Poor", stabilityRisk: "High", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777163115/LG1_lqks7p.jpg" },
  { id: 4, name: "Low Grade Matrix", mk_ppg: 1.00, mk_ppc_cut: 7.50, mk_rough_total: 13.58, mk_cut_total: 509.25, mk_grade: 3, mr_offer: 20.00, mr_ppg_implied: 1.47, mr_grade: 2, wg: 13.58, ct: 67.9, brightness: "B6", bodyTone: "N7", pattern: "Pinfire", treatmentQuality: "Standard", stabilityRisk: "Medium", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777163115/IMG_4826_vvo5gb.jpg" },
  { id: 5, name: "High Grade Colour Concrete Treated", mk_ppg: .75, mk_ppc_cut: 7.50, mk_rough_total: 21.51, mk_cut_total: 1072.50, mk_grade: 5, mr_offer: 0.57, mr_ppg_implied: 0.02, mr_grade: 1, wg: 28.60, ct: 143, brightness: "B3", bodyTone: "N4", pattern: "Flash", treatmentQuality: "High", stabilityRisk: "Low", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777163115/IMG_4825-preview_d2ulch.jpg" },
  { id: 6, name: "Mid Grade Hard Matrix", mk_ppg: 2.50, mk_ppc_cut: 20.00, mk_rough_total: 27.73, mk_cut_total: 1109.00, mk_grade: 4, mr_offer: 500.00, mr_ppg_implied: 45.09, mr_grade: 6, wg: 11.09, ct: 55.45, brightness: "B4", bodyTone: "N5", pattern: "Flash", treatmentQuality: "Standard", stabilityRisk: "Medium", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777163110/IMG_4824_a1cg0h.jpg" },
  { id: 7, name: "Mid Grade High Colour Matrix", mk_ppg: 3.00, mk_ppc_cut: 30.00, mk_rough_total: 17.22, mk_cut_total: 861.00, mk_grade: 5, mr_offer: 600.00, mr_ppg_implied: 104.53, mr_grade: 7, wg: 5.74, ct: 28.7, brightness: "B3", bodyTone: "N4", pattern: "Ribbon", treatmentQuality: "High", stabilityRisk: "Low", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777183367/IMG_4822_jhvoa0.jpg" },
  { id: 8, name: "High Grade Hard Matrix Treated", mk_ppg: 4.00, mk_ppc_cut: 45.00, mk_rough_total: 157.44, mk_cut_total: 8856.90, mk_grade: 6, mr_offer: 900.00, mr_ppg_implied: 22.86, mr_grade: 5, wg: 39.36, ct: 196.82, brightness: "B2", bodyTone: "N2", pattern: "Ribbon", treatmentQuality: "High", stabilityRisk: "Low", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777183367/IMG_4822_jhvoa0.jpg" },
  { id: 9, name: "High Grade Hard Matrix Untreated", mk_ppg: 5.00, mk_ppc_cut: 100.00, mk_rough_total: 920.00, mk_cut_total: 92000.00, mk_grade: 8, mr_offer: 500.00, mr_ppg_implied: 2.72, mr_grade: 3, wg: 184, ct: 920, brightness: "B1", bodyTone: "N1", pattern: "Harlequin", treatmentQuality: "High", stabilityRisk: "Low", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777163110/IMG_4824_a1cg0h.jpg" },
  { id: 10, name: "Mid Grade Colour Concrete Treated", mk_ppg: 0.20, mk_ppc_cut: 0.75, mk_rough_total: 2.97, mk_cut_total: 55.61, mk_grade: 2, mr_offer: 0.30, mr_ppg_implied: 0.02, mr_grade: 1, wg: 14.83, ct: 74.15, brightness: "B4", bodyTone: "N5", pattern: "Flash", treatmentQuality: "Standard", stabilityRisk: "Medium", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777163112/MGC_s9ap7y.jpg" },
  { id: 11, name: "High Grade Hard Matrix Small", mk_ppg: 3.50, mk_ppc_cut: 45.00, mk_rough_total: 20.65, mk_cut_total: 1327.50, mk_grade: 7, mr_offer: 700.00, mr_ppg_implied: 118.64, mr_grade: 8, wg: 5.9, ct: 29.5, brightness: "B2", bodyTone: "N2", pattern: "Ribbon", treatmentQuality: "High", stabilityRisk: "Low", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777163116/IMG_4816_lzlryn.jpg" },
  { id: 12, name: "High Grade Hard Matrix Large", mk_ppg: 3.50, mk_ppc_cut: 45.00, mk_rough_total: 179.45, mk_cut_total: 11535.75, mk_grade: 7, mr_offer: 300.00, mr_ppg_implied: 5.85, mr_grade: 4, wg: 51.27, ct: 256.35, brightness: "B2", bodyTone: "N2", pattern: "Ribbon", treatmentQuality: "High", stabilityRisk: "Low", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777163110/IMG_4815_w0j9m6.jpg" },
  { id: 13, name: "Highest Grade Gem Hard Matrix Treated", mk_ppg: 10.00, mk_rough_total: 25.30, mk_cut_total: 1265.00, mk_grade: 9, mr_offer: 1200.00, mr_ppg_implied: 474.11, mr_grade: 9, wg: 2.53, ct: 12.65, brightness: "B1", bodyTone: "N1", pattern: "Harlequin", treatmentQuality: "High", stabilityRisk: "Low", nft: false, img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777163110/IMG_4852_qtm7zi.jpg" }

];

export const CUSTODIAN_ASSETS = [
  {
    id: "CC-001",
    type: "CUSTODIAN",
    collection: "Cobra Cuff",
    serialNumber: 1,
    totalEdition: 20,
    name: "Cobra Cuff No. 1 — Genesis Edition",
    owner: "Matt Kathagen",
    ownerRole: "Miner · CUSTODIAN Co-Founder",
    maker: "CUSTODIAN™ · Lee & Matt",
    retailPrice: 2675,
    currency: "AUD",
    status: "HELD — NOT LISTED",
    genesisAsset: true,
    firstOnOPN: true,
    mediaAppearance: "Outback Opal Hunters",
    stone: {
      grade: 9,
      carats: 20,
      type: "Green Hard Matrix — Treated",
      pattern: "Broadflash",
      brightness: "B1",
      miner: "Matt & Cozza Kathagen",
      mine: "Mooka Boy Mine",
      coordinates: { lat: -30.454699, lng: 137.189437 },
      location: "Andamooka, South Australia",
    },
    object: {
      housing: "Reclaimed Andamooka mining steel",
      housingMaker: "Andamooka community blacksmith",
      cord: "Black paracord 550 — field-ready",
      clasp: "Military-grade tactical clasp",
      engraving: "Crossed pickaxe marks — Mooka Boys insignia",
      dimensions: "Adjustable wrist cuff",
    },
    provenance: [
      { step: 1, label: "Extracted",    detail: "Mooka Boy Mine · Andamooka SA",     coords: "-30.454699, 137.189437" },
      { step: 2, label: "Treated",      detail: "Matt & Cozza Kathagen · Andamooka", date: "2026" },
      { step: 3, label: "Set",          detail: "Community blacksmith · Andamooka",  date: "2026" },
      { step: 4, label: "Assembled",    detail: "CUSTODIAN™ · Lee & Matt",           date: "2026" },
      { step: 5, label: "Certified",    detail: "AOSA M9 Standard",                  date: "2026" },
      { step: 6, label: "Opal - Cut",   detail: "Matt Rogers",                       date: "2026" },
      { step: 7, label: "Broadcast",    detail: "Outback Opal Hunters — global",     date: "2026" },
      { step: 8, label: "Mint Pending", detail: "OPN · Polygon Network",             date: "2026" },
    ],
    nft: false,
    nft_value: 8025,
    nft_image: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&q=80&w=800",
    img: "https://res.cloudinary.com/dkgqxred2/image/upload/v1777219429/IMG_4875_xo12hj.png",
    gain30d: 18.5,
  }
];

export const PORTAL_CHART_DATA = [
  { month: 'Jan', value: 8000 },
  { month: 'Feb', value: 12500 },
  { month: 'Mar', value: 14200 },
  { month: 'Apr', value: 13800 },
  { month: 'May', value: 18500 },
  { month: 'Jun', value: 24082 },
];

export const generatePriceHistory = (base: number) => {
  const points = [];
  let current = base * 0.85;
  for(let i=0; i<30; i++) {
    current = current * (1 + (Math.random() * 0.02 - 0.005));
    points.push({ day: i, val: current });
  }
  return points;
};

export const calculateDerived = (s: any) => {
  const grade = s.mk_grade || 1;
  const rarity = getRarity(grade);
  const nft_value = s.mr_offer ? s.mr_offer * (grade >= 9 ? 1.8 : grade >= 8 ? 1.4 : grade >= 7 ? 1.2 : 1.1) : s.mk_rough_total * 1.1;
  const history = generatePriceHistory(nft_value);
  const price30d = history[0].val;
  const gain30d = ((nft_value / price30d - 1) * 100).toFixed(1);
  const div_pct_val = s.mr_offer && s.mk_rough_total ? ((s.mk_rough_total / s.mr_offer - 1) * 100) : null;
  const divergence_pct = div_pct_val !== null ? div_pct_val.toFixed(1) + '%' : 'N/A';
  const mr_ppg_implied_safe = s.mr_ppg_implied || 0;
  return { ...s, nft_value, history, gain30d, div_pct_val, divergence_pct, mr_ppg_implied_safe, rarity };
};

export const formatCur = (v: any) => {
  if (v === null || v === undefined) return 'N/A';
  const n = Number(v);
  if (isNaN(n)) return 'N/A';
  return '$' + n.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits:2});
};

export const formatNum = (v: any) => {
  if (v === null || v === undefined) return 'N/A';
  const n = Number(v);
  if (isNaN(n)) return 'N/A';
  return n.toLocaleString('en-US', {minimumFractionDigits: 1, maximumFractionDigits:1});
};

export const getGradeTheme = (grade: number) => {
  if (grade >= 9) return { 
    color: '#FFFFFF', 
    border: 'border-white', 
    bg: 'bg-white/20', 
    text: 'text-white',
    glow: 'shadow-[0_0_40px_rgba(255,255,255,0.4)]',
    accent: '#00D1FF'
  };
  if (grade >= 7) return { 
    color: '#6C5CE7', 
    border: 'border-indigo-500', 
    bg: 'bg-indigo-500/20', 
    text: 'text-indigo-400',
    glow: 'shadow-[0_0_25px_rgba(108,92,231,0.3)]',
    accent: '#FF4D97'
  };
  if (grade >= 5) return { 
    color: '#FFD700', 
    border: 'border-yellow-500', 
    bg: 'bg-yellow-500/20', 
    text: 'text-yellow-400',
    glow: 'shadow-[0_0_20px_rgba(255,215,0,0.3)]',
    accent: '#00FF88'
  };
  if (grade >= 3) return { 
    color: '#00D1FF', 
    border: 'border-[#00D1FF]/30', 
    bg: 'bg-[#00D1FF]/10', 
    text: 'text-[#00D1FF]',
    glow: 'shadow-[0_0_15px_rgba(0,209,255,0.2)]',
    accent: '#00D1FF'
  };
  return { 
    color: '#94a3b8', 
    border: 'border-white/10', 
    bg: 'bg-white/5', 
    text: 'text-white/40',
    glow: '',
    accent: '#94a3b8'
  };
};
