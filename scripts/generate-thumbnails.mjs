import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const outDir = join(import.meta.dirname, "..", "public", "thumbnails");
mkdirSync(outDir, { recursive: true });

// SVG icon paths (Lucide-inspired, simplified)
const icons = {
  brain: `<g transform="translate(160,80)" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 4a8 8 0 0 0-7.7 10.1"/>
    <path d="M12 4a8 8 0 0 1 7.7 10.1"/>
    <path d="M20.7 14.1A8 8 0 0 1 12 44"/>
    <path d="M3.3 14.1A8 8 0 0 0 12 44"/>
    <path d="M12 4v40"/>
    <path d="M4.3 14.1C6.5 17 9 19 12 20"/>
    <path d="M19.7 14.1C17.5 17 15 19 12 20"/>
    <path d="M4.3 14.1C6.5 11 9 9 12 8"/>
    <path d="M19.7 14.1C17.5 11 15 9 12 8"/>
    <circle cx="12" cy="24" r="3" fill="white" stroke="none" opacity="0.4"/>
    <path d="M3.3 28c3 2 6 3 8.7 3"/>
    <path d="M20.7 28c-3 2-6 3-8.7 3"/>
  </g>`,

  compass: `<g transform="translate(160,80)" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="24" cy="24" r="22"/>
    <polygon points="16,32 24,6 32,32 24,26" fill="white" fill-opacity="0.3" stroke="white"/>
    <polygon points="16,16 24,42 32,16 24,22" fill="white" fill-opacity="0.15" stroke="white"/>
  </g>`,

  heart_shield: `<g transform="translate(160,80)" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M24 6C14-2 2 8 2 18c0 14 22 26 22 26S46 32 46 18C46 8 34-2 24 6z" fill="white" fill-opacity="0.15"/>
    <path d="M24 6C14-2 2 8 2 18c0 14 22 26 22 26S46 32 46 18C46 8 34-2 24 6z"/>
    <path d="M18 20l4 4 8-8" stroke-width="3"/>
  </g>`,

  flower: `<g transform="translate(160,80)" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="24" cy="24" r="6" fill="white" fill-opacity="0.3"/>
    <circle cx="24" cy="12" r="6" fill="white" fill-opacity="0.15"/>
    <circle cx="34" cy="17" r="6" fill="white" fill-opacity="0.15"/>
    <circle cx="34" cy="31" r="6" fill="white" fill-opacity="0.15"/>
    <circle cx="24" cy="36" r="6" fill="white" fill-opacity="0.15"/>
    <circle cx="14" cy="31" r="6" fill="white" fill-opacity="0.15"/>
    <circle cx="14" cy="17" r="6" fill="white" fill-opacity="0.15"/>
    <path d="M24 36v10"/>
    <path d="M20 42c4 4 8 4 8 0"/>
  </g>`,

  speech: `<g transform="translate(160,80)" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 6h24c2 0 4 2 4 4v16c0 2-2 4-4 4H12l-8 8v-8c-2 0-4-2-4-4V10c0-2 2-4 4-4z" fill="white" fill-opacity="0.15"/>
    <path d="M20 10h20c2 0 4 2 4 4v16c0 2-2 4-4 4v8l-8-8H20" fill="white" fill-opacity="0.1"/>
    <line x1="10" y1="16" x2="22" y2="16" stroke-width="3"/>
    <line x1="10" y1="22" x2="18" y2="22" stroke-width="3"/>
  </g>`,

  briefcase: `<g transform="translate(160,80)" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="14" width="44" height="30" rx="4" fill="white" fill-opacity="0.15"/>
    <path d="M16 14V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v6"/>
    <line x1="2" y1="28" x2="46" y2="28" stroke-width="3"/>
    <circle cx="24" cy="28" r="3" fill="white"/>
  </g>`,

  book: `<g transform="translate(160,80)" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 4h14c4 0 6 2 6 6v32c0-3-2-5-6-5H4z" fill="white" fill-opacity="0.15"/>
    <path d="M44 4H30c-4 0-6 2-6 6v32c0-3 2-5 6-5h14z" fill="white" fill-opacity="0.15"/>
    <line x1="10" y1="14" x2="18" y2="14" stroke-width="2"/>
    <line x1="10" y1="20" x2="16" y2="20" stroke-width="2"/>
    <line x1="30" y1="14" x2="38" y2="14" stroke-width="2"/>
    <line x1="30" y1="20" x2="36" y2="20" stroke-width="2"/>
  </g>`,

  apple: `<g transform="translate(160,80)" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M24 8c-10-4-22 6-22 20 0 10 6 18 14 18 2 0 4-1 8-1s6 1 8 1c8 0 14-8 14-18 0-14-12-24-22-20z" fill="white" fill-opacity="0.15"/>
    <path d="M24 2c4-1 8 2 8 6"/>
    <path d="M22 8c0-4 2-8 6-8"/>
  </g>`,

  people: `<g transform="translate(160,80)" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="16" cy="10" r="7" fill="white" fill-opacity="0.2"/>
    <circle cx="34" cy="10" r="7" fill="white" fill-opacity="0.2"/>
    <path d="M2 42c0-10 6-16 14-16s14 6 14 16" fill="white" fill-opacity="0.15"/>
    <path d="M20 42c0-10 6-16 14-16s14 6 14 16" fill="white" fill-opacity="0.15"/>
  </g>`,

  award: `<g transform="translate(160,80)" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="24" cy="18" r="14" fill="white" fill-opacity="0.15"/>
    <path d="M14 30l-4 16 14-6 14 6-4-16"/>
    <polygon points="24,8 27,14 33,15 28,20 30,26 24,22 18,26 20,20 15,15 21,14" fill="white" fill-opacity="0.3"/>
  </g>`,

  leaf: `<g transform="translate(160,80)" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M24 44C24 44 4 32 4 16 4 4 16 0 24 4 32 0 44 4 44 16 44 32 24 44 24 44z" fill="white" fill-opacity="0.15"/>
    <path d="M24 44V18"/>
    <path d="M10 22c6-2 10 0 14 4"/>
    <path d="M38 18c-6 0-10 2-14 6"/>
  </g>`,

  puzzle: `<g transform="translate(160,80)" fill="none" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 18V8a4 4 0 0 1 4-4h10" fill="white" fill-opacity="0.15"/>
    <path d="M18 4c0 0 0-4 6-4s6 4 6 4h10a4 4 0 0 1 4 4v10" fill="white" fill-opacity="0.15"/>
    <path d="M44 18c0 0 4 0 4 6s-4 6-4 6v10a4 4 0 0 1-4 4H30" fill="white" fill-opacity="0.1"/>
    <path d="M30 44c0 0 0 4-6 4s-6-4-6-4H8a4 4 0 0 1-4-4V30" fill="white" fill-opacity="0.1"/>
    <path d="M4 30c0 0-4 0-4-6s4-6 4-6" fill="white" fill-opacity="0.15"/>
  </g>`,

  shield_person: `<g transform="translate(160,80)" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M24 2L4 10v14c0 14 20 22 20 22s20-8 20-22V10z" fill="white" fill-opacity="0.15"/>
    <circle cx="24" cy="18" r="6" fill="white" fill-opacity="0.3"/>
    <path d="M14 36c0-6 4-10 10-10s10 4 10 10"/>
  </g>`,

  shield: `<g transform="translate(160,80)" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M24 2L4 10v14c0 14 20 22 20 22s20-8 20-22V10z" fill="white" fill-opacity="0.15"/>
    <path d="M16 22l6 6 12-12" stroke-width="4"/>
  </g>`,

  clipboard: `<g transform="translate(160,80)" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <rect x="6" y="8" width="36" height="38" rx="4" fill="white" fill-opacity="0.15"/>
    <rect x="14" y="2" width="20" height="10" rx="3" fill="white" fill-opacity="0.2"/>
    <line x1="14" y1="22" x2="34" y2="22" stroke-width="3"/>
    <line x1="14" y1="30" x2="30" y2="30" stroke-width="3"/>
    <line x1="14" y1="38" x2="26" y2="38" stroke-width="3"/>
  </g>`,

  generic: `<g transform="translate(160,80)" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="24" cy="24" r="20" fill="white" fill-opacity="0.15"/>
    <path d="M12 24l8 8 16-16" stroke-width="4"/>
  </g>`,
};

