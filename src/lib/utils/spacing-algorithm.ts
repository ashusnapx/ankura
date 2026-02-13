// ═══════════════════════════════════════════
// SPACED REPETITION ALGORITHM
// Based on Cepeda et al. (2006) research
// ═══════════════════════════════════════════

const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 60]; // days

export interface ReviewResult {
  nextReviewDate: string;
  newLevel: number;
}

export function calculateNextReview(
  currentLevel: number,
  recalled: boolean,
): ReviewResult {
  let newLevel: number;

  if (recalled) {
    newLevel = Math.min(currentLevel + 1, REVIEW_INTERVALS.length - 1);
  } else {
    newLevel = Math.max(0, currentLevel - 1);
  }

  const intervalDays = REVIEW_INTERVALS[newLevel];
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);
  const nextReviewDate = nextDate.toISOString().split("T")[0];

  return { nextReviewDate, newLevel };
}

export function isWordDueForReview(
  lastReviewDate: string | null,
  reviewLevel: number,
): boolean {
  if (!lastReviewDate) return true;

  const lastReview = new Date(lastReviewDate);
  const now = new Date();
  const daysSinceReview = Math.floor(
    (now.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24),
  );

  const requiredInterval =
    REVIEW_INTERVALS[Math.min(reviewLevel, REVIEW_INTERVALS.length - 1)];
  return daysSinceReview >= requiredInterval;
}

export function getWordHealth(
  lastReviewDate: string | null,
  reviewLevel: number,
): "thriving" | "healthy" | "wilting" | "dead" {
  if (!lastReviewDate) return "wilting";

  const lastReview = new Date(lastReviewDate);
  const now = new Date();
  const daysSinceReview = Math.floor(
    (now.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24),
  );

  const requiredInterval =
    REVIEW_INTERVALS[Math.min(reviewLevel, REVIEW_INTERVALS.length - 1)];
  const ratio = daysSinceReview / requiredInterval;

  if (ratio < 0.5) return "thriving";
  if (ratio < 1.0) return "healthy";
  if (ratio < 2.0) return "wilting";
  return "dead";
}

export function getPlantGrowthStage(
  reviewLevel: number,
): "seed" | "sprout" | "bud" | "bloom" | "tree" {
  if (reviewLevel === 0) return "seed";
  if (reviewLevel === 1) return "sprout";
  if (reviewLevel <= 3) return "bud";
  if (reviewLevel <= 4) return "bloom";
  return "tree";
}

export type PlantStage = "seed" | "sprout" | "bud" | "bloom" | "tree";
export type WordHealthStatus = "thriving" | "healthy" | "wilting" | "dead";

export function getWordHealthPercent(
  lastReviewDate: string | null,
  reviewLevel: number,
): number {
  if (!lastReviewDate) return 30;
  const lastReview = new Date(lastReviewDate);
  const now = new Date();
  const daysSinceReview = Math.floor(
    (now.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24),
  );
  const requiredInterval =
    REVIEW_INTERVALS[Math.min(reviewLevel, REVIEW_INTERVALS.length - 1)];
  const ratio = daysSinceReview / requiredInterval;
  if (ratio < 0.3) return 100;
  if (ratio < 0.5) return 85;
  if (ratio < 1.0) return 65;
  if (ratio < 2.0) return 40;
  return 15;
}

export { REVIEW_INTERVALS };
