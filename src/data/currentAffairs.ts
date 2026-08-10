export interface CurrentAffair {
  id: string
  date: string
  title: string
  source: string
  gsLink: string
  timeline: string
  eliminationTrap: string
  category: string
}

export const currentAffairsData: CurrentAffair[] = [
  {
    id: 'ca-1',
    date: '2025-01-15',
    title: 'GST Council Decisions & Federalism',
    source: 'The Hindu',
    gsLink: 'Polity: Art 279A | Economy: GST',
    timeline: '15 Sep 2016 Est, 01 Jul 2017 Impl',
    eliminationTrap: 'Voting: Center 1/3, States 2/3. 75% Majority required. CJI NOT in GST Council.',
    category: 'Economy',
  },
  {
    id: 'ca-2',
    date: '2025-01-14',
    title: 'NBFC Scale-Based Regulation (SBR)',
    source: 'RBI Bulletin',
    gsLink: 'Economy: Banking & NBFC',
    timeline: '22 Oct 2021 Rules, 01 Oct 2022 Impl',
    eliminationTrap: 'NBFCs CANNOT accept Demand Deposits. DICGC ₹5L insurance does NOT apply to NBFCs.',
    category: 'Economy',
  },
  {
    id: 'ca-3',
    date: '2025-01-13',
    title: 'G7 Global Minimum Tax (Pillar 2)',
    source: 'OECD / The Hindu',
    gsLink: 'Economy: International Taxation',
    timeline: '08 Oct 2021 Deal, 01 Jan 2024 Impl',
    eliminationTrap: 'Sets 15% global minimum corporate tax. Not 21% (original US proposal).',
    category: 'Economy',
  },
  {
    id: 'ca-4',
    date: '2025-01-12',
    title: 'RBI Surplus Transfer to Government',
    source: 'PIB',
    gsLink: 'Economy: Public Finance',
    timeline: '26 Aug 2019 (Jalan Comm), 23 May 2024 (₹2.11L Cr)',
    eliminationTrap: 'Non-tax revenue receipt. Neither liability reduction NOR asset reduction.',
    category: 'Economy',
  },
  {
    id: 'ca-5',
    date: '2025-01-11',
    title: 'CEC & EC Appointment Act 2023',
    source: 'Gazette of India',
    gsLink: 'Polity: Election Commission',
    timeline: '28 Dec 2023 Act, 15 Mar 2024 Appt',
    eliminationTrap: 'Selection Committee: PM + Opposition Leader + Cabinet Min. CJI is NOT in committee.',
    category: 'Polity',
  },
  {
    id: 'ca-6',
    date: '2025-01-10',
    title: 'Forest Rights Act (FRA 2006)',
    source: 'MoEFCC / SC Orders',
    gsLink: 'Environment: Forest Laws | Polity: Tribal Rights',
    timeline: '29 Dec 2006 Act, 19 Feb 2024 SC Order',
    eliminationTrap: 'Nodal Ministry: Ministry of Tribal Affairs (NOT MoEFCC). Community rights include CPR.',
    category: 'Environment',
  },
]

export interface EliminationTrap {
  id: string
  trap: string
  subject: string
  importance: 'critical' | 'high' | 'medium'
}

