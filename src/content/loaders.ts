/**
 * Typed accessors over the content collections. Pages import from here and
 * nowhere else, so a change to the content model is a change to one file.
 */
import { getCollection, getEntry, render, type CollectionEntry } from "astro:content";

export type Site = CollectionEntry<"site">["data"];
export type Fund = CollectionEntry<"funds">["data"];
export type Strategy = Extract<CollectionEntry<"wholesale">["data"], { kind: "strategy" }>;
export type WholesaleLanding = Extract<CollectionEntry<"wholesale">["data"], { kind: "landing" }>;
export type PrivateMandates = Extract<CollectionEntry<"wholesale">["data"], { kind: "private-mandates" }>;
export type Article = CollectionEntry<"insights">["data"]["articles"][number];
export type Doc = CollectionEntry<"documents">["data"]["documents"][number];

async function one<C extends "site" | "im" | "insights" | "documents">(collection: C, id: string) {
  const entry = await getEntry(collection, id);
  if (!entry) throw new Error(`content: ${collection}/${id} not found`);
  return entry.data as CollectionEntry<C>["data"];
}

export const getSite = () => one("site", "site");
export const getIm = () => one("im", "im");
export const getInsights = () => one("insights", "insights");
export const getDocuments = () => one("documents", "documents");

export async function getFund(slug: "afi" | "pif"): Promise<Fund> {
  const e = await getEntry("funds", slug);
  if (!e) throw new Error(`content: funds/${slug} not found`);
  return e.data;
}
export const getFunds = async () => (await getCollection("funds")).map((e) => e.data);

export async function getStrategy(slug: "a-minus" | "bbb" | "pep"): Promise<Strategy> {
  const e = await getEntry("wholesale", slug);
  if (!e || e.data.kind !== "strategy") throw new Error(`content: wholesale/${slug} not a strategy`);
  return e.data;
}
export async function getStrategies(): Promise<Strategy[]> {
  const all = await getCollection("wholesale");
  return all.map((e) => e.data).filter((d): d is Strategy => d.kind === "strategy").sort((a, b) => a.ladder - b.ladder);
}
export async function getWholesaleLanding(): Promise<WholesaleLanding> {
  const e = await getEntry("wholesale", "landing");
  if (!e || e.data.kind !== "landing") throw new Error("content: wholesale/landing missing");
  return e.data;
}
export async function getPrivateMandates(): Promise<PrivateMandates> {
  const e = await getEntry("wholesale", "private-mandates");
  if (!e || e.data.kind !== "private-mandates") throw new Error("content: wholesale/private-mandates missing");
  return e.data;
}

export async function getAbout<K extends "approach" | "governance" | "team">(kind: K) {
  const e = await getEntry("about", kind);
  if (!e || e.data.kind !== kind) throw new Error(`content: about/${kind} missing`);
  return e.data as Extract<CollectionEntry<"about">["data"], { kind: K }>;
}
export async function getPage<K extends "home" | "contact" | "404" | "search" | "subscribe">(kind: K) {
  const e = await getEntry("pages", kind);
  if (!e || e.data.kind !== kind) throw new Error(`content: pages/${kind} missing`);
  return e.data as Extract<CollectionEntry<"pages">["data"], { kind: K }>;
}

/** Legal pages and ESG: frontmatter plus a rendered <Content /> component. */
export async function getMarkdown(collection: "legal" | "aboutMd", id: string) {
  const e = await getEntry(collection, id);
  if (!e) throw new Error(`content: ${collection}/${id} missing`);
  const { Content } = await render(e);
  return { ...e.data, Content };
}

/** Cross-references used by several pages. */
export async function getArticle(slug: string): Promise<Article> {
  const a = (await getInsights()).articles.find((x) => x.slug === slug);
  if (!a) throw new Error(`content: article ${slug} not in insights.json`);
  return a;
}
export async function getDoc(id: string): Promise<Doc> {
  const d = (await getDocuments()).documents.find((x) => x.id === id);
  if (!d) throw new Error(`content: document ${id} not in documents.json`);
  return d;
}

/**
 * Fill the fund / wholesale Important Information templates from site.json.
 * The template strings are verbatim compliance copy; only the braces change.
 */
export function fill(template: string, vars: Record<string, string | null | undefined>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => {
    const v = vars[k];
    if (v == null) throw new Error(`Important Information: missing value for {${k}}`);
    return v;
  });
}
