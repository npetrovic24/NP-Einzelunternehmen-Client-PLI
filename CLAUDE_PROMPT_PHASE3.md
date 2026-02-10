# Claude Code Task: PLI Lernportal – Phase 3 Member Portal

## Kontext
Phase 1 (Auth + Layouts) und Phase 2 (Admin Panel) sind fertig.
Repo: `/root/.openclaw/workspace/projects/pli-portal/`
Lies ZUERST: `ARCHITECTURE.md`, dann die Feature-Specs in `features/` (PLI-7, PLI-8).

Die Datenbank ist eingerichtet mit: profiles, courses, modules, units, content_blocks, access_grants.
RLS Policies sind aktiv. Supabase Credentials in `.env.local`.

## CI / Design
- Primary/Teal: #0099A8
- Background: #FFFFFF
- Text: #333333
- Secondary BG: #F5F5F5
- Font: Inter
- Stil: Swiss-clean, minimal, professionell, ruhig
- shadcn/ui Components im CI

## Phase 3 Tasks

### 1. Member Dashboard (/dashboard)
- "Meine Lehrgänge" Übersicht
- Zeigt NUR Kurse, auf die der eingeloggte User Zugriff hat (via access_grants)
- Card-Grid: Thumbnail, Kursname, Beschreibung, Fortschritt (optional, kann Platzhalter sein)
- Klick auf Kurs → /courses/[id]
- Leerer State: "Du hast noch keine Lehrgänge freigeschaltet." mit freundlicher Illustration/Icon
- Begrüßung oben: "Willkommen, {full_name}" 

### 2. Kurs-Ansicht (/courses/[id])
- Kursname + Beschreibung oben
- Navigation: Module als Sections/Accordion, Einheiten als Links darunter
- Sidebar oder vertikale Navigation mit allen Modulen/Einheiten
- Aktuell ausgewählte Einheit hervorgehoben
- Nur Module/Einheiten anzeigen, auf die der User Zugriff hat (access_grants, "most specific rule wins")
- Breadcrumb: Dashboard > Kursname > Modulname > Einheit

### 3. Content Viewer (/courses/[id]/units/[unitId])
- Zeigt alle content_blocks der Einheit in sort_order an
- Block-Rendering nach Typ:
  - **canva_embed**: iframe mit der Canva-URL, responsive (16:9 oder auto-height). URL wird über eine Server-Side API Route geladen (NICHT direkt im Client-HTML). Erstelle `/api/embed-url/[blockId]` Route die die URL aus der DB holt und zurückgibt.
  - **text**: Markdown/HTML rendern (sanitized)
  - **file**: Download-Button mit Dateiname und Icon
  - **link**: Klickbarer Link mit Titel, öffnet in neuem Tab
- Vorherige/Nächste Einheit Navigation unten
- Zurück zum Kurs Button

### 4. Access Control Logic (Client-Side Filtering)
- Erstelle einen Helper/Hook: `useUserAccess(userId)` oder Server-Side Utility
- Logik: 
  1. Lade alle access_grants für den User
  2. Für jeden Kurs/Modul/Einheit prüfen: Hat der User einen Grant?
  3. "Most specific rule wins": 
     - Unit-Grant (is_granted=true/false) > Module-Grant > Course-Grant
     - Kein Grant = kein Zugriff
- Verwende diese Logik sowohl im Dashboard (welche Kurse zeigen) als auch in der Kurs-Ansicht (welche Module/Einheiten zeigen)
- 403/Redirect wenn User versucht eine URL ohne Zugriff aufzurufen

### 5. Settings Page (/settings) – Vervollständigen
- Passwort ändern: Neues Passwort + Bestätigung
- Min. 8 Zeichen Validierung
- Profil-Info anzeigen (Name, Email) – read-only
- Success/Error Toast

### 6. Header & Navigation (Member)
- Header: Logo-Platzhalter links, "Meine Lehrgänge" Link, Settings, Logout
- Mobile: Hamburger Menu
- Aktiver Link hervorgehoben
- User-Name oder Avatar oben rechts mit Dropdown (Settings, Logout)

## Technische Anforderungen
- Server Components wo möglich (Data Fetching)
- Client Components nur wo Interaktivität nötig (Accordion, Navigation State)
- Canva Embed URLs NIEMALS direkt im Client-HTML exponieren → immer über API Route
- TypeScript strict mode
- Responsive (Desktop, Tablet, Mobile)
- Loading Skeletons für async Content
- Error Boundaries für fehlerhafte Content Blocks
- Git Commits: `feat(PLI-X): Beschreibung`

## Wichtig
- Teste nach jedem Feature ob `npm run build` fehlerfrei läuft
- Committe nach jedem abgeschlossenen Feature
- Am Ende: Ein Member kann sich einloggen, seine freigeschalteten Kurse sehen, einen Kurs öffnen, durch Module/Einheiten navigieren und Canva-Embeds + andere Inhalte anschauen.