export const eliminationTraps: EliminationTrap[] = [
  { id: 'et-1', trap: 'T-Bills issued by Center ONLY (not states)', subject: 'Economy', importance: 'critical' },
  { id: 'et-2', trap: 'SDF (Standing Deposit Facility) needs NO collateral', subject: 'Economy', importance: 'critical' },
  { id: 'et-3', trap: 'GST Council: Center 1/3 vote, States 2/3 vote, 75% majority', subject: 'Polity', importance: 'critical' },
  { id: 'et-4', trap: 'CEC Committee: PM + Opp Leader + Cabinet Min (No CJI)', subject: 'Polity', importance: 'critical' },
  { id: 'et-5', trap: 'FRA 2006 Nodal: Ministry of Tribal Affairs (NOT MoEFCC)', subject: 'Environment', importance: 'critical' },
  { id: 'et-6', trap: 'NBFCs CANNOT accept Demand Deposits; DICGC does NOT cover', subject: 'Economy', importance: 'high' },
  { id: 'et-7', trap: 'Masala Bonds: Listed on India, Denominated in INR', subject: 'Economy', importance: 'high' },
  { id: 'et-8', trap: 'NARCL (Bad Bank): 51% Public Sector Banks', subject: 'Economy', importance: 'high' },
  { id: 'et-9', trap: 'CBDC e-Rupee: RBI liability (not commercial bank liability)', subject: 'Economy', importance: 'high' },
  { id: 'et-10', trap: 'Basic Structure: Kesavananda Bharati 1973 (not Golaknath)', subject: 'Polity', importance: 'critical' },
  { id: 'et-11', trap: 'NJAC struck down: 99th Amendment + NJAC Act', subject: 'Polity', importance: 'high' },
  { id: 'et-12', trap: 'Paris Agreement: 1.5°C target, NDCs, Green Climate Fund', subject: 'Environment', importance: 'high' },
  { id: 'et-13', trap: 'SDF replaced Standing Facility in LAF (Apr 2020)', subject: 'Economy', importance: 'medium' },
  { id: 'et-14', trap: 'RBI Repo Rate = Policy Rate (not Bank Rate)', subject: 'Economy', importance: 'critical' },
  { id: 'et-15', trap: 'Basel III CAR: 9% (4.5%+2.5%+2%)', subject: 'Economy', importance: 'high' },
]

export interface CSATFormula {
  id: string
  topic: string
  formula: string
  example: string
  tip: string
}

export const csatFormulas: CSATFormula[] = [
  { id: 'csat-1', topic: 'Cyclicity', formula: 'Cycle of unit digits repeats every 4 powers', example: '2^1=2, 2^2=4, 2^3=8, 2^4=6, 2^5=2...', tip: 'Find remainder of exponent ÷ 4 to determine position in cycle' },
  { id: 'csat-2', topic: 'Remainder Theorem', formula: 'f(a) = remainder when f(x) is divided by (x-a)', example: 'f(x)=x²+3x+2, f(2)=4+6+2=12', tip: 'For large powers: use Euler\'s theorem φ(n)' },
  { id: 'csat-3', topic: 'Trailing Zeros', formula: 'Trailing zeros = ⌊n/5⌋ + ⌊n/25⌋ + ⌊n/125⌋ + ...', example: '100! → ⌊100/5⌋+⌊100/25⌋=20+4=24 zeros', tip: 'Count pairs of 2×5; 5s are always fewer than 2s' },
  { id: 'csat-4', topic: 'Divisibility by 9', formula: 'Sum of digits divisible by 9', example: '729 → 7+2+9=18 → divisible by 9', tip: 'Digital root: keep summing until single digit' },
  { id: 'csat-5', topic: 'Divisibility by 11', formula: 'Alt sum of digits: (odd positions) - (even positions)', example: '12321 → (1+3+1)-(2+2)=5-4=1 → divisible', tip: 'If result is 0 or multiple of 11, number is divisible' },
  { id: 'csat-6', topic: 'P&C - Permutation', formula: 'ⁿPr = n!/(n-r)!', example: '⁵P₃ = 5!/2! = 60', tip: 'Order matters → Permutation' },
  { id: 'csat-7', topic: 'P&C - Combination', formula: 'ⁿCr = n!/[r!(n-r)!]', example: '⁵C₃ = 5!/(3!×2!) = 10', tip: 'Order doesn\'t matter → Combination' },
  { id: 'csat-8', topic: 'Number System - HCF×LCM', formula: 'HCF(a,b) × LCM(a,b) = a × b', example: 'HCF(12,18)=6, LCM=36 → 6×36=12×18=216', tip: 'Useful for finding one when other three are known' },
]

export const googleDocsLinks = [
  { name: 'Economy Financial Market & Banking Master Notes V3', url: '#' },
  { name: 'Economy Monetary Policy & RBI Master Notes V2', url: '#' },
  { name: 'Executive Project Progress Report V1', url: '#' },
  { name: 'Prelims Progress KPI Dashboard', url: '#' },
]
