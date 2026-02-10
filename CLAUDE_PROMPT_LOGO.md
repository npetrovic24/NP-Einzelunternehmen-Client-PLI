# Claude Code Task: PLI Lernportal – Logo Integration

## Repo: `/root/.openclaw/workspace/projects/pli-portal/`

## Aufgabe
Das echte PLI Logo liegt jetzt als SVG in 3 Varianten im `public/` Ordner:
- `/logo-white.svg` – weißes Logo (für Teal/dunkle Hintergründe)
- `/logo-teal.svg` – Teal-Logo #0099A8 (für weiße/helle Hintergründe)
- `/logo-black.svg` – schwarzes Logo (Original)

Ersetze ÜBERALL im Portal die "PLI" Text-Platzhalter (die kleinen Teal-Boxen mit "PLI" Text) durch das echte Logo.

## Wo das Logo verwendet wird:

### 1. Login Page (`src/app/login/page.tsx`)
- Aktuell: `<div className="... bg-primary text-... font-bold">PLI</div>` als Logo-Platzhalter
- Neu: `<img src="/logo-teal.svg" alt="PLI Logo" />` auf der rechten (weißen) Seite
- Auf der linken Teal-Gradient-Seite (Desktop): `/logo-white.svg`
- Größe: ca. h-16 bis h-20 (64-80px Höhe), width auto

### 2. Member Header (`src/components/member-header.tsx`)
- Aktuell: `<div className="flex h-8 w-8 ... bg-primary ...">PLI</div>` 
- Neu: `<img src="/logo-teal.svg" alt="PLI" className="h-8 w-auto" />`
- Auch im Mobile Sheet/Drawer das Logo ersetzen

### 3. Admin Sidebar (`src/components/admin-sidebar.tsx`)
- Aktuell: `<div className="flex h-9 w-9 ... bg-primary ...">PLI</div>`
- Neu: `<img src="/logo-teal.svg" alt="PLI" className="h-9 w-auto" />`

### 4. Admin Mobile Sidebar (`src/components/admin-sidebar-mobile.tsx`)
- Gleich wie Admin Sidebar: Logo ersetzen

### 5. App Header (`src/components/app-header.tsx`)
- Falls dort auch ein PLI-Platzhalter ist: ersetzen

## Design-Regeln
- Logo immer mit `w-auto` (Seitenverhältnis beibehalten)
- Auf weißem/hellem Hintergrund: `/logo-teal.svg`
- Auf Teal/dunklem Hintergrund: `/logo-white.svg`
- Neben dem Logo kann "Lernportal" als Text stehen (wie bisher)
- Login: Logo größer (h-16 bis h-20)
- Header/Sidebar: Logo kleiner (h-8 bis h-9)

## Technische Regeln
- Nutze einfache `<img>` Tags oder Next.js `<Image>` (mit width/height props)
- Wenn Next.js Image: unoptimized={true} für SVGs setzen (oder img Tag nutzen)
- TypeScript strict
- `npm run build` muss fehlerfrei durchlaufen
- Git Commit: `style: integrate real PLI logo`
