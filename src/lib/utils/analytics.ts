// ═══════════════════════════════════════════
// PRIVACY-FIRST LOCAL ANALYTICS
// All data stays in IndexedDB, never sent
// ═══════════════════════════════════════════

import { db } from "@/lib/db/dexie";

export type AnalyticsEventType =
  | "page_view"
  | "mission_start"
  | "mission_complete"
  | "mission_abandon"
  | "scene_advance"
  | "speech_attempt"
  | "word_review"
  | "word_correct"
  | "word_incorrect"
  | "garden_visit"
  | "shadow_speaking_start"
  | "writing_practice_start"
  | "listening_start"
  | "bridge_mode_start"
  | "session_start"
  | "session_end"
  | "streak_maintained"
  | "streak_broken"
  | "onboarding_start"
  | "onboarding_complete"
  | "share_action"
  | "feedback_submitted"
  | "data_export"
  | "data_import";

export async function trackEvent(
  event: AnalyticsEventType,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  try {
    await db.analytics.add({
      event,
      timestamp: new Date().toISOString(),
      metadata: {
        ...metadata,
        userAgent:
          typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      },
    });
  } catch {
    // Silently fail — analytics should never crash the app
    console.warn("Analytics event failed to record:", event);
  }
}

export async function getSessionStats(): Promise<{
  totalSessions: number;
  totalMinutes: number;
  missionsCompleted: number;
  wordsReviewed: number;
}> {
  const sessions = await db.analytics
    .where("event")
    .equals("session_end")
    .toArray();
  const missionCompletes = await db.analytics
    .where("event")
    .equals("mission_complete")
    .count();
  const wordReviews = await db.analytics
    .where("event")
    .equals("word_review")
    .count();

  let totalMinutes = 0;
  for (const session of sessions) {
    const duration = session.metadata.durationSeconds as number;
    if (duration) totalMinutes += duration / 60;
  }

  return {
    totalSessions: sessions.length,
    totalMinutes: Math.round(totalMinutes),
    missionsCompleted: missionCompletes,
    wordsReviewed: wordReviews,
  };
}
