export type UserRole =
  | "minister"
  | "communication"
  | "governance"
  | "analytics"
  | "catalog"
  | "internal_data"
  | "social_dialogue"
  | "map_zone";

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
  sourceReference?: string;
  verifiedAt?: string;
  officialKrsUrl?: string;
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
  strategicLitigations?: StrategicLitigationCase[];

  // 5. Czynniki Społeczne
  laborUnionsCount: number;
  activeDisputes: SocialFactor[];
  layoffRisk: string;

  // 6. Oś Czasu
  timeline: TimelineEvent[];

  // 7. Szybka Fiszka Ministra (Briefing 10s)
  ministerBriefing?: MinisterQuickBriefing;

  // 8. Paszport Źródła KRS i Proweniencja Danych
  krs_registry_url?: string | null;
  krs_verification_date?: string | null;
  krs_verification_source?: string | null;
  krs_verification_status?: "verified_krs" | "verified_espi" | "pending_resync";
}

export interface EntityRecord {
  id: string;
  name: string;
  formal_name?: string | null;
  nip?: string | null;
  krs?: string | null;
  regon?: string | null;
  city?: string | null;
  status_label?: string | null;
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
  parent_entity_id?: string | null;
  parent_entity_name?: string | null;
  subsidiary_count?: number;
  subsidiaries?: string[];
  is_dormant_liquidation?: boolean;
  dormant_years?: number;
  has_real_estate?: boolean;
  krs_registry_url?: string | null;
  krs_verification_date?: string | null;
  krs_verification_source?: string | null;
  krs_verification_status?: "verified_krs" | "verified_espi" | "pending_resync";
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

export type CrisisAttribution = "nasza_odpowiedzialnosc" | "zaszlosc_historyczna" | "miedzyresortowa";

export interface SejmQnAItem {
  question: string;
  source: string;
  hardFacts: string;
  recommendedAnswer: string;
  redLines: string; // Czego kategorycznie nie mówić
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
  attribution?: CrisisAttribution;
  attributionDetails?: string;
  sejmQnA?: SejmQnAItem[];
  ministerImpactScore?: number;
}

export interface KprmOnePagerItem {
  category: "sukces" | "pozar_wygaszony" | "ryzyko_miedzyresortowe" | "decyzja_premiera";
  title: string;
  entityName: string;
  details: string;
  actionRequired?: string;
}

export interface KprmOnePager {
  id: string;
  date: string;
  targetCabinetMeetingDate: string;
  title: string;
  executiveSummary: string;
  items: KprmOnePagerItem[];
  restructuringProgress: {
    entityName: string;
    targetSavings: string;
    headcountChange: string;
    currentStatus: string;
  }[];
}

export interface MinisterImpactBreakdown {
  entityId: string;
  entityName: string;
  impactScorePercent: number; // 0-100%
  attackVectors: {
    vector: string;
    severity: "wysoka" | "srednia" | "niska";
    allegation: string;
  }[];
  mitigationStrategy: string;
}

export interface PrePublicationAuditResult {
  id: string;
  inputText: string;
  entityName: string;
  verdict: "green" | "yellow" | "red";
  verdictLabel: "Bezpieczne do publikacji" | "Wymaga korekty" | "Krytyczne ryzyko rykoszetu";
  riskHighlights: {
    phrase: string;
    dangerType: "arogancja" | "obietnica_bez_pokrycia" | "ryzyko_mar" | "rozdzwiek_z_map" | "zaognienie_konfliktu";
    comment: string;
  }[];
  improvedVersion: string;
}

export interface NarrativeSourceBreakdown {
  oppositionPoliticiansPercent: number;
  laborUnionsPercent: number;
  regionalMediaPercent: number;
  nationalMediaPercent: number;
  financialAnalystsPercent: number;
  primaryNarrativeDriver: string;
}

export interface MandateExpiryAlert {
  id: string;
  entityId: string;
  entityName: string;
  bodyType: "Zarząd" | "Rada Nadzorcza";
  daysLeft: number;
  expiryDate: string;
  affectedSeats: number;
  totalSeats: number;
  quorumLossRisk: boolean;
  notes: string;
}

export interface Article19ComplianceRecord {
  personName: string;
  entityName: string;
  role: string;
  passedExam: boolean;
  legalOrFinanceDegree: boolean;
  noPoliticalBanConflict: boolean;
  complianceStatus: "zgodny" | "w_trakcie_weryfikacji" | "niezgodny";
  verificationDetails: string;
}

export interface GovernanceSentimentCorrelation {
  entityId: string;
  entityName: string;
  changeDate: string;
  eventDescription: string;
  sentimentBefore: number; // np. -0.85
  sentimentAfter: number;  // np. -0.15
  crisisDropPercent: number;
}

export interface DividendBudgetProjection {
  entityId: string;
  entityName: string;
  declaredOrEstimatedDividendMln: number;
  stateSharePercent: number;
  projectedBudgetRevenueMln: number;
  status: "rekomendacja_wyplaty" | "zatrzymanie_zysku_capex" | "brak_zysku";
  capexFocusArea?: string;
}

export interface StrategicCapexProject {
  id: string;
  name: string;
  entityName: string;
  totalBudgetMln: number;
  spentSoFarMln: number;
  delayMonths: number;
  impairmentRiskMln: number;
  status: "w_harmonogramie" | "zagrozenie_opoznieniem" | "krytyczne_ryzyko_odpisu";
  strategicSignificance: string;
}

export interface InterMinisterialTransferRecord {
  id: string;
  entityName: string;
  currentAuthority: string;
  targetAuthority: string;
  transferStage: "analiza_prawna" | "projekt_rozporzadzenia" | "przekazano";
  legislationRef: string;
  strategicReason: string;
}

export interface NikInspectionRecommendation {
  id: string;
  inspectionNumber: string;
  title: string;
  entityName: string;
  issuedAt: string;
  deadline: string;
  status: "wdrozone" | "w_trakcie" | "przeterminowane";
  recommendationSummary: string;
  ministerDefensePoint: string;
}

export interface StrategicLitigationCase {
  id: string;
  court: string;
  opponent: string;
  valueMlnPln: number;
  caseSubject: string;
  status: "w_toku" | "apelacja" | "ugoda";
  contingencyRisk: "wysokie" | "umiarkowane" | "niskie";
}

export interface MinisterQuickBriefing {
  threeNumbers: { label: string; value: string }[];
  statusSummary: string;
  defensiveTalkingPoint: string;
  keyRiskThisWeek: string;
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

// ==========================================
// PAKIET ZAAWANSOWANYCH WIZUALIZACJI I OSINT
// ==========================================

export interface VoivodeshipRegionalData {
  id: string; // np. "mazowieckie", "slaskie"
  name: string; // "Mazowieckie"
  pathData: string; // SVG path
  center: [number, number]; // [x, y] w viewbox 0 0 600 550
  entitiesCount: number;
  workforceCount: number;
  strikeAlertsCount: number;
  liquidationSitesCount: number;
  riskStatus: "stabilny" | "podwyższone_ryzyko" | "krytyczny";
  keyFlagships: string[];
  primaryRegionalIssue: string;
}

export interface RiskMatrixScatterPoint {
  id: string;
  entityName: string;
  tickerOrAlias: string;
  sector: string;
  probability: number; // 0 - 100%
  ministerImpact: number; // 0 - 100%
  workforceOrAssetsWeight: number; // wielkość bąbla (np. 15 - 45)
  category: "kadry" | "finanse" | "awaria" | "spór_społeczny" | "regulacje";
  summary: string;
  quadrant: "czerwona_strefa_kprm" | "ryzyko_wizerunkowe" | "konflikt_operacyjny" | "stabilny_monitoring";
}

export interface SankeyFlowLink {
  source: string;
  target: string;
  value: number; // w mld PLN
  label: string;
  color?: string;
}

export interface SankeyFlowNode {
  id: string;
  name: string;
  column: number; // 0: zysk całkowity, 1: alokacja wewnętrzna, 2: beneficjent końcowy
  value: number; // mld PLN
  color: string;
  subtext?: string;
}

export interface RadarSpiderMetrics {
  entityId: string;
  governanceScore: number; // Ład korporacyjny & Art. 19 (0-100)
  communicationScore: number; // Dyscyplina medialna & brak wpadek (0-100)
  financeScore: number; // Płynność finansowa & EBITDA (0-100)
  capexScore: number; // Terminowość projektów strategicznych (0-100)
  socialScore: number; // Dialog ze związkami zawodowymi (0-100)
  auditScore: number; // Czystość kontrolna NIK / KNF (0-100)
  aggregateMaturity: number; // Średnia ważona
  status: "bezpieczna" | "wymaga_nadzoru" | "alarmowa";
}

export interface GovernanceNetworkNode {
  id: string;
  label: string;
  type: "person" | "company";
  role?: string;
  entityCount?: number;
  art19ViolationRisk?: boolean;
}

export interface GovernanceNetworkEdge {
  source: string;
  target: string;
  role: string;
  delegatingBody: string;
  sinceDate: string;
  isHoldingTie?: boolean;
}

export interface ReputationWaterfallStep {
  id: string;
  label: string;
  category: "baseline" | "negative_event" | "positive_intervention" | "net_total";
  delta: number; // zmiana punktowa np. -16 lub +24
  cumulative: number;
  description: string;
  date: string;
}

export interface CalendarHeatmapDay {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0-6
  weekIndex: number; // 0-51
  intensity: number; // 0 - 4
  crisisEventsCount: number;
  parliamentSitting: boolean;
  cabinetMeeting: boolean;
  notableEvent?: string;
}

export interface OsintSearchResult {
  title: string;
  link: string;
  sourceDomain: string;
  sourceName: string;
  snippet?: string;
  pubDate?: string;
  urgencyTier: "P1" | "P2" | "P3";
  riskCategory: string;
  isDuplicate?: boolean;
}

// ==========================================
// GIEŁDA GPW, RELACJE INWESTORSKIE & SAMORZĄDY
// ==========================================

export interface StockExchangeData {
  entityId: string;
  ticker: string;
  isListed: boolean;
  currentPricePln: number;
  change1dPercent: number;
  change1mPercent: number;
  marketCapMldPln: number;
  stateShareValueMldPln: number;
  peRatio: number; // C/Z
  pbRatio: number; // C/WK
  dividendYieldPercent: number;
  politicalDiscountPercent: number; // Szacowane dyskonto ryzyka regulacyjnego
  indexBasket: string[];
}

export interface EspiReportRecord {
  id: string;
  reportNumber: string;
  entityTicker: string;
  entityName: string;
  publishedAt: string;
  title: string;
  category: "MAR_POUFNA" | "KADRY" | "WYNIKI" | "DYWIDENDA" | "SPÓR_SĄDOWY" | "INWESTYCJE";
  isMarRiskFlag: boolean;
  summary: string;
  espiUrl: string;
}

export interface AnalystConsensusRecord {
  entityTicker: string;
  entityName: string;
  buyCount: number;
  holdCount: number;
  sellCount: number;
  averageTargetPricePln: number;
  currentPricePln: number;
  upsideDownsidePercent: number;
  topBrokers: {
    broker: string;
    rating: "Kupuj" | "Trzymaj" | "Redukuj" | "Sprzedaj";
    targetPrice: number;
    date: string;
  }[];
}

export interface LocalMunicipalIssue {
  id: string;
  entityId: string;
  entityName: string;
  municipalityName: string; // np. "Gmina Kleszczów", "Miasto Płock", "Gmina Lubin"
  voivodeship: string;
  issueType: "PODATEK_LOKALNY" | "ŚRODOWISKO_ODORY" | "ZATRUDNIENIE_RYNEK_PRACY" | "SPÓR_PLANISTYCZNY";
  financialImpactMlnPln: number;
  description: string;
  status: "otwarty_spór" | "negocjacje" | "ugoda";
  countyWorkforceSharePercent: number; // % udziału w lokalnym rynku pracy
}

export interface NationalAssetsPortfolioStats {
  totalPortfolioValueMldPln: number;
  portfolioValueGrowthYoYMldPln: number;
  totalWorkforceCount: number;
  annualAggregateRevenueMldPln: number;
  projectedDividends2026MldPln: number;
  realizedDividends2026MldPln: number;
  totalEntitiesCount: number;
  listedStrategicEntitiesCount: number;
  lastSyncTimestamp: string;
}

export interface CriticalInfrastructureSector {
  id: string;
  sectorName: string;
  alertLevel: "NORMALNY" | "BRAVO_CRP" | "CHARLIE_CRP" | "DELTA";
  strategicEntities: string[];
  operationalContinuityPercent: number;
  cyberAttacksBlocked24h: number;
  leadAgency: string;
  threatSummary: string;
}

export interface AgmVotingInstructionTemplate {
  id: string;
  entityName: string;
  ticker: string;
  meetingType: "ZWZ" | "NWZ";
  agendaItem: string;
  recommendedVote: "ZA" | "PRZECIW" | "WSTRZYMUJĘ_SIĘ";
  statutoryBasis: string;
  ministerJustification: string;
  redLineConstraint: string;
}

export interface StrategicReserveIndicator {
  id: string;
  resourceName: string;
  category: "PALIWA_ROPA" | "GAZ_ZIEMNY" | "WEGIEL_ENERGETYCZNY" | "AMONIAK_NAWOZY" | "REZERWY_MEDYCZNE_RARS";
  currentLevelValue: number;
  unit: string;
  mandatoryMinimumValue: number;
  status: "BEZPIECZNY" | "OSTRZEGAWCZY" | "KRYTYCZNY";
  supervisingEntity: string;
  diagnosis: string;
}

export interface ForeignTakeoverShieldEntity {
  id: string;
  entityName: string;
  ticker: string;
  stateSharePercent: number;
  freeFloatPercent: number;
  foreignCapitalSharePercent: number;
  isProtectedByAct: boolean;
  suspiciousAccumulationAlert: boolean;
  lastTransactionNotice: string;
  ministerialVetoAvailable: boolean;
}

export interface DebtStabilityRecord {
  id: string;
  entityName: string;
  ticker: string;
  netDebtMldPln: number;
  ebitdaMldPln: number;
  netDebtToEbitda: number;
  covenantLimit: number;
  isCovenantBreached: boolean;
  nearestMaturityDate: string;
  nearestMaturityAmountMlnPln: number;
  creditorConsortium: string;
  stabilizationRecommendation: string;
}

export interface MorningCabinetBriefing {
  id: string;
  briefingDate: string;
  keyNumberValue: string;
  keyNumberLabel: string;
  urgentDecisionToSign: string;
  audioDurationSeconds: number;
  top3StrategicEvents: { title: string; entity: string; consequenceForMap: string }[];
  transcriptText: string;
}

export type ReportStandard = "ESEF_IXBRL" | "KNF_ESPI_XML" | "XBRL_2_1";

export type CovenantStatus =
  | "BEZPIECZNY"
  | "OSTRZEGAWCZY"
  | "KOWENANT_NARUSZONY"
  | "KRYTYCZNY";

export interface EspiXbrlLineItem {
  tag: string;
  label: string;
  rawValue: string;
  normalizedValueMlnPln: number;
  period: string;
  unit: string;
  taxonomy: string;
}

export interface CovenantEvaluation {
  netDebtMldPln: number;
  ebitdaMldPln: number;
  netDebtToEbitda: number | null;
  covenantLimit: number;
  status: CovenantStatus;
  isBreached: boolean;
  interestCoverageRatio: number | null;
  waiverRequired: boolean;
  marRiskFlag: boolean;
  ministerialRecommendation: string;
}

export interface EspiXbrlPeriodicReport {
  id: string;
  reportNumber: string;
  entityName: string;
  ticker: string;
  nip?: string;
  krs?: string;
  periodEnded: string;
  publishedAt: string;
  reportStandard: ReportStandard;
  currency: string;