// Course-to-icon mapping based on keywords
const courseIconMap = [
  { keywords: ["adhs", "autismus", "neurodivergenz"], icon: "brain" },
  { keywords: ["coach", "basis modul", "basis"], icon: "compass" },
  { keywords: ["burnout", "resilienz"], icon: "heart_shield" },
  { keywords: ["hochsensib"], icon: "flower" },
  { keywords: ["kommunikation", "konflikt", "mediation"], icon: "speech" },
  { keywords: ["jobcoach", "arbeitsplatz"], icon: "briefcase" },
  { keywords: ["lerncoach", "klassenassistenz"], icon: "book" },
  { keywords: ["ernährung", "gesundheit"], icon: "apple" },
  { keywords: ["famili", "beziehung", "paar", "eltern"], icon: "people" },
  { keywords: ["leadership", "cas", "führung"], icon: "award" },
  { keywords: ["bachblüten", "heilströmen", "eft", "naturheil"], icon: "leaf" },
  { keywords: ["psychografie", "psychosozial"], icon: "puzzle" },
  { keywords: ["antimobbing", "mobbing"], icon: "shield" },
  { keywords: ["casemanagement", "sozialversicherung"], icon: "clipboard" },
  { keywords: ["kinderschutz", "erwachsenenschutz", "kesb"], icon: "shield_person" },
];

