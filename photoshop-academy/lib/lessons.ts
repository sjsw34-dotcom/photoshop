import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  getCurriculumBySlug,
  getCurriculumLessons,
  type LessonMeta,
} from "@/lib/curriculum";
import type { LevelId } from "@/lib/constants";

export interface LessonFrontmatter {
  title: string;
  level: LevelId;
  order: number;
  duration: number;
  slug: string;
  prerequisites?: string[];
  objectives?: string[];
  keyTerms?: string[];
  practiceFile?: string | null;
  hasPractice?: boolean;
}

export interface LessonRecord extends LessonMeta {
  hasContent: boolean;
  filePath: string | null;
  frontmatter: LessonFrontmatter | null;
  prerequisites: string[];
  objectives: string[];
  keyTerms: string[];
  practiceFile: string | null;
  hasPractice: boolean;
}

const CONTENT_ROOT = path.join(process.cwd(), "content", "lessons");

let _cache: Map<string, LessonRecord> | null = null;

function scanMdxFiles(): Map<string, { filePath: string; data: LessonFrontmatter }> {
  const map = new Map<string, { filePath: string; data: LessonFrontmatter }>();
  if (!fs.existsSync(CONTENT_ROOT)) return map;

  const folders = fs.readdirSync(CONTENT_ROOT, { withFileTypes: true });
  for (const folder of folders) {
    if (!folder.isDirectory()) continue;
    const folderPath = path.join(CONTENT_ROOT, folder.name);
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
      if (!file.endsWith(".mdx")) continue;
      const filePath = path.join(folderPath, file);
      const raw = fs.readFileSync(filePath, "utf8");
      const parsed = matter(raw);
      const data = parsed.data as Partial<LessonFrontmatter>;
      if (!data.slug) continue;
      map.set(data.slug, { filePath, data: data as LessonFrontmatter });
    }
  }
  return map;
}

function buildCache(): Map<string, LessonRecord> {
  const mdx = scanMdxFiles();
  const cache = new Map<string, LessonRecord>();

  for (const meta of getCurriculumLessons()) {
    const found = mdx.get(meta.slug);
    const fm = found?.data ?? null;
    cache.set(meta.slug, {
      ...meta,
      hasContent: !!found,
      filePath: found?.filePath ?? null,
      frontmatter: fm,
      prerequisites: fm?.prerequisites ?? [],
      objectives: fm?.objectives ?? [],
      keyTerms: fm?.keyTerms ?? [],
      practiceFile: fm?.practiceFile ?? null,
      hasPractice: fm?.hasPractice ?? false,
    });
  }

  return cache;
}

function getCache(): Map<string, LessonRecord> {
  if (!_cache) _cache = buildCache();
  return _cache;
}

export function getAllLessons(): LessonRecord[] {
  return Array.from(getCache().values()).sort((a, b) => a.order - b.order);
}

export function getLessonBySlug(slug: string): LessonRecord | null {
  return getCache().get(slug) ?? null;
}

export function getLessonsByLevel(level: LevelId): LessonRecord[] {
  return getAllLessons().filter((l) => l.level === level);
}

export function getNextLesson(slug: string): LessonRecord | null {
  const all = getAllLessons();
  const idx = all.findIndex((l) => l.slug === slug);
  if (idx < 0 || idx + 1 >= all.length) return null;
  return all[idx + 1];
}

export function getPrevLesson(slug: string): LessonRecord | null {
  const all = getAllLessons();
  const idx = all.findIndex((l) => l.slug === slug);
  if (idx <= 0) return null;
  return all[idx - 1];
}

export function getAvailableLessonParams(): { level: string; slug: string }[] {
  return getAllLessons()
    .filter((l) => l.hasContent)
    .map((l) => ({ level: String(l.level), slug: l.slug }));
}

export function getLessonForRoute(
  level: string,
  slug: string,
): LessonRecord | null {
  const lesson = getLessonBySlug(slug);
  if (!lesson) return null;
  if (String(lesson.level) !== level) return null;
  return lesson;
}

export { getCurriculumBySlug };