  // Pozycje rachunku zysków i strat (mln PLN)
  revenueMlnPln: number;
  operatingProfitEbitMlnPln: number;
  depreciationMlnPln: number;
  calculatedEbitdaMlnPln: number;
  netProfitLossMlnPln: number;
  financeCostsMlnPln: number;

  // Pozycje bilansowe (mln PLN)
  longTermBorrowingsMlnPln: number;
  shortTermBorrowingsMlnPln: number;
  totalGrossDebtMlnPln: number;
  cashAndEquivalentsMlnPln: number;
  netDebtMlnPln: number;
  totalEquityMlnPln: number;
  totalAssetsMlnPln: number;

  // Ocena kowenantowa
  covenant: CovenantEvaluation;

  // Identyfikowalność tagów taksonomii
  tagsProvenance: EspiXbrlLineItem[];
  rawXmlSnippet?: string;
}

export type WebhookSourceType = "KNF_ESPI" | "PAP_BIZNES";

export type WebhookEventType =
  | "PERIODIC_REPORT_PUBLISHED"
  | "CURRENT_REPORT_PUBLISHED"
  | "REPORT_CORRECTION"
  | "SYSTEM_HEARTBEAT";

export interface WebhookTransmissionRecord {
  eventId: string;
  source: WebhookSourceType;
  eventType: WebhookEventType;
  ticker: string;
  entityName: string;
  reportNumber: string;
  receivedAt: string;
  status: "PROCESSED" | "COVENANT_ALERT" | "HEARTBEAT" | "REJECTED";
  covenantBreached: boolean;
  marRiskFlag: boolean;
  latencyMs: number;
  details: string;
}

export interface EspiWebhookServiceState {
  isListening: boolean;
  gatewayProtocol: string;
  endpointUrl: string;
  activeSources: WebhookSourceType[];
  totalTransmissionsReceived: number;
  lastHeartbeatAt: string;
  recentTransmissions: WebhookTransmissionRecord[];
}

export type DisputeLegalStage =
  | "ROKOWANIA"
  | "PROTOKOL_ROZBIEZNOSCI"
  | "MEDIACJA_MRPIPS"
  | "STRAJK_OSTRZEGAWCZY"
  | "REFERENDUM_STRAJKOWE"
  | "POGOTOWIE_STRAJKOWE"
  | "STRAJK_GENERALNY"
  | "POROZUMIENIE_ZAWISLE";

export type DisputeThreatLevel =
  | "KRYTYCZNY"
  | "WYSOKI"
  | "UMIARKOWANY"
  | "MONITOROWANY";

export interface LaborDisputeFinancialBaseline {
  revenueMlnPln: number;
  ebitdaMlnPln: number;
  netDebtMlnPln: number;
  netDebtToEbitda: number;
  maxCovenantRatio: number;
  totalPayrollMlnPln: number;
}

export interface LaborDisputeRecord {
  id: string;
  entityName: string;
  ticker: string;
  sector: string;
  voivodeship: string;
  facilityLocation: string;
  unionsInvolved: string[];
  demandSummary: string;
  demandedWageIncreasePct: number;
  demandedOneOffBonusPln?: number;
  estimatedAnnualCostMlnPln: number;
  workersAffectedCount: number;
  legalStage: DisputeLegalStage;
  threatLevel: DisputeThreatLevel;
  isZuzpThreatened: boolean;
  mediatorAssigned?: string;
  nextDeadlineDate: string;
  nextDeadlineDescription: string;
  ministerialNegotiationLine: string;
  mapPoliticalRisk: string;
  financialBaseline: LaborDisputeFinancialBaseline;
}

export interface SocialDialogueCalendarRecord {
  id: string;
  eventDate: string;
  entityTicker: string;
  entityName: string;
  voivodeship: string;
  eventType: "ROKOWANIA" | "MEDIACJA" | "POSIEDZENIE_WRDS" | "REFERENDUM" | "TERMIN_ZAWIESZENIA_ZUZP";
  title: string;
  description: string;
  threatLevel: DisputeThreatLevel;
  actionRequiredByMap?: string;
}

export interface WageCompromiseSimulationInput {
  disputeId: string;
  proposedWageIncreasePct: number;
  proposedOneOffBonusPln: number;
}

export interface WageCompromiseSimulationResult {
  disputeId: string;
  entityName: string;
  baselineEbitdaMlnPln: number;
  baselineNetDebtToEbitda: number;
  simulatedAnnualCostMlnPln: number;
  simulatedEbitdaMlnPln: number;
  simulatedNetDebtToEbitda: number;
  covenantBreached: boolean;
  covenantMaxAllowed: number;
  savingsVsDemandsMlnPln: number;
  socialPeaceHorizonMonths: number;
  recommendationNote: string;
}

export interface SocialDialogueSummaryRecord {
  totalActiveDisputes: number;
  criticalDisputesCount: number;
  totalWorkersAffected: number;
  totalWageDemandsCostMlnPln: number;
  disputesByVoivodeship: Record<string, number>;
  zuzpThreatenedCount: number;
  calendarEventsNext30Days: number;
}

export type MapLeadershipRole =
  | "MINISTER"
  | "SEKRETARZ_STANU"
  | "PODSEKRETARZ_STANU"
  | "DYREKTOR_GENERALNY"
  | "RZECZNIK_PRASOWY";

export type PressInquiryUrgency =
  | "PILNE_DO_2H"
  | "DZISIAJ"
  | "USTAWOWE_14DNI"
  | "ZREALIZOWANE";

export type MapCrisisSeverity =
  | "KRYTYCZNE"
  | "WYSOKIE"
  | "SREDNIE"
  | "MONITOROWANE";

export interface MapLeadershipMemberRecord {
  id: string;
  name: string;
  role: MapLeadershipRole;
  title: string;
  supervisedDepartments: string[];
  assignedSectors: string[];
  activeCrisesCount: number;
  mediaSentimentScore: number;
  currentKeyTopics: string[];
  lastMediaAppearance?: {
    date: string;
    mediaOutlet: string;
    topic: string;
    tone: "pozytywny" | "neutralny" | "trudny";
  };
}

export interface MapPressReleaseRecord {
  id: string;
  title: string;
  category: "KOMUNIKAT_PRASOWY" | "SPROSTOWANIE" | "OŚWIADCZENIE" | "BRIEFING";
  publishedAt: string;
  channel: "gov.pl/aktywa-panstwowe" | "BIP MAP" | "X / @MAPSkarbPanstwa" | "PAP";
  summary: string;
  keyQuotes: string[];
  isRectification: boolean;
  targetMediaOutlet?: string;
  reachEstimate: number;
  defenseStrengthScore: number;
}

export interface MapPressInquiryRecord {
  id: string;
  mediaOutlet: string;
  journalistName: string;
  receivedAt: string;
  deadlineAt: string;
  urgency: PressInquiryUrgency;
  subject: string;
  detailedQuestions: string[];
  politicalRiskScore: number;
  assignedSpokespersonLine: string;
  factsAndFigures: string;
  redLines: string;
  status: "NOWE" | "W_OPRACOWANIU" | "ZAAKCEPTOWANE_PRZEZ_GABINET" | "WYSLANE";
}

export interface MapDirectCrisisRecord {
  id: string;
  title: string;
  severity: MapCrisisSeverity;
  category: "KADRY_OBSADA" | "PROTESTY_SPOŁECZNE" | "KONTROLA_SEJMOWA" | "SPÓR_MIĘDZYRESORTOWY" | "AUDYT_I_PROKURATURA";
  incidentDate: string;
  affectedLeadership: string[];
  summary: string;
  oppositionAttackVector: string;
  ministerialCounterNarrative: string;
  streetProtestThreat: boolean;
  protestDetails?: {
    location: string;
    registeredParticipants: number;
    organizer: string;
    policeCoordination: boolean;
  };
  parliamentaryControlActive: boolean;
  actionItemsForCabinet: string[];
}

export interface MapZoneSummaryRecord {
  overallMapTensionIndex: number;
  activePressInquiriesCount: number;
  criticalDirectCrisesCount: number;
  pendingParliamentaryInquiriesCount: number;
  registeredStreetProtestsCount: number;
  pressReleasesThisMonthCount: number;
  averageSpokespersonResponseTimeHours: number;
}

export interface NightlySyncEvent {
  id: string;
  timestamp: string;
  eventType:
    | "member_appointed"
    | "member_dismissed"
    | "liquidation_opened"
    | "crbr_beneficiary_updated"
    | "verified_unchanged";
  entityId: string;
  entityName: string;
  personName: string;
  role: string;
  source: string;
  details?: Record<string, unknown>;
}

export interface NightlyKrsSyncReport {
  runId: string;
  startedAt: string;
  finishedAt: string;
  durationSeconds: number;
  entitiesScannedCount: number;
  entitiesUpdatedCount: number;
  errorsCount: number;
  eventsCount: number;
  events: NightlySyncEvent[];
  krsApiConnected: boolean;
  crbrApiConnected: boolean;
  nextScheduledRun: string;
}

export interface NightlySyncStatus {
  lastSyncAt: string;
  scheduleCron: string;
  scheduleHuman: string;
  totalMonitoredEntities: number;
  syncedEntitiesCount: number;
  pendingSyncCount: number;
  krsApiUrl: string;
  crbrApiUrl: string;
  apiHealth: "operational" | "degraded" | "maintenance";
  lastRunReport: NightlyKrsSyncReport;
}








