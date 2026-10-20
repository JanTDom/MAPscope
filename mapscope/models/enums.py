"""Typy wyliczeniowe dla systemu MAPscope."""

from enum import Enum


class EntityStatus(str, Enum):
    ACTIVE = "active"
    RESTRUCTURING = "restructuring"
    LIQUIDATION = "liquidation"
    BANKRUPTCY = "bankruptcy"
    SUSPENDED = "suspended"
    DISSOLVED = "dissolved"


class OwnershipType(str, Enum):
    DIRECT = "direct"
    INDIRECT = "indirect"
    MINORITY = "minority"
    MAJORITY = "majority"
    WHOLLY_OWNED = "wholly_owned"


class StrategicImportance(str, Enum):
    STRATEGIC = "strategic"
    KEY = "key"
    REGIONAL = "regional"
    STANDARD = "standard"
    SPECIAL_PURPOSE = "special_purpose"


class PersonRole(str, Enum):
    PRESIDENT = "president"
    VICE_PRESIDENT = "vice_president"
    BOARD_MEMBER = "board_member"
    SUPERVISORY_BOARD_PRESIDENT = "supervisory_board_president"
    SUPERVISORY_BOARD_MEMBER = "supervisory_board_member"
    LIQUIDATOR = "liquidator"
    TRUSTEE = "trustee"
    PRESS_SPOKESPERSON = "press_spokesperson"


class DisclosureType(str, Enum):
    PRESS_RELEASE = "press_release"
    OFFICIAL_STATEMENT = "official_statement"
    SOCIAL_MEDIA_POST = "social_media_post"
    INTERVIEW = "interview"
    ESPI_CURRENT = "espi_current"
    ESPI_PERIODIC = "espi_periodic"
    EBI_CURRENT = "ebi_current"
    EBI_PERIODIC = "ebi_periodic"
    REBUTTAL = "rebuttal"
    INTERNAL_ANNOUNCEMENT = "internal_announcement"


class DisclosureChannel(str, Enum):
    WEBSITE = "website"
    X_TWITTER = "x_twitter"
    LINKEDIN = "linkedin"
    FACEBOOK = "facebook"
    PRESS_OFFICE = "press_office"
    ESPI_SYSTEM = "espi_system"
    EBI_SYSTEM = "ebi_system"
    MEDIA_INTERVIEW = "media_interview"


class RiskSeverity(str, Enum):
    P1_CRITICAL = "p1_critical"
    P2_HIGH = "p2_high"
    P3_MODERATE = "p3_moderate"
    LOW = "low"
    NEUTRAL = "neutral"


class AlertPriority(str, Enum):
    P1 = "p1"
    P2 = "p2"
    P3 = "p3"


class AlertStatus(str, Enum):
    PENDING = "pending"
    DISPATCHED = "dispatched"
    ACKNOWLEDGED = "acknowledged"
    RESOLVED = "resolved"


class ClusterStatus(str, Enum):
    ACTIVE = "active"
    ESCALATING = "escalating"
    STABILIZING = "stabilizing"
    CLOSED = "closed"
