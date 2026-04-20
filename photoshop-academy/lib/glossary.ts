import glossaryData from "@/content/glossary.json";

export type GlossaryCategory =
  | "basic"
  | "layer"
  | "tool"
  | "color"
  | "effect"
  | "advanced";

export interface GlossaryItem {
  term: string;
  english: string;
  category: GlossaryCategory;
  easyDefinition: string;
  formalDefinition: string;
  analogy?: string;
  relatedLessons: string[];
}

const GLOSSARY = glossaryData as GlossaryItem[];

export const CATEGORY_LABELS: Record<GlossaryCategory, string> = {
  basic: "기본 개념",
  layer: "레이어",
  tool: "도구",
  color: "색",
  effect: "조정·효과",
  advanced: "고급",
};

export function getGlossary(): GlossaryItem[] {
  return [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, "ko"));
}
