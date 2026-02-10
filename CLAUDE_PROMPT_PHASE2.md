# Claude Code Task: PLI Lernportal – Phase 2 Admin Panel

## Kontext
Phase 1 ist fertig: Next.js 15 + Supabase + shadcn/ui, Auth, Layouts, Skeleton-Seiten.
Repo: `/root/.openclaw/workspace/projects/pli-portal/pli-portal/`
Lies ZUERST die Feature-Specs in `../../features/` (PLI-2 bis PLI-6) und `../../ARCHITECTURE.md`.

Die Datenbank ist bereits eingerichtet (6 Tabellen mit RLS Policies, Trigger, Indexes).

Supabase Credentials stehen in `.env.local`:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY  
- SUPABASE_SERVICE_ROLE_KEY (für Admin-Operationen wie User anlegen)

## CI / Design
- Primary/Teal: #0099A8
- Background: #FFFFFF
- Text: #333333
- Secondary BG: #F5F5F5
- Font: Inter
- Stil: Swiss-clean, minimal, professionell
- shadcn/ui Components nutzen und im CI stylen

## Phase 2 Tasks (in dieser Reihenfolge)

### 1. Mitglieder-Verwaltung (PLI-2: /admin/members)
- Tabelle mit allen Mitgliedern (Name, Email, Status, letzte Aktivität)
- "Neues Mitglied" Dialog: Name, Email, Passwort (min. 8 Zeichen)
- User-Erstellung via Supabase Auth Admin API (service_role key) → Server Action / API Route
- Toggle-Switch Aktivieren/Deaktivieren (deaktivierte ausgegraut)
- "Passwort zurücksetzen" Button → generiert neues Passwort, zeigt es in Dialog an
- Suchfeld/Filter (Name oder Email)
- Mitglieder-Anzahl oben
- Admin kann sich selbst NICHT deaktivieren
- Duplikat-Email → Fehlermeldung

### 2. Lehrgang-Verwaltung (PLI-3: /admin/courses)
- Card-Grid mit allen Lehrgängen (Thumbnail, Name, Beschreibung, Status-Badge, Module-Anzahl)
- "Neuer Lehrgang" Dialog: Name, Beschreibung, Thumbnail-URL, Kategorie-Tags
- Inline-Editing oder Edit-Dialog für bestehende Lehrgänge
- Aktivieren/Deaktivieren Toggle
- Sortierung per Drag & Drop ODER sort_order Feld
- Klick auf Lehrgang → /admin/courses/[id] Detail-Ansicht

### 3. Module & Einheiten (PLI-4: /admin/courses/[id])
- Detail-Seite eines Lehrgangs mit Modulen und Einheiten
- Module als ausklappbare Sektionen (Accordion)
- "Neues Modul" / "Neue Einheit" Buttons
- Einheiten können direkt einem Modul ODER direkt dem Lehrgang zugeordnet werden
- Sortierung innerhalb von Modulen
- Klick auf Einheit → /admin/courses/[courseId]/units/[unitId] (Content Editor)

### 4. Content Editor (PLI-5: /admin/courses/[courseId]/units/[unitId])
- Block-basierter Editor für eine Einheit
- Block-Typen:
  - **canva_embed**: URL-Eingabe, Vorschau als iframe (URL wird über API Route geladen, nicht direkt im HTML)
  - **text**: Rich-Text oder Markdown Textarea
  - **file**: Datei-Upload (Supabase Storage) mit Download-Link Vorschau
  - **link**: URL + Titel
- Blöcke sortierbar (Drag & Drop oder Up/Down Buttons)
- "Block hinzufügen" Button mit Typ-Auswahl
- Blöcke löschen (mit Bestätigung)
- Auto-Save oder expliziter "Speichern" Button

### 5. Zugriffssteuerung (PLI-6: /admin/access)
- Matrix-View: Zeilen = Mitglieder, Spalten = Lehrgänge
- Checkbox/Toggle pro Zelle (Zugang gewähren/entziehen)
- Klick auf Lehrgang-Header → Drill-down zu Modul/Einheiten-Level
- Granulare Steuerung: Zugriff auf Lehrgang, Modul ODER einzelne Einheit
- "Most specific rule wins": Unit-Grant überschreibt Module-Grant überschreibt Course-Grant
- Bulk-Aktionen: "Zugriff für alle Mitglieder" Toggle pro Lehrgang
- Neue Mitglieder bekommen KEINEN automatischen Zugriff

### 6. Passwort ändern (/settings)
- Formular: Neues Passwort + Bestätigung
- Min. 8 Zeichen Validierung
- Success/Error Toast

## Technische Anforderungen
- ALLE Supabase Auth Admin-Operationen (User erstellen, Passwort setzen) über **Server Actions oder API Routes** mit service_role key
- Client-seitig NUR mit anon key arbeiten (RLS-geschützt)
- TypeScript strict mode
- Fehlerbehandlung: Alle API Calls mit try/catch, User-freundliche Fehlermeldungen via Toast
- Loading States für alle async Operationen
- Responsive Design (Desktop + Tablet + Mobile)
- Git Commits: `feat(PLI-X): Beschreibung`

## Reihenfolge
Arbeite die Tasks in der angegebenen Reihenfolge ab. Committe nach jedem abgeschlossenen Feature.
Teste nach jedem Schritt ob der Build (`npm run build`) fehlerfrei durchläuft.
