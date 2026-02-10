# Claude Code Task: PLI Lernportal – Phase 5 Design Polish

## Kontext
Phases 1-4 sind fertig. Das Portal funktioniert, hat 33 Kurse mit Canva-Embeds und PDFs.
Repo: `/root/.openclaw/workspace/projects/pli-portal/`
Jetzt geht es um Design-Polish und UX-Verbesserungen basierend auf State-of-the-Art LMS Designs (Teachable, Thinkific, Kajabi 2025/2026 Standards).

## CI
- Primary/Teal: #0099A8 (bereits korrekt in globals.css)
- Background: #FFFFFF
- Text: #333333
- Secondary BG: #F5F5F5
- Font: Inter (bereits korrekt)
- Stil: Swiss-clean, minimal, professionell, PREMIUM

## Design-Optimierungen

### 1. Login Page – Premium & Einladend
Die aktuelle Login-Seite ist funktional aber basic. Verbesserungen:
- Linke Seite (50%): Teal-Gradient Hintergrund mit einem motivierenden Zitat oder Welcome-Text in Weiß. Subtiles Pattern oder Geometrie. Nur auf Desktop sichtbar.
- Rechte Seite: Das Login-Formular wie bisher, aber mit mehr Whitespace und größerem Logo-Bereich.
- Auf Mobile: Nur Formular (full-width) mit Teal-Header-Stripe oben.
- "Passwort vergessen?" Link unter dem Formular (kann erstmal als toast "Kontaktiere den Administrator" zeigen).
- Subtle Animations: Fade-in beim Laden.

### 2. Member Dashboard – Moderner "Jump Back In" Style
Aktuell: einfache Card-Grid. Besser:
- **Hero-Section oben**: Begrüßung mit Gradient-Hintergrund (subtiler Teal-Verlauf), größere Typo
- **Kurs-Cards verbessern**:
  - Teal-Akzentlinie oben an jeder Card (4px border-top in primary)
  - Hover-Effect: subtle scale + shadow
  - Einheiten-Anzahl als kleine Info auf der Card ("15 Tage")
  - Kategorie-Tags schöner gestaltet
- Falls keine Kurse: Schönere Empty-State Illustration (SVG Icon statt nur GraduationCap)
- **Responsive**: 1 Spalte Mobile, 2 Tablet, 3 Desktop

### 3. Course View / Unit Sidebar – App-Like Navigation
Aktuell redirected die Kursseite direkt zur ersten Unit. Besser:
- **Sidebar links** (Desktop): Kursname oben, dann Module als Accordions mit Einheiten darunter. Aktive Einheit hervorgehoben mit Teal-Akzent.
- **Content rechts**: Der Content-Viewer wie bisher
- **Mobile**: Sidebar wird zu einem Sheet/Drawer von links (Hamburger-Button)
- **Fortschritts-Indikator**: Kleiner Kreis oder Checkmark neben besuchten Einheiten (optional, kann Platzhalter sein)
- Breadcrumb über dem Content

### 4. Content Viewer – Immersive Experience
- **Canva Embeds**: Größer! Volle Breite (max-w-4xl entfernen oder auf max-w-5xl), mindestens 70vh Höhe statt 16:9 Aspect Ratio. Loading Skeleton während iframe lädt.
- **PDF Downloads**: Schönere Cards mit Teal-Icon, Dateiname prominent, "Herunterladen" Button mit Download-Icon. Verwende `filename` aus dem content JSON (aktuell "Skript / Dokument").
- **Prev/Next Navigation**: Sticky am unteren Rand als floating Bar (nicht nur am Ende des Contents)
- **Spacing**: Mehr Breathing Room zwischen Content-Blöcken

### 5. Admin Panel – Clean Dashboard
- **Admin Dashboard (/admin)**: Zeige echte Stats:
  - Anzahl Mitglieder (aktiv/gesamt)
  - Anzahl Lehrgänge (aktiv/gesamt)
  - Anzahl Einheiten
  - Letzte Anmeldungen (wenn möglich)
  - Nutze Card-Grid mit Icon + Zahl + Label
- **Admin Header**: Einheitlicher mit Member-Header, aber mit "Admin" Badge

### 6. Micro-Interactions & Polish
- **Page Transitions**: Subtle fade-in Animation auf Seitenwechsel (framer-motion NICHT installieren, nutze CSS transitions/animations)
- **Loading States**: Skeleton-Loader für Dashboard-Kurse und Content-Viewer
- **Toast Styling**: Toasts im PLI CI (Teal Accent)
- **Focus States**: Sichtbare Focus-Rings im PLI Teal für Accessibility
- **Scroll-to-Top**: Beim Navigieren zwischen Einheiten
- **Empty States**: Konsistent gestaltet mit Icon + Text + optional CTA

### 7. Typography & Spacing
- H1: 1.75rem (28px), semibold
- H2: 1.25rem (20px), semibold
- Body: 0.875rem (14px), regular
- Muted: 0.75rem (12px), text-muted-foreground
- Konsistentes Padding: p-6 auf Desktop, p-4 auf Mobile
- Max Content Width: max-w-5xl für Content-Bereiche

### 8. Responsive Verbesserungen
- Mobile-First: Alle Layouts testen für 375px Breite
- Tablet: Sidebar collapsed oder als Overlay
- Desktop: Full Sidebar + Content

## Technische Regeln
- Keine neuen Dependencies installieren (kein framer-motion etc.)
- Nur CSS Animations/Transitions nutzen
- shadcn/ui Components beibehalten und erweitern
- TypeScript strict
- `npm run build` muss fehlerfrei durchlaufen
- Git Commits: `style(PLI-9): Beschreibung`

## Reihenfolge
1. Login Page Redesign
2. Dashboard Polish
3. Course Sidebar + Unit View
4. Content Viewer Improvements
5. Admin Dashboard Stats
6. Micro-Interactions
7. Final Build Check + Commit
