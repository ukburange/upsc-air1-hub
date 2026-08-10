// Comprehensive UPSC CSE 2027 Syllabus Data - Micro-Topics
export interface MicroTopic {
  id: string
  name: string
  completed: boolean
  tier: 1 | 2 | 3
}

export interface SyllabusPaper {
  id: string
  name: string
  gsCode: string
  tier: 1 | 2 | 3
  color: string
  topics: MicroTopic[]
}

export const syllabusData: SyllabusPaper[] = [
  {
    id: 'polity',
    name: 'Indian Polity & Constitutional Framework',
    gsCode: 'GS-2',
    tier: 1,
    color: '#6366f1',
    topics: [
      { id: 'pol-1', name: 'Constituent Assembly Dynamics & Preamble Amendability', completed: true, tier: 1 },
      { id: 'pol-2', name: 'Basic Structure Evolution & Federal vs Unitary Traits', completed: true, tier: 1 },
      { id: 'pol-3', name: 'Fundamental Rights (Part III, Art 12-35) & Writs', completed: true, tier: 1 },
      { id: 'pol-4', name: 'DPSP Classifications (Socialistic, Gandhian, Liberal-Intellectual)', completed: true, tier: 1 },
      { id: 'pol-5', name: 'Fundamental Duties (Part IV-A) & UCC Application', completed: true, tier: 1 },
      { id: 'pol-6', name: 'President vs Governor (Ordinance, Pardon, Discretionary Powers)', completed: true, tier: 1 },
      { id: 'pol-7', name: 'PM & Council of Ministers (Collective Responsibility)', completed: true, tier: 1 },
      { id: 'pol-8', name: 'Attorney General & Advocate General', completed: true, tier: 1 },
      { id: 'pol-9', name: 'Office of Governor Disputes & Article 356', completed: true, tier: 1 },
      { id: 'pol-10', name: 'Lok Sabha vs Rajya Sabha & Parliamentary Sessions', completed: true, tier: 1 },
      { id: 'pol-11', name: 'Types of Bills (Money, Financial, Ordinary, Constitutional)', completed: true, tier: 1 },
      { id: 'pol-12', name: 'Motions, Resolutions & Parliamentary Committees', completed: true, tier: 1 },
      { id: 'pol-13', name: 'Powers, Privileges & Immunities of MPs/MLAs', completed: true, tier: 1 },
      { id: 'pol-14', name: 'Anti-Defection Law (10th Schedule)', completed: true, tier: 1 },
      { id: 'pol-15', name: 'Supreme Court & HC Jurisdiction (Original, Appellate, Advisory)', completed: true, tier: 1 },
      { id: 'pol-16', name: 'Collegium System & NJAC Controversies', completed: true, tier: 1 },
      { id: 'pol-17', name: 'Judicial Review, Judicial Activism & Curative Petitions', completed: true, tier: 1 },
      { id: 'pol-18', name: 'Gram Nyayalayas & Tribunals', completed: true, tier: 1 },
      { id: 'pol-19', name: 'Election Commission, UPSC, SPSC Appointment Rules', completed: true, tier: 1 },
      { id: 'pol-20', name: 'Finance Commission, GST Council & CAG', completed: true, tier: 1 },
      { id: 'pol-21', name: 'NITI Aayog, NHRC, SHRC, CIC, SIC', completed: true, tier: 1 },
      { id: 'pol-22', name: 'Lokpal & Lokayuktas, CVC, CBI, ED', completed: true, tier: 1 },
      { id: 'pol-23', name: 'NCSC, NCST, NCBC Constitutional Bodies', completed: true, tier: 1 },
      { id: 'pol-24', name: 'RPA 1950 & 1951 Salient Features', completed: true, tier: 1 },
      { id: 'pol-25', name: 'Electoral Reforms & Delimitation Commission', completed: true, tier: 1 },
      { id: 'pol-26', name: 'PMLA Execution & CAA', completed: true, tier: 1 },
      { id: 'pol-27', name: 'Uniform Civil Code (UCC) & 6th Schedule Extension', completed: true, tier: 1 },
      { id: 'pol-28', name: 'CEC & EC Appointment Act 2023 (No CJI in Committee)', completed: true, tier: 1 },
      { id: 'pol-29', name: 'Constitutional Amendments - Recent & Landmark', completed: true, tier: 1 },
    ],
  },
  {
    id: 'economy',
    name: 'Indian Economy & Macroeconomic Concepts',
    gsCode: 'GS-3',
    tier: 1,
    color: '#f59e0b',
    topics: [
      { id: 'eco-1', name: 'National Income Accounting (GDP, GNP, NDP, NNP)', completed: true, tier: 1 },
      { id: 'eco-2', name: 'SDGs & HDI Components', completed: true, tier: 1 },
      { id: 'eco-3', name: 'Public Finance (Art 266/267) & Fiscal Deficit', completed: true, tier: 1 },
      { id: 'eco-4', name: 'Direct & Indirect Taxation (GST Art 279A)', completed: true, tier: 1 },
      { id: 'eco-5', name: 'Tax Reforms (Cess/Surcharge Exclusion, BEPS)', completed: true, tier: 1 },
      { id: 'eco-6', name: 'Money Market (T-Bills, Call Money, CP/CD)', completed: true, tier: 1 },
      { id: 'eco-7', name: 'Capital Market (SEBI, FSDC, Masala Bonds)', completed: true, tier: 1 },
      { id: 'eco-8', name: 'Banking System (BR Act 2020, PBs, SFBs, SARFAESI, NARCL)', completed: true, tier: 1 },
      { id: 'eco-9', name: 'Monetary Policy & RBI (Repo, SDF, CRR/SLR, MPC)', completed: true, tier: 1 },
      { id: 'eco-10', name: 'Money Supply (M0-M4, Money Multiplier, Basel III, CBDC)', completed: true, tier: 1 },
      { id: 'eco-11', name: 'External Sector (BOP/BOT, NEER/REER, ECB)', completed: false, tier: 1 },
      { id: 'eco-12', name: 'Global Institutions (IMF, World Bank, WTO)', completed: false, tier: 1 },
      { id: 'eco-13', name: 'Agriculture Sector (Land Reforms, MSP, PDS, Agri-Tech)', completed: false, tier: 1 },
      { id: 'eco-14', name: 'Food Processing & Supply Chain', completed: false, tier: 1 },
      { id: 'eco-15', name: 'Infrastructure (NIP, PM Gati Shakti, Logistics)', completed: false, tier: 1 },
      { id: 'eco-16', name: 'Government Budgeting & FRBM Act', completed: false, tier: 1 },
      { id: 'eco-17', name: 'BoP Crisis, Forex Reserves & De-dollarisation', completed: false, tier: 1 },
      { id: 'eco-18', name: 'FDI vs FPI Frameworks & PPP Models', completed: false, tier: 1 },
      { id: 'eco-19', name: 'Inflation Types & Index Numbers', completed: false, tier: 1 },
      { id: 'eco-20', name: 'Digital Economy (UPI, ONDC, Data Privacy)', completed: false, tier: 1 },
    ],
  },
  {
    id: 'history',
    name: 'Modern Indian History',
    gsCode: 'GS-1',
    tier: 1,
    color: '#ef4444',
    topics: [
      { id: 'his-1', name: 'Decline of Mughals & Regional Powers Expansion', completed: false, tier: 1 },
      { id: 'his-2', name: 'Anglo-Mysore, Anglo-Maratha, Anglo-Punjab Wars', completed: false, tier: 1 },
      { id: 'his-3', name: 'Battle of Plassey & Buxar Political Settlements', completed: false, tier: 1 },
      { id: 'his-4', name: 'British Admin (Regulating Act, Pitts India Act, Charter Acts)', completed: false, tier: 1 },
      { id: 'his-5', name: 'British Economic Policy (Drain of Wealth, Land Revenue)', completed: false, tier: 1 },
      { id: 'his-6', name: 'Revolt of 1857 (Causes, Leaders, Consequences)', completed: false, tier: 1 },
      { id: 'his-7', name: 'Tribal Movements (Santhal, Munda) & Peasant Movements', completed: false, tier: 1 },
      { id: 'his-8', name: 'Indian Renaissance & Socio-Religious Reform Movements', completed: false, tier: 1 },
      { id: 'his-9', name: 'INC Foundation, Moderate vs Extremist Phases', completed: false, tier: 1 },
      { id: 'his-10', name: 'Swadeshi Movement, Surat Split, Home Rule League', completed: false, tier: 1 },
      { id: 'his-11', name: 'Gandhian Era (Champaran, Kheda, Rowlatt, Jallianwala)', completed: false, tier: 1 },
      { id: 'his-12', name: 'Non-Cooperation, Khilafat, Swaraj Party', completed: false, tier: 1 },
      { id: 'his-13', name: 'Simon Commission, Nehru Report, Civil Disobedience', completed: false, tier: 1 },
      { id: 'his-14', name: 'Round Table Conferences, Poona Pact, GOI Act 1935', completed: false, tier: 1 },
      { id: 'his-15', name: 'Quit India 1942, INA Trials, Royal Indian Navy Revolt', completed: false, tier: 1 },
      { id: 'his-16', name: 'Cabinet Mission Plan & Mountbatten Plan', completed: false, tier: 1 },
      { id: 'his-17', name: 'Indian Independence Act 1947 & Integration', completed: false, tier: 1 },
      { id: 'his-18', name: 'Revolutionary Movements (HRA, HSRA)', completed: false, tier: 1 },
    ],
  },
  {
    id: 'geography',
    name: 'Geography (Physical & Indian)',
    gsCode: 'GS-1',
    tier: 2,
    color: '#10b981',
    topics: [
      { id: 'geo-1', name: 'Geomorphology: Plate Tectonics, Earthquakes, Volcanoes', completed: false, tier: 2 },
      { id: 'geo-2', name: 'Climatology: Atmosphere, Pressure Belts, Monsoons', completed: false, tier: 2 },
      { id: 'geo-3', name: 'Oceanography: Currents, Tides, salinity', completed: false, tier: 2 },
      { id: 'geo-4', name: 'Biogeography: Biomes, Biogeochemical Cycles', completed: false, tier: 2 },
      { id: 'geo-5', name: 'Indian Physical: Himalayas, Northern Plains, Peninsular', completed: false, tier: 2 },
      { id: 'geo-6', name: 'Indian Drainage System & River Systems', completed: false, tier: 2 },
      { id: 'geo-7', name: 'Indian Climate: Monsoon Mechanism, Rainfall Distribution', completed: false, tier: 2 },
      { id: 'geo-8', name: 'Indian Soils & Natural Vegetation', completed: false, tier: 2 },
      { id: 'geo-9', name: 'Indian Agriculture: Cropping Patterns & Irrigation', completed: false, tier: 2 },
      { id: 'geo-10', name: 'Indian Minerals & Energy Resources', completed: false, tier: 2 },
      { id: 'geo-11', name: 'Indian Transport & Industrial Corridors', completed: false, tier: 2 },
      { id: 'geo-12', name: 'Population & Migration in India', completed: false, tier: 2 },
      { id: 'geo-13', name: 'Disaster Management: Types, Mitigation, NDMA', completed: false, tier: 2 },
      { id: 'geo-14', name: 'Map-based Questions: Passes, Peaks, Straits', completed: false, tier: 2 },
      { id: 'geo-15', name: 'World Geography: Major Physical Features', completed: false, tier: 2 },
      { id: 'geo-16', name: 'Resources & Development: Sustainable Models', completed: false, tier: 2 },
    ],
  },
  {
    id: 'environment',
    name: 'Environment & Ecology',
    gsCode: 'GS-3',
    tier: 1,
    color: '#22c55e',
    topics: [
      { id: 'env-1', name: 'Ecosystem Dynamics & Ecological Succession', completed: false, tier: 1 },
      { id: 'env-2', name: 'Food Chains, Food Webs & Biomagnification', completed: false, tier: 1 },
      { id: 'env-3', name: 'Terrestrial & Aquatic Biomes', completed: false, tier: 1 },
      { id: 'env-4', name: 'Coral Reefs, Mangroves & Ramsar Sites', completed: false, tier: 1 },
      { id: 'env-5', name: 'Biodiversity Classifications & IUCN Red List', completed: false, tier: 1 },
      { id: 'env-6', name: 'Biodiversity Hotspots & Mega-diverse Countries', completed: false, tier: 1 },
      { id: 'env-7', name: 'National Conservation Programs (Tiger, Elephant, Cheetah)', completed: false, tier: 1 },
      { id: 'env-8', name: 'Biosphere Reserves & UNESCO MAB Program', completed: false, tier: 1 },
      { id: 'env-9', name: 'Pollution Standards (NAAQS, AQI, POPs)', completed: false, tier: 1 },
      { id: 'env-10', name: 'Waste Management Rules (Solid, E-waste, Plastic)', completed: false, tier: 1 },
      { id: 'env-11', name: 'Wildlife Protection Act 1972 & Forest Conservation Act', completed: false, tier: 1 },
      { id: 'env-12', name: 'NGT Powers & EIA Protocols', completed: false, tier: 1 },
      { id: 'env-13', name: 'International Bodies (UNEP, UNFCCC, CBD, UNCCD)', completed: false, tier: 1 },
      { id: 'env-14', name: 'Paris Agreement, Aichi Targets & India\'s Climate Pledges', completed: false, tier: 1 },
    ],
  },
  {
    id: 'science',
    name: 'Science & Technology',
    gsCode: 'GS-3',
    tier: 2,
    color: '#8b5cf6',
    topics: [
      { id: 'sci-1', name: 'Biotechnology & Genetic Engineering', completed: false, tier: 2 },
      { id: 'sci-2', name: 'Space Technology (ISRO Missions, Satellites)', completed: false, tier: 2 },
      { id: 'sci-3', name: 'IT & Computers (AI, ML, Quantum Computing)', completed: false, tier: 2 },
      { id: 'sci-4', name: 'Nuclear Technology & Energy', completed: false, tier: 2 },
      { id: 'sci-5', name: 'Defence Technology & DRDO', completed: false, tier: 2 },
      { id: 'sci-6', name: 'Health & Diseases (Vaccines, Pandemics)', completed: false, tier: 2 },
      { id: 'sci-7', name: 'Physics & Chemistry Basics', completed: false, tier: 2 },
      { id: 'sci-8', name: 'Biotechnology in Agriculture', completed: false, tier: 2 },
      { id: 'sci-9', name: 'Blockchain, Cybersecurity & Data Privacy', completed: false, tier: 2 },
      { id: 'sci-10', name: 'Renewable Energy Technologies', completed: false, tier: 2 },
      { id: 'sci-11', name: 'Nanotechnology & Robotics', completed: false, tier: 2 },
      { id: 'sci-12', name: 'Latest Developments in S&T (Current Year)', completed: false, tier: 2 },
    ],
  },
  {
    id: 'ir',
    name: 'International Relations',
    gsCode: 'GS-2',
    tier: 2,
    color: '#0ea5e9',
    topics: [
      { id: 'ir-1', name: 'India\'s Bilateral Relations (Major Powers)', completed: false, tier: 2 },
      { id: 'ir-2', name: 'Multilateral Groupings (G20, BRICS, SCO, QUAD)', completed: false, tier: 2 },
      { id: 'ir-3', name: 'India\'s WTO Stance & Trade Agreements', completed: false, tier: 2 },
      { id: 'ir-4', name: 'India\'s Neighbourhood Policy (SAARC, BBIN, Act East)', completed: false, tier: 2 },
    ],
  },
]

export function getTotalTopics(data: SyllabusPaper[]): number {
  return data.reduce((sum, paper) => sum + paper.topics.length, 0)
}

export function getCompletedTopics(data: SyllabusPaper[]): number {
  return data.reduce((sum, paper) => sum + paper.topics.filter(t => t.completed).length, 0)
}

export function getPaperProgress(data: SyllabusPaper[], paperId: string): number {
  const paper = data.find(p => p.id === paperId)
  if (!paper) return 0
  return Math.round((paper.topics.filter(t => t.completed).length / paper.topics.length) * 100)
}
