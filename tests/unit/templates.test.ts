import { describe, it, expect } from "vitest";
import { INITIAL_TEMPLATES } from "../../src/server/game/seed-data";

describe("Quest Template Library", () => {
  it("contains at least 50 comprehensive, curated templates", () => {
    expect(INITIAL_TEMPLATES.length).toBeGreaterThanOrEqual(50);
  });

  it("covers all 5 core attributes with balanced distribution", () => {
    const counts: Record<string, number> = {};
    for (const t of INITIAL_TEMPLATES) {
      counts[t.attribute] = (counts[t.attribute] || 0) + 1;
    }

    expect(counts["STRENGTH"]).toBeGreaterThanOrEqual(10);
    expect(counts["INTELLECT"]).toBeGreaterThanOrEqual(10);
    expect(counts["DISCIPLINE"]).toBeGreaterThanOrEqual(10);
    expect(counts["VITALITY"]).toBeGreaterThanOrEqual(10);
    expect(counts["CHARISMA"]).toBeGreaterThanOrEqual(10);
  });

  it("has valid unique slugs, difficulties, and cadences", () => {
    const validDifficulties = new Set(["TRIVIAL", "EASY", "MEDIUM", "HARD", "EPIC"]);
    const validCadences = new Set(["ONCE", "DAILY", "WEEKLY"]);
    const slugs = new Set<string>();

    for (const t of INITIAL_TEMPLATES) {
      expect(slugs.has(t.slug)).toBe(false);
      slugs.add(t.slug);
      expect(validDifficulties.has(t.difficulty)).toBe(true);
      expect(validCadences.has(t.cadence)).toBe(true);
      expect(t.title.length).toBeGreaterThan(0);
      expect(t.description.length).toBeGreaterThan(0);
    }
  });
});
