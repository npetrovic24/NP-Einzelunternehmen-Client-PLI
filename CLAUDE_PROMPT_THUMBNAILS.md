# Claude Code Task: PLI Lernportal – Bessere Thumbnails + Favicon

## Repo: `/root/.openclaw/workspace/projects/pli-portal/`

## Aufgabe 1: Favicon einbinden

Die Favicon-Dateien liegen bereits in `public/`:
- `favicon.ico` (32x32)
- `apple-touch-icon.png` (180x180)
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)

Aktualisiere `src/app/layout.tsx` (oder die Metadata), damit diese Favicons korrekt eingebunden werden. Next.js App Router nutzt die `metadata` Export oder die Datei-Konvention. Stelle sicher:
- favicon.ico wird als Favicon geladen
- apple-touch-icon.png für iOS
- Icons für PWA/manifest

## Aufgabe 2: Hochwertigere Kurs-Thumbnails

Die aktuellen Thumbnails in `public/thumbnails/` sind zu einfach (kleine Icons auf Gradient). Erstelle NEUE, professionellere SVG-Thumbnails.

### Design-Anforderungen:
- **Größe:** 800x480px (doppelt so groß wie vorher, für Retina)
- **Stil:** Modern, premium, Swiss-clean
- **Hintergrund:** Subtiler Gradient von links nach rechts (#0099A8 → #00B4C5), mit einem geometrischen Pattern aus feinen weißen Linien oder Punkten (dezent, 5-10% Opacity)
- **Icon:** GROSS in der Mitte (mindestens 160x160px), weiß, mit feinen Linien (stroke statt fill für eleganteren Look)
- **Dekoration:** Dezente geometrische Formen im Hintergrund (Kreise, Sechsecke) in Weiß mit 3-8% Opacity
- **Rundung:** 16px Border-Radius

### Icon-Design (DEUTLICH detaillierter als vorher):

**Brain (ADHS, Autismus, Neurodivergenz, Familien):**
Detailliertes Gehirn mit Windungen, Synapsen-Punkte drumherum

**Compass (Coach, Basis Modul):**
Kompass mit Nadel, Kreisring, Himmelsrichtungen angedeutet

**Heart-Shield (Burnout, Resilienz):**
Schild mit Herz drin, oder Herz mit Schutz-Aura

**Book-Open (Lerncoach, Klassenassistenz):**
Offenes Buch mit Seiten, kleine Lesezeichen

**Briefcase (Jobcoach, Arbeitsplatz):**
Aktentasche mit Details (Schnalle, Griff)

**Speech (Kommunikation, Konflikte):**
Zwei Sprechblasen die sich überlappen

**Leaf (Bachblüten, Heilströmen, EFT):**
Elegantes Blatt mit Adern, vielleicht eine Blüte

**Award (Leadership, CAS):**
Medaille/Pokal mit Stern

**Apple-Heart (Ernährung, Gesundheit):**
Apfel mit kleinem Herz drin

**Puzzle (Psychografie, Psychosozial):**
Puzzleteile die zusammenpassen, eines leicht herausgelöst

**Shield-Check (Antimobbing, Kinderschutz):**
Schild mit Checkmark

**Clipboard (Casemanagement, Sozialversicherung):**
Klemmbrett mit Checkliste

**Flower (Hochsensibilität):**
Detaillierte Blume mit mehreren Blütenblättern

**People (Beziehung):**
Zwei stilisierte Personen-Silhouetten nebeneinander

### Technisches:
- Erstelle ein Node.js Script `scripts/generate-thumbnails-v2.mjs`
- Generiere die SVGs programmatisch
- Überschreibe die alten `icon-*.svg` Dateien in `public/thumbnails/`
- Die Dateinamen MÜSSEN identisch bleiben (DB verweist auf `/thumbnails/icon-brain.svg` etc.)
- Führe das Script aus um die SVGs zu generieren

## Technische Regeln
- `npm run build` muss fehlerfrei durchlaufen
- Git Commit: `style: improved thumbnails + favicon`
