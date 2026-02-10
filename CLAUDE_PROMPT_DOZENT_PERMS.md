# Claude Code Task: PLI Lernportal – Dozenten-Berechtigungen

## Repo: `/root/.openclaw/workspace/projects/pli-portal/`

## Aufgabe
Dozenten sollen Teilnehmer anlegen können, aber KEINE Admins oder andere Dozenten.

### 1. Middleware (`src/lib/supabase/middleware.ts`)
- Admin-Routen: `admin` UND `dozent` dürfen auf `/admin/members` zugreifen
- Aber NUR `admin` darf auf `/admin/courses`, `/admin/courses/*`, und `/admin` (Dashboard) zugreifen
- Dozent auf `/admin` → redirect zu `/admin/members`
- Dozent auf `/admin/courses/*` → redirect zu `/admin/members`

### 2. Admin Sidebar (`src/components/admin-sidebar.tsx` + `admin-sidebar-mobile.tsx`)
- Prüfe die Rolle des Users
- Wenn `dozent`: Zeige NUR "Benutzer" im Menü (kein "Dashboard", kein "Lehrgänge")
- Wenn `admin`: Zeige alles wie bisher
- Dafür muss die Sidebar die Rolle kennen → übergib sie als Prop oder lade sie serverseitig

### 3. Members Page (`src/app/(admin)/admin/members/members-client.tsx`)
- Übergib die aktuelle User-Rolle als Prop
- Wenn `dozent`: 
  - Rollen-Dropdown beim Erstellen AUSBLENDEN → Rolle ist automatisch `participant`
  - "Rolle ändern" im Edit-Dialog AUSBLENDEN
  - Admins und andere Dozenten in der Liste NICHT anzeigen (nur Teilnehmer)
  - Kein "Zugriff verwalten" Button (das bleibt Admin-only)

### 4. Server Action (`src/lib/actions/members.ts`)
- `createMember`: Wenn der aufrufende User `dozent` ist, erzwinge `role = 'participant'` (ignoriere andere Werte)
- `updateMember`: Dozent darf NUR Teilnehmer bearbeiten, nicht Admins/Dozenten

### 5. Admin Layout (`src/app/(admin)/layout.tsx`)
- Lade die Rolle des Users und übergib sie an die Sidebar-Komponenten
- Dozenten sehen den Header mit "Benutzer verwalten" statt "Administration"

### 6. Admin Dashboard (`src/app/(admin)/admin/page.tsx`)
- Wenn `dozent`: Redirect zu `/admin/members` (Dozenten brauchen kein Dashboard)

## Technische Regeln
- TypeScript strict
- `npm run build` muss fehlerfrei durchlaufen
- Git Commit: `feat: dozent can manage participants`
