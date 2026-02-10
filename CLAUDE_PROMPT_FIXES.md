# Claude Code Task: PLI Lernportal – Quick Fixes

## Repo: `/root/.openclaw/workspace/projects/pli-portal/`

## Fix 1: Admin kann alle Kurse von innen sehen (Preview)

Aktuell sieht der Admin nur das Admin-Panel. Er braucht eine Möglichkeit, die Kursinhalte wie ein Mitglied zu sehen.

### Lösung:
- In der Access-Control Logik (`src/lib/access.ts`): **Admins bekommen automatisch Zugriff auf ALLE Kurse** – sie brauchen keinen expliziten access_grant. Prüfe die `role` in der `profiles` Tabelle.
- Auf der Admin Kurs-Detail-Seite (`/admin/courses/[id]`): Füge einen **"Vorschau" Button** hinzu der zu `/courses/[id]` linkt (öffnet die Member-Ansicht). Button mit Eye-Icon.
- Im Member-Layout: Wenn der User ein Admin ist, zeige einen kleinen Banner/Link oben: "Zurück zur Admin-Ansicht" → `/admin`
- Das Member Dashboard (`/dashboard`) soll für Admins ALLE aktiven Kurse zeigen (nicht nur die mit access_grant).

### Wichtig:
- Admins brauchen KEINEN access_grant um Kurse/Units zu sehen
- Die Access-Logik muss für Admins bypassed werden
- Die Embed-API Route (`/api/embed-url/[blockId]`) muss Admins ebenfalls durchlassen

## Fix 2: Kunden-Freischaltung besser sichtbar machen

Die Access-Control Seiten existieren bereits (`/admin/courses/[id]/access` und `/admin/members/[id]/access`), aber sie sind im UI nicht gut auffindbar.

### Lösung:
- Auf `/admin/members`: Füge pro Mitglied einen **"Zugriff verwalten" Button/Link** hinzu (Key/Shield Icon), der zu `/admin/members/[id]/access` führt
- Auf `/admin/courses`: Füge pro Kurs einen **"Zugriff verwalten" Button/Link** hinzu, der zu `/admin/courses/[id]/access` führt
- Auf der Admin-Kurs-Detail-Seite (`/admin/courses/[id]`): Füge einen prominenten **"Zugriff verwalten" Tab/Button** hinzu
- Die Access-Seiten selbst: Stelle sicher dass sie funktionieren und gut aussehen:
  - `/admin/courses/[id]/access`: Zeigt alle Mitglieder mit Toggle (Zugriff ja/nein) für diesen Kurs
  - `/admin/members/[id]/access`: Zeigt alle Kurse mit Toggle (Zugriff ja/nein) für dieses Mitglied

## Technische Regeln
- TypeScript strict
- `npm run build` muss fehlerfrei durchlaufen
- Git Commit: `fix: admin preview + access control visibility`
