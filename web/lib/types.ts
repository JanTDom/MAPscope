export type UserRole =
  | "minister"
  | "communication"
  | "governance"
  | "catalog"
  | "internal_data";

export type EntityStatus =
  | "active"
  | "restructuring"
  | "liquidation"
  | "bankruptcy"
  | "suspended"
  | "dissolved";

export type OwnershipType =
  | "direct"
  | "indirect"
  | "minority"
  | "majority"
  | "wholly_owned";

export type StrategicImportance =
  | "strategic"
  | "key"
  | "regional"
  | "standard"
  | "special_purpose";

export type RiskSeverity =
  | "p1_critical"
  | "p2_high"
  | "p3_moderate"
  | "low"
  | "neutral";

export type AlertPriority = "p1" | "p2" | "p3";
export type AlertStatus = "pending" | "dispatched" | "acknowledged" | "resolved";

export interface CommunicationRisks {
  blad_narracyjny: boolean;
  rozdzwiek_z_rzadem: boolean;
  zaognienie_konfliktu: boolean;
  ryzyko_regulacyjne_mar: boolean;
  szczegoly?: Record<string, string>;
}

export interface GovernanceRisks {
  kadry_spory: boolean;
  kontrole_sledztwa: boolean;
  finanse_plynnosc: boolean;
  infrastruktura_awarie: boolean;
  narracja_polityczna: boolean;
  szczegoly?: Record<string, string>;
}

export interface NarrativeComparison {
  companyClaim: string;
  mediaCoverage: string;
  publicReaction: string;
}

export interface BoardMember {
  name: string;
  role: string;
  appointedAt: string;
  expiresAt?: string;
  status: "active" | "vacancy" | "competition";
}

export interface Shareholder {
  name: string;
  percentage: number;
}

export interface EspiReport {
  number: string;
  date: string;
  title: string;
  isInsideInformation: boolean;
}

export interface LegalCase {
  institution: "NIK" | "CBA" | "Prokuratura" | "UOKiK" | "Sąd";
  title: string;
  status: string;
  startedAt: string;
  riskSeverity: RiskSeverity;
}

export interface SocialFactor {
  unionName: string;
  disputeStage: string;
  wageDemands: string;
  threatLevel: "niski" | "umiarkowany" | "wysoki" | "krytyczny";
}

export interface TimelineEvent {
  date: string;
  type: "komunikat" | "dymisja" | "kontrola" | "spór" | "finanse";
  title: string;
  summary: string;
}

export interface TimeSeriesPoint {
  time: string;
  volume: number;
  sentiment: number; // od -1.0 do +1.0
}

export interface EntityDossier {
  // 1. Ład i Własność
  shareholders: Shareholder[];
  managementBoard: BoardMember[];
  supervisoryBoard: BoardMember[];
  vacanciesCount: number;
  ongoingCompetitions: number;
  agmDate?: string;
  financialReportStatus: "zatwierdzone" | "w_trakcie_badania" | "opóźnione";

  // 2. Ryzyko Komunikacyjne
  narrativeRiskScore: number;
  narrativeSummary: string;

  // 3. Finanse i Inwestycje
  capexMln: number;
  ebitdaMln: number;
  revenueMln: number;
  netDebtToEbitda: number;
  dividendProposal?: string;
  recentEspiReports: EspiReport[];

  // 4. Prawne i Kontrole
  legalCases: LegalCase[];

  // 5. Czynniki Społeczne
  laborUnionsCount: number;
  activeDisputes: SocialFactor[];
  layoffRisk: string;

  // 6. Oś Czasu
  timeline: TimelineEvent[];
}

export interface EntityRecord {
  id: string;
  name: string;
  formal_name?: string | null;
  nip?: string | null;
  krs?: string | null;
  regon?: string | null;
  state_share_percent: number;
  ownership_type: OwnershipType;
  ownership_body: string;
  status: EntityStatus;
  sector: string;
  map_department?: string | null;
  strategic_importance: StrategicImportance;
  stock_ticker?: string | null;
  is_public_listed: boolean;
  website_url?: string | null;
  press_office_url?: string | null;
  active_risk_level?: RiskSeverity;
  recent_risk_score?: number;
  dossier?: EntityDossier;
}

export interface RiskAssessmentRecord {
  id: string;
  target_id: string;
  entity_id: string;
  entity_name: string;
  severity: RiskSeverity;
  overall_risk_score: number;
  communication_risks: CommunicationRisks;
  governance_risks: GovernanceRisks;
  narrative_comparison?: NarrativeComparison;
  executive_summary: string;
  map_impact_analysis: string;
  recommended_action?: string | null;
  recommendedAction?: string | null;
  assessed_at: string;
}

export interface AlertRecord {
  id: string;
  entity_id: string;
  entity_name: string;
  priority: AlertPriority;
  title: string;
  summary: string;
  status: AlertStatus;
  dispatched_channels: string[];
  created_at: string;
}

export interface StoryClusterRecord {
  id: string;
  title: string;
  summary: string;
  primary_entity_id?: string;
  primary_entity_name?: string;
  status: string;
  severity_level: RiskSeverity;
  article_count: number;
  disclosure_count: number;
  first_seen_at?: string;
  last_seen_at?: string;
}

export interface CompanyDisclosureRecord {
  id: string;
  entity_id: string;
  entity_name: string;
  disclosure_type: string;
  title: string;
  content: string;
  channel: string;
  speaker_name?: string | null;
  published_at: string;
  source_url?: string | null;
  risk_assessment?: RiskAssessmentRecord | null;
}

export interface TopFireAlert {
  id: string;
  priority: AlertPriority;
  entityId: string;
  entityName: string;
  title: string;
  whatHappened: string;
  whoResponsible: string;
  governmentRisk: string;
  recommendedAction: string;
  timestamp: string;
}

export interface SectorStability {
  name: string;
  entitiesCount: number;
  temperature: number; // 0 - 100
  status: "stabilny" | "podwyższone_ryzyko" | "krytyczny";
  primaryIssue: string;
}

export interface ParliamentaryInquiry {
  id: string;
  number: string;
  subject: string;
  author: string;
  addressedTo: string;
  deadline: string;
  status: string;
  priority: "standard" | "high" | "critical";
  suggestedAnswerPoints: string[];
}

export interface MediaRadarAnomalies {
  entityId: string;
  entityName: string;
  spikeVolume: number;
  baselineVolume: number;
  negativeRatio: number;
  triggerEvent: string;
  timeSeries: TimeSeriesPoint[];
}

export interface InternalDataEntry {
  entityId: string;
  internalKpis: Record<string, string | number>;
  notes: string[];
  inspectionFileNumbers: string[];
  updatedAt: string;
}