function getIconForCourse(courseName) {
  const lower = courseName.toLowerCase();
  for (const mapping of courseIconMap) {
    if (mapping.keywords.some((kw) => lower.includes(kw))) {
      return mapping.icon;
    }
  }
  return "generic";
}

// Background pattern (subtle dots)
const pattern = `<defs>
    <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="1.2" fill="white" opacity="0.08"/>
    </pattern>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0099A8"/>
      <stop offset="100%" stop-color="#007A87"/>
    </linearGradient>
  </defs>`;

function generateSvg(iconKey) {
  const iconSvg = icons[iconKey] || icons.generic;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240">
  ${pattern}
  <rect width="400" height="240" rx="12" fill="url(#bg)"/>
  <rect width="400" height="240" rx="12" fill="url(#dots)"/>
  ${iconSvg}
</svg>`;
}

// Generate SVGs for all known courses from the spec
const courses = [
  { slug: "adhs-coach", name: "ADHS Coach" },
  { slug: "autismus-coach", name: "Autismus Coach" },
  { slug: "cas-leadership", name: "CAS Leadership PLI" },
  { slug: "pli-basis", name: "PLI Basis" },
  { slug: "pli-jobcoach", name: "PLI Jobcoach" },
  { slug: "klassenassistenz", name: "Klassenassistenz PLI" },
  { slug: "neurodivergenz-arbeitsplatz", name: "Neurodivergenz am Arbeitsplatz" },
  { slug: "ernaehrungsberater", name: "PLI Ernährungsberater" },
  { slug: "hochsensibilitaet", name: "Hochsensibilität PLI" },
  { slug: "lerncoach", name: "PLI Lerncoach" },
  { slug: "psychografie", name: "PLI Psychografie" },
  { slug: "resilienzcoach", name: "Resilienzcoach" },
  { slug: "burnout-coach", name: "Burnout Coach" },
  { slug: "kommunikationscoach", name: "Kommunikationscoach" },
  { slug: "konfliktcoach", name: "Konfliktcoach" },
  { slug: "familiencoach", name: "Familiencoach" },
  { slug: "bachblueten", name: "Bachblüten Beratung" },
  { slug: "heilstroemen", name: "Heilströmen" },
  { slug: "eft-coach", name: "EFT Coach" },
  { slug: "antimobbingcoach", name: "Antimobbingcoach" },
  { slug: "casemanagement", name: "Casemanagement" },
  { slug: "sozialversicherung", name: "Sozialversicherung" },
  { slug: "kinderschutz", name: "Kindes- und Erwachsenenschutz" },
  { slug: "psychosoziale-beratung", name: "Psychosoziale Beratung" },
  { slug: "paarcoach", name: "Paar- und Beziehungscoach" },
  { slug: "elterncoach", name: "Elterncoach" },
  { slug: "mediationscoach", name: "Mediationscoach" },
  { slug: "gesundheitscoach", name: "Gesundheitscoach" },
  { slug: "naturheilkunde", name: "Naturheilkunde" },
  { slug: "fuehrungscoach", name: "Führungscoach" },
];

// Also generate one per icon type for UUID-based matching
const iconTypes = Object.keys(icons);

let generatedCount = 0;

// Generate slug-based thumbnails
for (const course of courses) {
  const iconKey = getIconForCourse(course.name);
  const svg = generateSvg(iconKey);
  const filePath = join(outDir, `${course.slug}.svg`);
  writeFileSync(filePath, svg);
  generatedCount++;
}

// Generate icon-type based thumbnails (for UUID course matching)
for (const iconType of iconTypes) {
  const svg = generateSvg(iconType);
  const filePath = join(outDir, `icon-${iconType}.svg`);
  writeFileSync(filePath, svg);
  generatedCount++;
}

console.log(`Generated ${generatedCount} SVG thumbnails in ${outDir}`);

// Generate SQL update template
const sqlLines = [
  "-- Update course thumbnails based on course name keywords",
  "-- Run this AFTER courses are created in the database",
  "-- Each course gets an icon-{type}.svg based on its name keywords",
  "",
];

// For each icon mapping, generate a SQL CASE WHEN
sqlLines.push(`UPDATE public.courses SET thumbnail_url = CASE`);

for (const mapping of courseIconMap) {
  const conditions = mapping.keywords
    .map((kw) => `LOWER(name) LIKE '%${kw}%'`)
    .join(" OR ");
  sqlLines.push(`  WHEN ${conditions} THEN '/thumbnails/icon-${mapping.icon}.svg'`);
}

sqlLines.push(`  ELSE '/thumbnails/icon-generic.svg'`);
sqlLines.push(`END;`);
sqlLines.push("");

const sqlPath = "/tmp/update-thumbnails.sql";
writeFileSync(sqlPath, sqlLines.join("\n"));
console.log(`Generated SQL at ${sqlPath}`);
