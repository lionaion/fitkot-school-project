# FitKot — Train in je kot

Fitness tracking web app voor Vlaamse studenten die trainen in kleine ruimtes ("kot") zonder materiaal. Maandelijks abonnement: €5/maand. Drie gebruikersrollen: User, Trainer, Admin.

---

## Inhoudsopgave

- [Demo modus (snel starten)](#demo-modus-snel-starten)
- [Volledige app setup](#volledige-app-setup)
- [Projectstructuur](#projectstructuur)
- [Beschikbare scripts](#beschikbare-scripts)
- [Modules](#modules)
- [Tech stack](#tech-stack)
- [Team](#team)

---

## Demo modus (snel starten)

De demo modus draait volledig lokaal **zonder Supabase, AWS, of andere externe services**. Alle pagina's gebruiken mock data en authenticatie wordt overgeslagen.

### Vereisten

- Node.js 18+ (aanbevolen: 20+)
- npm 9+

### Stappen

```bash
# 1. Clone de repository
git clone https://github.com/lionaion/fitkot-school-project.git
cd fitkot-school-project

# 2. Installeer dependencies
npm install

# 3. Start de dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser.

### Navigatie

Op de homepage kies je een rol om de app te verkennen:

| Knop | Rol | Wat je ziet |
|------|-----|-------------|
| **Student (User)** | Gebruiker | Dashboard, workouts, voortgang, voeding |
| **Trainer** | Trainer | Trainer dashboard, clienten, trainingsplannen |
| **Admin** | Admin | Gebruikersbeheer, rolbeheer, statistieken |

### Wat werkt in demo modus

- Alle 20 routes zijn toegankelijk zonder login
- Formulieren (workout loggen, plan aanmaken, maaltijd loggen) simuleren opslaan
- Admin kan rollen en statussen wijzigen (lokaal in-memory)
- Trainer kan clienttoewijzingen beheren (lokaal in-memory)
- Foto-upload UI is zichtbaar (uploaden zelf vereist S3)

---

## Volledige app setup

De volledige versie gebruikt Supabase voor authenticatie en database, AWS S3 voor foto-opslag, en optioneel Resend voor 2FA e-mails.

### Vereisten

- Node.js 18+ (aanbevolen: 20+)
- npm 9+
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`npm install -g supabase`)
- Docker (voor lokale Supabase)
- AWS account (voor S3 foto-opslag)
- Optioneel: [Resend](https://resend.com) account (voor 2FA e-mails)

### 1. Clone en installeer

```bash
git clone https://github.com/lionaion/fitkot-school-project.git
cd fitkot-school-project
npm install
```

### 2. Omgevingsvariabelen

```bash
cp .env.local.example .env.local
```

Vul de waarden in:

| Variabele | Beschrijving | Waar te vinden |
|-----------|-------------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | [Supabase Dashboard](https://supabase.com/dashboard) > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Zelfde locatie |
| `AWS_S3_BUCKET` | S3 bucket naam voor foto's | AWS Console > S3 |
| `AWS_S3_REGION` | AWS regio (bijv. `eu-west-1`) | AWS Console > S3 |
| `AWS_ACCESS_KEY_ID` | AWS access key | AWS Console > IAM |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | AWS Console > IAM |
| `RESEND_API_KEY` | Resend API key (voor 2FA) | [Resend Dashboard](https://resend.com/api-keys) |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN (error monitoring) | [Sentry](https://sentry.io) > Project Settings |
| `NEXT_PUBLIC_APP_URL` | App URL | `http://localhost:3000` voor lokaal |

### 3. Supabase database

#### Optie A: Lokale Supabase (aanbevolen voor development)

```bash
# Start lokale Supabase (vereist Docker)
npx supabase start

# Pas de migratie toe
npx supabase db push

# Genereer TypeScript types
npx supabase gen types typescript --local > src/types/database.ts
```

De lokale Supabase draait op `http://127.0.0.1:54321`. Update je `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key uit supabase start output>
```

#### Optie B: Remote Supabase

1. Maak een project aan op [supabase.com](https://supabase.com)
2. Kopieer de URL en anon key naar `.env.local`
3. Push de migratie:
   ```bash
   npx supabase link --project-ref <je-project-ref>
   npx supabase db push
   ```

### 4. AWS S3 bucket

1. Maak een S3 bucket aan (bijv. `fitkot-photos`) in regio `eu-west-1`
2. Configureer CORS op de bucket:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["PUT", "GET"],
       "AllowedOrigins": ["http://localhost:3000"],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```
3. Maak een IAM user aan met `s3:PutObject` en `s3:GetObject` permissions
4. Vul de credentials in `.env.local`

### 5. OAuth providers (Google & GitHub)

#### Google

1. Ga naar [Google Cloud Console](https://console.cloud.google.com) > APIs & Services > Credentials
2. Maak een OAuth 2.0 Client ID aan
3. Authorized redirect URI: `https://<je-supabase-project>.supabase.co/auth/v1/callback`
4. Voeg de Client ID en Secret toe in Supabase Dashboard > Authentication > Providers > Google

#### GitHub

1. Ga naar [GitHub Developer Settings](https://github.com/settings/developers) > OAuth Apps
2. Maak een nieuwe OAuth App aan
3. Authorization callback URL: `https://<je-supabase-project>.supabase.co/auth/v1/callback`
4. Voeg de Client ID en Secret toe in Supabase Dashboard > Authentication > Providers > GitHub

### 6. Start de app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 7. Production build

```bash
npm run build
npm start
```

---

## Projectstructuur

```
fitkot-school-project/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Login & registratie
│   │   ├── (user)/          # Student pagina's (dashboard, workouts, voortgang, voeding)
│   │   ├── (trainer)/       # Trainer pagina's (dashboard, clienten, plannen)
│   │   ├── (admin)/         # Admin pagina's (gebruikers, rollen, statistieken)
│   │   ├── api/             # API routes (auth callback, upload, photos)
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Homepage
│   ├── components/
│   │   ├── ui/              # Gedeelde UI componenten (Button, Card, Input, Nav, AppShell)
│   │   ├── workout/         # Workout componenten (PhotoUpload, MealLogForm)
│   │   ├── trainer/         # Trainer componenten
│   │   └── admin/           # Admin componenten (UserManagementTable, TrainerAssignments)
│   ├── lib/
│   │   ├── supabase/        # Supabase client (server, client, middleware)
│   │   ├── s3/              # S3 upload helpers
│   │   └── utils/           # Gedeelde utilities (cn)
│   └── types/
│       └── database.ts      # Database types (11 tabellen)
├── supabase/
│   ├── migrations/          # SQL migraties
│   └── seed.sql             # Test data
├── .github/workflows/
│   └── ci.yml               # GitHub Actions CI/CD
├── .env.local.example       # Voorbeeld omgevingsvariabelen
├── CLAUDE.md                # AI assistentie-instructies
└── package.json
```

---

## Beschikbare scripts

| Script | Commando | Beschrijving |
|--------|----------|-------------|
| Dev server | `npm run dev` | Start development server op localhost:3000 |
| Build | `npm run build` | Production build |
| Start | `npm start` | Start production server |
| Lint | `npm run lint` | ESLint controle |
| Test | `npm test` | Run test suite |

---

## Modules

| Module | Verantwoordelijkheid | Rol(len) |
|--------|---------------------|----------|
| M1 Auth | OAuth login (Google/GitHub), 2FA, sessies, RBAC | Alle |
| M2 Workouts | Workouts loggen, geschiedenis, trainingsplannen bekijken | User |
| M3 Voortgang | Foto's, notities, streaks, statistieken | User |
| M4 Voeding | Dieetplannen, maaltijden loggen, macro's bijhouden | User, Trainer |
| M5 Trainer Tools | Plannen maken/bewerken, clienten monitoren, live feed | Trainer |
| M6 Admin Panel | Gebruikersbeheer, rolbeheer, platformstatistieken | Admin |
| M7 Infrastructuur | DB schema, API laag, S3, CI/CD, Sentry | Developer |

---

## Tech stack

- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **Database:** Supabase (PostgreSQL + Auth + Realtime)
- **Opslag:** AWS S3 (voortgangsfoto's via presigned URLs)
- **Hosting:** Railway
- **CI/CD:** GitHub Actions
- **E-mail/2FA:** Resend
- **Error monitoring:** Sentry
- **Betalingen:** Stripe (toekomstige fase)

---

## Team

| Lid | Modules | Focus |
|-----|---------|-------|
| Mats | M1 + M7 | Auth + Infrastructuur |
| Thomas | M2 + M3 | Workout + Voortgang |
| Stan | M4 + M5 + M6 | Voeding + Trainer + Admin |
