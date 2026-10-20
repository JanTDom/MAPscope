-- MAPscope: Baza Danych i Model Relacyjno-Wektorowy
-- Wersja: 20261020000000_mapscope_initial_schema.sql
-- Zgodność: Standard Fable 5.1, ADR-001, ADR-002, ADR-003

-- 1. Rozszerzenia
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Typy wyliczeniowe (ENUM)
DO $$ BEGIN
    CREATE TYPE entity_status AS ENUM (
        'active',           -- Spółka aktywna operacyjnie
        'restructuring',    -- W trakcie postępowania restrukturyzacyjnego
        'liquidation',      -- W likwidacji
        'bankruptcy',       -- W upadłości
        'suspended',        -- Zawieszona działalność
        'dissolved'         -- Wykreślona z rejestru
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE entity_ownership_type AS ENUM (
        'direct',           -- Bezpośredni udział Skarbu Państwa
        'indirect',         -- Pośredni udział (poprzez inną spółkę zależną)
        'minority',         -- Udział mniejszościowy (< 50%)
        'majority',         -- Udział większościowy (> 50% i < 100%)
        'wholly_owned'      -- 100% udział Skarbu Państwa
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE strategic_importance AS ENUM (
        'strategic',        -- Spółka o strategicznym znaczeniu dla gospodarki (Dz.U. wykaz)
        'key',              -- Kluczowa spółka portfelowa
        'regional',         -- Spółka o znaczeniu regionalnym/lokalnym
        'standard',         -- Pozostałe podmioty
        'special_purpose'   -- Spółka celowa / restrukturyzowana
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE person_role AS ENUM (
        'president',                    -- Prezes Zarządu
        'vice_president',               -- Wiceprezes Zarządu
        'board_member',                 -- Członek Zarządu
        'supervisory_board_president',  -- Przewodniczący Rady Nadzorczej
        'supervisory_board_member',     -- Członek Rady Nadzorczej
        'liquidator',                   -- Likwidator
        'trustee',                      -- Syndyk / Zarządca przymusowy
        'press_spokesperson'            -- Rzecznik prasowy / Dyrektor komunikacji
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE disclosure_type AS ENUM (
        'press_release',        -- Komunikat prasowy
        'official_statement',   -- Oficjalne oświadczenie zarządu / spółki
        'social_media_post',    -- Wpis w mediach społecznościowych (X/LinkedIn)
        'interview',            -- Autoryzowany wywiad członka zarządu
        'espi_current',         -- Raport bieżący ESPI
        'espi_periodic',        -- Raport okresowy ESPI (kwartalny/roczny)
        'ebi_current',          -- Raport bieżący EBI (NewConnect)
        'ebi_periodic',         -- Raport okresowy EBI
        'rebuttal',             -- Sprostowanie prasowe
        'internal_announcement' -- Komunikat do załogi / związków zawodowych
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE disclosure_channel AS ENUM (
        'website',          -- Serwis www / biuro prasowe
        'x_twitter',        -- Oficjalne konto X
        'linkedin',         -- Oficjalne konto LinkedIn
        'facebook',         -- Oficjalne konto Facebook
        'press_office',     -- Dystrybucja agencyjna / mailing prasowy
        'espi_system',      -- System ESPI (KNF / GPW)
        'ebi_system',       -- System EBI (GPW)
        'media_interview'   -- Wypowiedź w mediach zewnętrznych
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE risk_severity AS ENUM (
        'p1_critical',      -- Kryzys bezpośrednio uderzający w MAP / skandal / wstrzymanie operacji
        'p2_high',          -- Poważne rozbieżności, spory pracownicze, kontrole CBA/NIK
        'p3_moderate',      -- Lokalny kryzys wizerunkowy, drobna niespójność komunikacyjna
        'low',              -- Standardowe ryzyko rynkowe bez wpływu na MAP
        'neutral'           -- Komunikat neutralny / brak zagrożeń
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE alert_priority AS ENUM (
        'p1',
        'p2',
        'p3'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE alert_status AS ENUM (
        'pending',
        'dispatched',
        'acknowledged',
        'resolved'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE cluster_status AS ENUM (
        'active',
        'escalating',
        'stabilizing',
        'closed'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Tabela migawek rejestru (Wersjonowanie Wykazu MAP)
CREATE TABLE IF NOT EXISTS entity_registry_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    snapshot_date DATE NOT NULL,
    source_url TEXT NOT NULL,
    source_filename TEXT NOT NULL,
    file_sha256 TEXT NOT NULL,
    total_entities_count INTEGER NOT NULL CHECK (total_entities_count >= 0),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Tabela podmiotów (Wszystkie Spółki Skarbu Państwa — Zero wykluczeń)
CREATE TABLE IF NOT EXISTS entities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    formal_name TEXT,
    nip VARCHAR(10),
    krs VARCHAR(10),
    regon VARCHAR(14),
    state_share_percent NUMERIC(5,2) NOT NULL CHECK (state_share_percent >= 0 AND state_share_percent <= 100),
    ownership_type entity_ownership_type NOT NULL DEFAULT 'direct',
    ownership_body TEXT NOT NULL,
    status entity_status NOT NULL DEFAULT 'active',
    sector TEXT NOT NULL,
    map_department TEXT,
    strategic_importance strategic_importance NOT NULL DEFAULT 'standard',
    stock_ticker VARCHAR(10),
    is_public_listed BOOLEAN NOT NULL DEFAULT false,
    website_url TEXT,
    press_office_url TEXT,
    ir_url TEXT,
    social_handles JSONB NOT NULL DEFAULT '{}'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    last_snapshot_id UUID REFERENCES entity_registry_snapshots(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Tabela decydentów i reprezentacji (Ludzie w SSP)
CREATE TABLE IF NOT EXISTS people (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role person_role NOT NULL,
    role_description TEXT,
    appointed_at DATE,
    dismissed_at DATE,
    is_current BOOLEAN NOT NULL DEFAULT true,
    social_handles JSONB NOT NULL DEFAULT '{}'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. Tabela własnej komunikacji spółek (Communication Risk Engine)
CREATE TABLE IF NOT EXISTS company_disclosures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    disclosure_type disclosure_type NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    raw_content TEXT,
    source_url TEXT,
    channel disclosure_channel NOT NULL,
    speaker_person_id UUID REFERENCES people(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ NOT NULL,
    content_hash VARCHAR(64) NOT NULL UNIQUE,
    embedding vector(1536),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Tabela artykułów medialnych z sieci
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_name TEXT NOT NULL,
    source_domain TEXT NOT NULL,
    source_type TEXT NOT NULL DEFAULT 'general',
    url TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    lead TEXT,
    body TEXT NOT NULL,
    author TEXT,
    published_at TIMESTAMPTZ NOT NULL,
    content_hash VARCHAR(64) NOT NULL,
    minhash_signature TEXT,
    is_reprint BOOLEAN NOT NULL DEFAULT false,
    original_article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
    embedding vector(1536),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Tabela powiązań artykułów ze spółkami
CREATE TABLE IF NOT EXISTS article_entity_mentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    mention_count INTEGER NOT NULL DEFAULT 1 CHECK (mention_count > 0),
    is_primary_subject BOOLEAN NOT NULL DEFAULT false,
    sentiment_score NUMERIC(3,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(article_id, entity_id)
);

-- 9. Klastry wydarzeń i wątków kryzysowych
CREATE TABLE IF NOT EXISTS story_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    primary_entity_id UUID REFERENCES entities(id) ON DELETE SET NULL,
    status cluster_status NOT NULL DEFAULT 'active',
    severity_level risk_severity NOT NULL DEFAULT 'low',
    first_seen_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    article_count INTEGER NOT NULL DEFAULT 0 CHECK (article_count >= 0),
    disclosure_count INTEGER NOT NULL DEFAULT 0 CHECK (disclosure_count >= 0),
    embedding vector(1536),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. Pozycje w klastrach (Artykuły i Oświadczenia)
CREATE TABLE IF NOT EXISTS cluster_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cluster_id UUID NOT NULL REFERENCES story_clusters(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN ('article', 'disclosure')),
    item_id UUID NOT NULL,
    similarity_score NUMERIC(5,4),
    added_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(cluster_id, item_type, item_id)
);

-- 11. Oceny ryzyka (Communication & Governance Risk Engine)
CREATE TABLE IF NOT EXISTS risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_type TEXT NOT NULL CHECK (target_type IN ('disclosure', 'article', 'cluster', 'entity')),
    target_id UUID NOT NULL,
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    severity risk_severity NOT NULL,
    overall_risk_score NUMERIC(3,1) NOT NULL CHECK (overall_risk_score >= 0.0 AND overall_risk_score <= 10.0),
    communication_risks JSONB NOT NULL DEFAULT '{}'::jsonb,
    governance_risks JSONB NOT NULL DEFAULT '{}'::jsonb,
    executive_summary TEXT NOT NULL,
    map_impact_analysis TEXT NOT NULL,
    recommended_action TEXT,
    model_version TEXT NOT NULL DEFAULT 'gemini-2.5-pro',
    raw_model_response JSONB,
    assessed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. Alerty kryzysowe P1/P2/P3
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    risk_assessment_id UUID REFERENCES risk_assessments(id) ON DELETE SET NULL,
    priority alert_priority NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    status alert_status NOT NULL DEFAULT 'pending',
    dispatched_channels TEXT[] NOT NULL DEFAULT '{}',
    dispatched_at TIMESTAMPTZ,
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. Dziennik audytowy zmian właścicielskich i alertów
CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    actor TEXT NOT NULL DEFAULT 'system',
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. Indeksy wydajnościowe (Klucze obce, B-Tree, GIN pg_trgm, Vector HNSW)

-- Klucze obce (eliminacja N+1)
CREATE INDEX IF NOT EXISTS idx_entities_snapshot_id ON entities(last_snapshot_id);
CREATE INDEX IF NOT EXISTS idx_people_entity_id ON people(entity_id);
CREATE INDEX IF NOT EXISTS idx_people_is_current ON people(is_current);
CREATE INDEX IF NOT EXISTS idx_disclosures_entity_id ON company_disclosures(entity_id);
CREATE INDEX IF NOT EXISTS idx_disclosures_speaker_id ON company_disclosures(speaker_person_id);
CREATE INDEX IF NOT EXISTS idx_disclosures_published_at ON company_disclosures(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_article_mentions_article ON article_entity_mentions(article_id);
CREATE INDEX IF NOT EXISTS idx_article_mentions_entity ON article_entity_mentions(entity_id);
CREATE INDEX IF NOT EXISTS idx_clusters_primary_entity ON story_clusters(primary_entity_id);
CREATE INDEX IF NOT EXISTS idx_cluster_items_cluster ON cluster_items(cluster_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_entity ON risk_assessments(entity_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessments_target ON risk_assessments(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_alerts_entity ON alerts(entity_id);
CREATE INDEX IF NOT EXISTS idx_alerts_priority_status ON alerts(priority, status);
CREATE INDEX IF NOT EXISTS idx_audit_events_entity ON audit_events(entity_id);

-- Wyszukiwanie identyfikatorów państwowych
CREATE INDEX IF NOT EXISTS idx_entities_nip ON entities(nip) WHERE nip IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_entities_krs ON entities(krs) WHERE krs IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_entities_regon ON entities(regon) WHERE regon IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_entities_sector ON entities(sector);
CREATE INDEX IF NOT EXISTS idx_entities_status ON entities(status);
CREATE INDEX IF NOT EXISTS idx_entities_state_share ON entities(state_share_percent DESC);

-- Indeksy GIN pg_trgm dla natychmiastowego wyszukiwania tekstowego
CREATE INDEX IF NOT EXISTS idx_entities_name_trgm ON entities USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_people_fullname_trgm ON people USING gin (full_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_articles_title_trgm ON articles USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_disclosures_title_trgm ON company_disclosures USING gin (title gin_trgm_ops);

-- Indeksy wektorowe HNSW (pgvector)
CREATE INDEX IF NOT EXISTS idx_disclosures_embedding ON company_disclosures USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_articles_embedding ON articles USING hnsw (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_clusters_embedding ON story_clusters USING hnsw (embedding vector_cosine_ops);

-- 15. Funkcja aktualizująca znacznik czasu updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_entities_updated_at ON entities;
CREATE TRIGGER trg_entities_updated_at
BEFORE UPDATE ON entities
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_people_updated_at ON people;
CREATE TRIGGER trg_people_updated_at
BEFORE UPDATE ON people
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_story_clusters_updated_at ON story_clusters;
CREATE TRIGGER trg_story_clusters_updated_at
BEFORE UPDATE ON story_clusters
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 16. Bezpieczeństwo i Polityki RLS (Row Level Security)
ALTER TABLE entity_registry_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_disclosures ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_entity_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE cluster_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- Polityki dla roli service_role (pełny dostęp administracyjny)
CREATE POLICY "service_role_manage_snapshots" ON entity_registry_snapshots FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_manage_entities" ON entities FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_manage_people" ON people FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_manage_disclosures" ON company_disclosures FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_manage_articles" ON articles FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_manage_mentions" ON article_entity_mentions FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_manage_clusters" ON story_clusters FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_manage_cluster_items" ON cluster_items FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_manage_assessments" ON risk_assessments FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_manage_alerts" ON alerts FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_manage_audit_events" ON audit_events FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Bezpieczny odczyt dla uwierzytelnionych użytkowników panelu MAPscope
CREATE POLICY "authenticated_read_snapshots" ON entity_registry_snapshots FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_entities" ON entities FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_people" ON people FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_disclosures" ON company_disclosures FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_articles" ON articles FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_mentions" ON article_entity_mentions FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_clusters" ON story_clusters FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_cluster_items" ON cluster_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_assessments" ON risk_assessments FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_alerts" ON alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "authenticated_read_audit_events" ON audit_events FOR SELECT TO authenticated USING (true);
