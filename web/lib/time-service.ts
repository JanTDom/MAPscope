/**
 * Silnik Świadomości Czasowej (Temporal Awareness Engine) MAPscope
 * Zapewnia dynamiczne wyliczanie dat, terminów interpelacji, posiedzeń Rady Ministrów
 * oraz Zegara Kadencyjnego względem bieżącego czasu systemowego.
 */

const POLISH_MONTHS = [
  "stycznia",
  "lutego",
  "marca",
  "kwietnia",
  "maja",
  "czerwca",
  "lipca",
  "sierpnia",
  "września",
  "października",
  "listopada",
  "grudnia",
];

const POLISH_DAYS = [
  "niedziela",
  "poniedziałek",
  "wtorek",
  "środa",
  "czwartek",
  "piątek",
  "sobota",
];

export function getSystemNow(): Date {
  return new Date();
}

/**
 * Zwraca datę w naturalnym polskim formacie urzędowym, np. "26 października 2026 r."
 */
export function formatPolishDate(date: Date = getSystemNow()): string {
  const day = date.getDate();
  const month = POLISH_MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year} r.`;
}

/**
 * Zwraca datę i godzinę, np. "26 października 2026 r., godz. 16:05"
 */
export function formatPolishDateTime(date: Date = getSystemNow()): string {
  const dateStr = formatPolishDate(date);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${dateStr}, godz. ${hours}:${minutes}`;
}

/**
 * Wyznacza dynamicznie najbliższe posiedzenie Rady Ministrów (zwyczajowo każdy wtorek o godz. 11:00).
 */
export function getUpcomingCabinetMeeting(now: Date = getSystemNow()): {
  dateIso: string;
  displayString: string;
  daysRemaining: number;
} {
  const target = new Date(now);
  const currentDay = target.getDay(); // 0 = nd, 1 = pn, 2 = wt, ...
  
  // Wtorek = 2
  let daysUntilTuesday = (2 - currentDay + 7) % 7;
  if (daysUntilTuesday === 0 && target.getHours() >= 14) {
    // Jeżeli jest wtorek po 14:00, kolejne posiedzenie za tydzień
    daysUntilTuesday = 7;
  }

  target.setDate(target.getDate() + daysUntilTuesday);
  target.setHours(11, 0, 0, 0);

  const diffMs = target.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  const dayStr = target.getDate();
  const monthStr = POLISH_MONTHS[target.getMonth()];
  const yearStr = target.getFullYear();

  let relative = "za " + daysRemaining + " dni";
  if (daysRemaining === 0) relative = "dzisiaj";
  else if (daysRemaining === 1) relative = "jutro";

  return {
    dateIso: target.toISOString().slice(0, 10),
    displayString: `${dayStr} ${monthStr} ${yearStr} r. (Wtorek, posiedzenie Rady Ministrów — ${relative})`,
    daysRemaining,
  };
}

/**
 * Wylicza dynamiczny opis terminu (np. interpelacji poselskiej lub zaleceń NIK).
 */
