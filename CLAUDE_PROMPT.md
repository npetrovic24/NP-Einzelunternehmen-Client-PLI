# Claude Code Task: PLI Lernportal – Phase 1 Foundation

## Kontext
Wir bauen ein Lernportal für "Praxis für Lösungs-Impulse AG" (Schweizer Coaching-Institut).
Alle Feature-Specs liegen in `/root/.openclaw/workspace/projects/pli-portal/features/`.
Lies ZUERST: SPEC.md, ARCHITECTURE.md, dann PLI-1 bis PLI-9.

## Phase 1 Tasks

### 1. GitHub Repo erstellen
- Repo: `npetrovic24/pli-portal` (public)
- Beschreibung: "Lernportal für Praxis für Lösungs-Impulse AG"

### 2. Next.js 15 Projekt aufsetzen
- `npx create-next-app@latest pli-portal --typescript --tailwind --eslint --app --src-dir`
- shadcn/ui installieren: `npx shadcn@latest init`
- Packages: @supabase/supabase-js, @supabase/ssr, lucide-react, sonner
- Tailwind Config mit PLI CI Farben:
  - Primary/Teal: #0099A8
  - Background: #FFFFFF
  - Text: #333333
  - Secondary BG: #F5F5F5
- Font: Inter (Google Fonts)

### 3. Supabase Setup
- Erstelle ein neues Supabase-Projekt "pli-portal" (oder nutze die CLI)
- SQL Migration für alle Tabellen aus ARCHITECTURE.md:
  - profiles (id, email, full_name, role, is_active, created_at)
  - courses (id, name, description, thumbnail_url, category_tags, is_active, sort_order, created_at)
  - modules (id, course_id, name, sort_order, created_at)
  - units (id, course_id, module_id nullable, name, sort_order, created_at)
  - content_blocks (id, unit_id, type, content jsonb, sort_order, created_at)
  - access_grants (id, user_id, course_id nullable, module_id nullable, unit_id nullable, is_granted, created_at)
- Row Level Security für ALLE Tabellen
- Trigger: profiles Auto-Erstellung bei Auth Signup

### 4. Authentication (PLI-1)
- Login-Seite (/login) mit Email + Passwort
- PLI CI Design (Teal, Weiss, Logo-Platzhalter)
- Supabase Auth Integration
- Middleware für Route Protection:
  - /dashboard/* → nur eingeloggte User
  - /admin/* → nur role=admin
  - Redirect auf /login wenn nicht eingeloggt
- Logout-Funktionalität
- WICHTIG: window.location.href nach Login (kein router.push)

### 5. Layout & CI (PLI-9)
- Admin-Layout: Sidebar links (Dashboard, Mitglieder, Lehrgänge) + Header
- Mitglieder-Layout: Clean Header + Content-Bereich
- Login-Layout: Zentriert, Logo oben
- Responsive: Desktop (Sidebar), Tablet (kompakt), Mobile (Hamburger)
- shadcn/ui Components im PLI CI gestylt
- Toast-Notifications (sonner)

### 6. Basis-Seiten (Skeleton)
- /login → Login-Formular
- /dashboard → "Meine Lehrgänge" (Platzhalter)
- /admin → Admin Dashboard (Platzhalter)
- /admin/members → Mitglieder-Liste (Platzhalter)
- /admin/courses → Lehrgänge (Platzhalter)
- /settings → Passwort ändern (Platzhalter)

## Wichtig
- TypeScript strict mode
- ESLint + Prettier
- Alle Components nutzen shadcn/ui wo möglich
- Kein Code ohne RLS auf Supabase
- Git Commits mit konventionellem Format: feat(PLI-X): ...
- Environment Variables in .env.local (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)

## Output
Am Ende soll ein funktionierender Login-Flow existieren:
1. User geht auf /login
2. Loggt sich ein
3. Admin → /admin Dashboard mit Sidebar
4. Mitglied → /dashboard mit Header
5. Logout → zurück zu /login
