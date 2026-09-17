/**
 * Content collections — every file in /content is loaded here, validated with
 * Zod, and exposed to pages through src/content/loaders.ts.
 *
 * Rule 1 of CLAUDE.md is enforced here: a missing required field fails the
 * build with the file and path named.
 *
 * The `verified: false` gate is NOT enforced here. Astro caches parsed entries
 * in node_modules/.astro and re-validates only when a file changes, so a
 * schema refinement would be skipped on the next build. The gate lives in
 * astro.config.mjs (verifiedGate integration), which scans content/ on every
 * build. `verified` is declared here only so the type exists.
 */
import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

/** Entry ids are the bare file name: funds/afi.json → "afi". */
const load = (pattern: string) =>
  glob({ pattern, base: "./content", generateId: ({ entry }) => entry.replace(/\.(json|md)$/, "").split("/").pop()! });

// ---------- shared shapes ----------
const pair = z.tuple([z.string(), z.string()]);
const pairs = z.array(pair);
const style = z.enum(["primary", "secondary", "external"]).optional();
const button = z.object({ label: z.string(), href: z.string().optional(), action: z.string().optional(), style });
const link = z.object({ label: z.string(), href: z.string(), external: z.boolean().optional() });
const breadcrumb = z.array(z.string()).min(1);
const note = z.string().optional(); // `_note` fields: editorial, never rendered

const verified = z.boolean();

const base = { verified, _note: note };

// ---------- site.json ----------
const navItem: z.ZodType<any> = z.lazy(() =>
  z.object({ label: z.string(), href: z.string().optional(), children: z.array(navItem).optional() })
);
const site = defineCollection({
  loader: load("site.json"),
  schema: z.object({
    ...base,
    nav: z.array(navItem),
    headerButton: link,
    footer: z.object({
      columns: z.string(),
      extra: z.array(link),
      externalButton: link,
      licensingLine: z.string(),
      legalLinks: z.array(link),
      copyright: z.string(),
    }),
    importantDisclosure: z.object({ title: z.string(), body: z.string(), linkLabel: z.string(), href: z.string(), _note: note }),
    importantInformation: z.object({
      title: z.string(),
      generic: z.array(z.string()),
      fund: z.object({ template: z.string(), _note: note }),
      wholesale: z.object({ template: z.string(), thenGeneric: z.boolean(), _note: note }),
    }),
    ratings: z.object({ headline: z.string(), disclosure: z.string(), buttonLabel: z.string(), mobileTitle: z.string(), lonsecAlt: z.string(), badgeAlt: z.string() }),
    attestation: z.object({
      kicker: z.string(), title: z.string(), body: z.string(), checkbox: z.string(), validation: z.string(),
      continue: z.string(), decline: z.string(), footnote: z.string(), storageKey: z.string(),
    }),
    forms: z.object({
      formspreeEndpoint: z.string(),
      mailchimp: z.object({ audienceId: z.string(), formAction: z.string(), mergeFieldIAm: z.string() }),
    }),
    externalUrls: z.object({ olivia123: z.string(), ssandcRegistry: z.string(), arculusCapital: z.string() }),
    wholesaleKicker: z.string(),
    ui: z.object({
      skipToContent: z.string(), logoAlt: z.string(), menuOpen: z.string(), menuClose: z.string(),
      searchOpen: z.string(), searchClose: z.string(), searchPlaceholder: z.string(), searchSubmit: z.string(),
      popularSearchesTitle: z.string(), popularSearches: z.array(link), download: z.string(), viewAllDocuments: z.string(), seeMore: z.string(), wholesaleOnlyTag: z.string(), readingTimeSeparator: z.string(), formErrorBanner: z.string(), formSendFailed: z.string(), requiredField: z.string(), consentRequired: z.string(), closeDialog: z.string(), _formNote: note, _note: note,
    }),
  }),
});

// ---------- funds/*.json ----------
const funds = defineCollection({
  loader: load("funds/*.json"),
  schema: z.object({
    ...base,
    slug: z.enum(["afi", "pif"]),
    name: z.string(),
    theme: z.enum(["navy", "warm"]),
    breadcrumb,
    hero: z.object({
      title: z.string(), subtitle: z.string(), buttons: z.array(button), image: z.string().optional(),
      facts: z.array(z.object({ label: z.string(), value: z.string(), note: z.string().optional() })),
    }),
    about: z.object({ title: z.string(), body: z.string(), _note: note }),
    ratings: z.object({ show: z.boolean(), ratingReportUrl: z.string() }),
    performance: z.object({
      title: z.string(), note: z.string(),
      performanceAsAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      chartTitle: z.string(), chartImage: z.string(), chartSeries: z.array(z.string()),
      tableTitle: z.string(), periods: pairs,
    }),
    whoItMaySuit: z.object({ title: z.string(), body: z.string() }),
    howManaged: z.object({ title: z.string(), body: z.array(z.string()), button }),
    features: z.object({ title: z.string(), items: pairs }),
    portfolio: z.object({
      title: z.string(), asAt: z.string(), metrics: pairs,
      allocation: z.object({ columns: z.tuple([z.string(), z.string()]), rows: pairs }),
    }),
    howToInvest: z.object({ title: z.string(), columns: z.array(z.object({ title: z.string(), body: z.string(), button, icon: z.string().optional() })) }),
    keyDocuments: z.object({ title: z.string(), items: z.array(z.object({ title: z.string(), meta: z.string(), doc: z.string() })), _note: note }),
    documents: z.object({ title: z.string(), intro: z.string(), items: z.array(z.string()), button }),
    regulatory: z.object({ re: z.string(), arsn: z.string(), apir: z.string(), administrator: z.string(), custodian: z.string(), _note: note }),
  }),
});

