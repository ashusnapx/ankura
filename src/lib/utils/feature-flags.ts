// ═══════════════════════════════════════════
// FEATURE FLAGS
// Infrastructure for future premium gating
// ═══════════════════════════════════════════

export interface FeatureFlags {
  premiumMissions: boolean;
  advancedAnalytics: boolean;
  customGardenThemes: boolean;
  unlimitedFreezeTokens: boolean;
  communityFeatures: boolean;
  aiPronunciationCoach: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  premiumMissions: false,
  advancedAnalytics: false,
  customGardenThemes: false,
  unlimitedFreezeTokens: false,
  communityFeatures: false,
  aiPronunciationCoach: false,
};

let flags: FeatureFlags = { ...DEFAULT_FLAGS };

export function getFlag(key: keyof FeatureFlags): boolean {
  return flags[key];
}

export function setFlag(key: keyof FeatureFlags, value: boolean): void {
  flags = { ...flags, [key]: value };
}

export function getAllFlags(): FeatureFlags {
  return { ...flags };
}

export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return getFlag(feature);
}