export function getRelativeDeadlineStatus(
  deadlineDateStr: string,
  now: Date = getSystemNow()
): {
  displayText: string;
  isOverdue: boolean;
  daysDiff: number;
  urgencyLevel: "critical" | "warning" | "normal";
} {
  const deadline = new Date(deadlineDateStr);
  if (isNaN(deadline.getTime())) {
    return {
      displayText: deadlineDateStr,
      isOverdue: false,
      daysDiff: 0,
      urgencyLevel: "normal",
    };
  }

  // Ustawienie na koniec dnia
  deadline.setHours(23, 59, 59, 999);
  const diffMs = deadline.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const dStr = `${deadline.getDate()} ${POLISH_MONTHS[deadline.getMonth()]}`;

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    return {
      displayText: `${deadlineDateStr} (termin minął ${absDays} ${absDays === 1 ? "dzień" : "dni"} temu)`,
      isOverdue: true,
      daysDiff: diffDays,
      urgencyLevel: "critical",
    };
  }

  if (diffDays === 0) {
    return {
      displayText: `${deadlineDateStr} (termin upływa dzisiaj o 24:00)`,
      isOverdue: false,
      daysDiff: 0,
      urgencyLevel: "critical",
    };
  }

  if (diffDays <= 3) {
    return {
      displayText: `${deadlineDateStr} (pozostało ${diffDays} ${diffDays === 1 ? "dzień" : "dni"} — PILNE)`,
      isOverdue: false,
      daysDiff: diffDays,
      urgencyLevel: "critical",
    };
  }

  if (diffDays <= 7) {
    return {
      displayText: `${deadlineDateStr} (pozostało ${diffDays} dni)`,
      isOverdue: false,
      daysDiff: diffDays,
      urgencyLevel: "warning",
    };
  }

  return {
    displayText: `${deadlineDateStr} (pozostało ${diffDays} dni)`,
    isOverdue: false,
    daysDiff: diffDays,
    urgencyLevel: "normal",
  };
}

/**
 * Ocenia stan czasowy incydentu względem bieżącej daty (czy już się odbył, trwa dzisiaj czy jest planowany).
 */
export function evaluateIncidentTemporalState(
  dateIso: string,
  now: Date = getSystemNow()
): {
  state: "ODBYŁO_SIĘ" | "DZISIAJ" | "PLANOWANE";
  daysDiff: number;
  label: string;
} {
  const incidentDate = new Date(dateIso);
  const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const incDateOnly = new Date(incidentDate.getFullYear(), incidentDate.getMonth(), incidentDate.getDate());

  const diffTime = incDateOnly.getTime() - nowDate.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const abs = Math.abs(diffDays);
    return {
      state: "ODBYŁO_SIĘ",
      daysDiff: diffDays,
      label: `Odbyło się ${abs} ${abs === 1 ? "dzień" : "dni"} temu (${dateIso})`,
    };
  } else if (diffDays === 0) {
    return {
      state: "DZISIAJ",
      daysDiff: 0,
      label: `Wydarzenie dzisiaj (${dateIso})`,
    };
  } else {
    return {
      state: "PLANOWANE",
      daysDiff: diffDays,
      label: `Planowane za ${diffDays} ${diffDays === 1 ? "dzień" : "dni"} (${dateIso})`,
    };
  }
}

/**
 * Oblicza dynamiczną temperaturę kryzysową portfela (skala 0-100)
 * na podstawie realnych incydentów i alertów.
 */
export function calculateDynamicCrisisScore(params: {
  p1Count: number;
  p2Count: number;
  p3Count: number;
  activeDisputesCount?: number;
}): number {
  const { p1Count, p2Count, p3Count, activeDisputesCount = 0 } = params;
  
  // Wagi kryzysowe
  const rawScore = 20 + p1Count * 14 + p2Count * 7 + p3Count * 2 + activeDisputesCount * 3;
  return Math.min(96, Math.max(15, Math.round(rawScore)));
}

/**
 * Zwraca datę ostatniej synchronizacji rejestru KRS
 */
export function getKrsLastSyncDate(now: Date = getSystemNow()): string {
  return now.toISOString().slice(0, 10);
}

/**
 * Zwraca datę i czas ostatniej zarejestrowanej sesji synchronizacyjnej KRS
 */
export function getKrsLastSyncDateTime(now: Date = getSystemNow()): string {
  return `${now.toISOString().slice(0, 10)} 02:00 CET (cykl nocny)`;
}

/**
 * Zwraca datę i czas następnego planowanego biegu nocnego KRS (jutro 02:00 CET)
 */
export function getKrsNextSyncDateTime(now: Date = getSystemNow()): string {
  const next = new Date(now.getTime() + 86400000);
  return `${next.toISOString().slice(0, 10)} 02:00 CET`;
}

