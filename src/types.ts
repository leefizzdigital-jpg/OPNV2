export interface RarityTier {
  label: string;
  color: string;
  minGrade: number;
  xp: number;
  multi: number;
}

export interface OpalRecord {
  id: string | number;
  name: string;
  mk_ppg?: number;
  mk_ppc_cut?: number;
  mk_rough_total?: number;
  mk_cut_total?: number;
  mk_grade?: number;
  mr_offer?: number;
  mr_ppg_implied?: number;
  mr_grade?: number;
  wg?: number;
  ct?: number;
  brightness?: string | number;
  bodyTone?: string;
  pattern?: string;
  treatmentQuality?: string;
  stabilityRisk?: string;
  genesis?: boolean;
  nft: boolean;
  img: string;
  nft_img?: string;
  nft_value?: number;
  history?: { day: number; val: number }[];
  gain30d?: number | string;
  div_pct_val?: number;
  divergence_pct?: string;
  mr_ppg_implied_safe?: number;
  rarity?: RarityTier;
  
  // Legacy / Hybrid Fields
  type?: string;
  origin?: string;
  weight?: number; 
  dimensions?: string;
  certificateId?: string;
  mintedAt?: string;
  imageUrl?: string;
  historicalNotes?: string;
  archetype?: string;
  rank?: string;
  powerLevel?: number;
  pricePerCarat?: number;
  isVerified?: boolean;
  nftStyle?: string;
  nftTheme?: string;
  nftFocus?: string;
}

export interface CustodianAsset {
  id: string;
  type: string;
  collection: string;
  serialNumber: number;
  totalEdition: number;
  name: string;
  owner: string;
  ownerRole: string;
  maker: string;
  retailPrice: number;
  currency: string;
  status: string;
  genesisAsset: boolean;
  firstOnOPN: boolean;
  mediaAppearance: string;
  stone: {
    grade: number;
    carats: number;
    type: string;
    pattern: string;
    brightness: string;
    miner: string;
    mine: string;
    coordinates: { lat: number; lng: number };
    location: string;
  };
  object: any;
  provenance: any[];
  nft: boolean;
  nft_value: number;
  nft_image: string;
  img: string;
  gain30d: number;
}

export type MintingStep = 'basic' | 'characteristics' | 'provenance' | 'ceremony' | 'review';
