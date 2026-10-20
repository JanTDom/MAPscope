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

export interface RiskAssessmentRecord {
  id: string;
  target_id: string;
  entity_id: string;
  entity_name: string;
  severity: RiskSeverity;
  overall_risk_score: number;
  communication_risks: CommunicationRisks;
  governance_risks: GovernanceRisks;
  executive_summary: string;
  map_impact_analysis: string;
  recommended_action?: string | null;
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
  primary_entity_id?: string | null;
  primary_entity_name?: string | null;
  status: "active" | "escalating" | "stabilizing" | "closed";
  severity_level: RiskSeverity;
  article_count: number;
  disclosure_count: number;
  first_seen_at: string;
  last_seen_at: string;
}