// ---------- wholesale/*.json ----------
const strategyCard = z.object({ kicker: z.string(), title: z.string(), body: z.string(), heroStat: pair, facts: pairs, image: z.string() });
const wholesale = defineCollection({
  loader: load("wholesale/*.json"),
  schema: z.discriminatedUnion("kind", [
    z.object({
      kind: z.literal("strategy"), ...base,
      slug: z.enum(["a-minus", "bbb", "pep"]), name: z.string(), shortName: z.string(), ladder: z.number().int().min(1).max(3),
      gated: z.literal(true), breadcrumb, kicker: z.string(),
      card: strategyCard,
      hero: z.object({ title: z.string(), subtitle: z.string(), button, facts: pairs }),
      statement: z.object({ title: z.string(), points: pairs, footnote: z.string() }),
      strategyAtAGlance: pairs,
      about: z.object({ title: z.string(), body: z.string() }),
      atAGlance: z.object({ title: z.string(), note: z.string(), items: pairs }),
      processRiskControls: z.object({ title: z.string(), items: pairs }),
      keyRisks: z.object({ title: z.string(), paragraphs: z.array(z.string()) }),
      cta: z.object({ title: z.string(), body: z.string(), button }),
      importantInformation: z.object({ riskSubject: z.string(), asAt: z.string(), _note: note }),
      portfolioDataAsAt: z.string(),
      performanceFigures: z.string(),
    }),
    z.object({
      kind: z.literal("landing"), ...base, breadcrumb, gated: z.literal(true),
      hero: z.object({ kicker: z.string(), title: z.string(), subtitle: z.string() }),
      strategies: z.object({ title: z.string(), intro: z.string(), cards: z.array(z.enum(["a-minus", "bbb", "pep"])), buttonLabel: z.string() }),
      importantInformation: z.object({ riskSubject: z.string(), asAt: z.string() }),
    }),
    z.object({
      kind: z.literal("private-mandates"), ...base,
      anchor: z.string(), title: z.string(), body: z.string(), aside: z.string(), button, facts: pairs,
    }),
  ]),
});

// ---------- im.json ----------
const im = defineCollection({
  loader: load("im.json"),
  schema: z.object({
    ...base, gated: z.literal(true), breadcrumb, kicker: z.string(), entityName: z.string(),
    hero: z.object({ title: z.string(), subtitle: z.string(), buttons: z.array(button), facts: pairs }),
    statement: z.object({ title: z.string(), points: pairs, footnote: z.string() }),
    about: z.object({ title: z.string(), paragraphs: z.array(z.string()) }),
    atAGlance: z.object({ title: z.string(), note: z.string(), items: pairs }),
    howWeBuild: z.object({ title: z.string(), anchor: z.string(), items: pairs }),
    keyRisks: z.object({ title: z.string(), paragraphs: z.array(z.string()) }),
    cta: z.object({ title: z.string(), body: z.string(), button }),
    importantInformation: z.object({ riskSubject: z.string(), asAt: z.string().nullable(), _note: note }),
  }),
});

// ---------- about/*.json ----------
const hero2 = z.object({ title: z.string(), subtitle: z.string(), button });
const cta = z.object({ title: z.string(), body: z.string(), button });
const person = z.object({ name: z.string(), title: z.string(), bio: z.string(), photo: z.string() });
const about = defineCollection({
  loader: load("about/*.json"),
  schema: z.discriminatedUnion("kind", [
    z.object({
      kind: z.literal("approach"), ...base, breadcrumb, hero: hero2,
      whoWeAre: z.object({ title: z.string(), paragraphs: z.array(z.string()), image: z.string(), _note: note }),
      showRatings: z.boolean(),
      philosophy: z.object({ title: z.string(), items: pairs, link }),
      whatWeDo: z.object({ title: z.string(), items: z.array(z.union([z.string(), z.object({ text: z.string(), link })])) }),
      forOurClients: z.object({ title: z.string(), items: z.array(z.string()) }),
      cta,
    }),
    z.object({
      kind: z.literal("governance"), ...base, breadcrumb, hero: hero2,
      howItWorks: z.object({ title: z.string(), paragraphs: z.array(z.string()), image: z.string() }),
      fourRoles: z.object({ title: z.string(), items: z.array(z.object({ title: z.string(), body: z.string(), link })), _note: note }),
      investmentCommittee: z.object({ title: z.string(), paragraphs: z.array(z.string()), _note: note, link, image: z.string() }),
      cta,
    }),
    z.object({
      kind: z.literal("team"), ...base, breadcrumb, hero: hero2,
      groups: z.array(z.object({ title: z.string(), intro: z.string().optional(), people: z.array(person), _note: note })),
      distribution: z.object({ title: z.string(), body: z.string() }),
      cta,
    }),
  ]),
});

// ---------- insights.json ----------
const insights = defineCollection({
  loader: load("insights.json"),
  schema: z.object({
    ...base,
    page: z.object({
      breadcrumb, hero: z.object({ title: z.string(), subtitle: z.string(), button }),
      filters: z.array(z.string()), latestTitle: z.string(), listTitle: z.string(), readLabel: z.string(), cta,
    }),
    featured: z.string(),
    articles: z.array(z.object({
      slug: z.string(), category: z.string(), filter: z.string(), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      title: z.string(), homeTitle: z.string().optional(), summary: z.string(), homeSummary: z.string().optional(),
      readingTime: z.string().nullable().optional(), wholesaleOnly: z.boolean(), pdf: z.string(), image: z.string().optional(),
    })),
  }).refine((d) => d.articles.some((a) => a.slug === d.featured), { message: "featured must name an article slug" }),
});

// ---------- documents.json ----------
const documents = defineCollection({
  loader: load("documents.json"),
  schema: z.object({
    ...base,
    page: z.object({
      breadcrumb, hero: z.object({ title: z.string(), subtitle: z.string(), button }),
      filters: z.array(z.string()), searchPlaceholder: z.string(), seeMoreLabel: z.string(), showingLabel: z.string(),
      sections: z.array(z.object({
        key: z.string(), title: z.string(), intro: z.string(),
        button: button.optional(), row: z.object({ title: z.string(), meta: z.string() }).optional(),
      })),
    }),
    documents: z.array(z.object({
      id: z.string(), fund: z.string(), category: z.string(), title: z.string(), meta: z.string(),
      date: z.string().nullable(), path: z.string(), size: z.string().nullable(), wholesaleOnly: z.boolean(), _note: note,
    })),
  }),
});

// ---------- pages/*.json ----------
const formField = z.object({
  name: z.string(), label: z.string().optional(), type: z.string(), placeholder: z.string().optional(),
  required: z.boolean().optional(), options: z.array(z.string()).optional(), error: z.string().optional(), _note: note,
});
const pages = defineCollection({
  loader: load("pages/*.json"),
  schema: z.discriminatedUnion("kind", [
    z.object({
      kind: z.literal("home"), ...base,
      hero: z.object({ title: z.string(), subtitle: z.string(), buttons: z.array(button), image: z.string().optional() }),
      funds: z.object({
        title: z.string(),
        cards: z.array(z.object({ fund: z.enum(["afi", "pif"]), title: z.string(), subtitle: z.string(), rate: z.string(), rateNote: z.string() })),
        cardButtons: z.array(button), showRatings: z.boolean(),
      }),
      leftRight: z.array(z.object({ title: z.string(), body: z.string(), image: z.string() })),
      leftRightButton: link,
      productCards: z.object({ title: z.string(), cards: z.array(z.object({ title: z.string(), subtitle: z.string(), button, _note: note })) }),
      insights: z.object({ title: z.string(), button, featured: z.string(), list: z.array(z.string()) }),
    }),
    z.object({
      kind: z.literal("contact"), ...base, breadcrumb,
      hero: z.object({ title: z.string(), subtitle: z.string() }),
      form: z.object({ title: z.string(), intro: z.string(), fields: z.array(formField), submit: z.string() }),
      sent: z.object({ title: z.string(), body: z.string(), referenceLabel: z.string(), _note: note, links: z.array(link) }),
      details: z.array(z.object({ title: z.string(), lines: z.array(z.string()), link: link.optional(), _note: note })),
      whoToContact: z.object({ title: z.string(), columns: z.array(z.object({ title: z.string(), body: z.string(), button })) }),
    }),
    z.object({ kind: z.literal("404"), ...base, kicker: z.string(), title: z.string(), body: z.string(), links: z.array(link) }),
    z.object({
      kind: z.literal("search"), ...base, breadcrumb, title: z.string(), placeholder: z.string(), button: z.string(),
      resultsLabel: z.string(), filters: z.array(z.string()),
      kickers: z.object({ page: z.string(), document: z.string(), insight: z.string() }), pagination: z.boolean(),
    }),
    z.object({
      kind: z.literal("subscribe"), ...base,
      modal: z.object({ title: z.string(), body: z.string(), fields: z.array(formField), submit: z.string() }),
      done: z.object({ title: z.string(), body: z.string(), close: z.string() }),
    }),
  ]),
});

// ---------- markdown: legal/*.md and about/esg.md ----------
const markdownSchema = z.object({
  title: z.string(), lead: z.string().optional(), lastUpdated: z.string().optional(), verified, note: z.string().optional(),
});
const legal = defineCollection({ loader: load("legal/*.md"), schema: markdownSchema });
const aboutMd = defineCollection({ loader: load("about/*.md"), schema: markdownSchema });

export const collections = { site, funds, wholesale, im, about, aboutMd, insights, documents, pages, legal };
