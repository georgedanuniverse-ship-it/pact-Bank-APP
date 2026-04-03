# 🏦 Pact Bank — Africa's Global Rise

<div align="center">

![Pact Bank](https://img.shields.io/badge/Pact_Bank-Africa's_Global_Rise-0a3d2e?style=for-the-badge&labelColor=0a3d2e&color=d4af37)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6.7-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=flat-square&logo=tailwindcss)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-4.24-purple?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)

**Prosper Africa Capital Trust (PACT) Bank** — A modern, secure, and fully responsive digital banking web application connecting African entrepreneurs with global capital.

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Seed Data & Test Accounts](#-seed-data--test-accounts)
- [Account Types](#-account-types)
- [API Routes](#-api-routes)
- [Authentication](#-authentication)
- [Branding & Design](#-branding--design)
- [Screenshots](#-screenshots)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌍 Overview

Pact Bank is a full-stack digital banking platform built with Next.js 14, designed to serve both **Personal** and **Corporate** banking customers across Africa. The application provides a comprehensive suite of banking features including multi-currency accounts, fund transfers, bill payments, payroll management, trade finance, and detailed financial reporting.

The platform emphasizes security, accessibility, and a premium user experience with a distinctive African identity through its branding and design language.

---

## ✨ Features

### 🔐 Authentication & Security
- **Dual Login Portals** — Separate Personal and Corporate login flows
- **Multi-step Corporate Signup** — Business information collection + admin credentials
- **Password Hashing** — bcrypt-based secure password storage
- **Session Management** — JWT-based sessions via NextAuth.js
- **Two-Factor Authentication (2FA)** — TOTP-based 2FA support
- **Activity Logging** — Complete audit trail of all user actions
- **Configurable Session Timeouts** — Per-user security preferences
- **Google SSO** — Optional Google sign-in for personal accounts

### 💰 Personal Banking
- **Dashboard** — Financial overview with balance, transaction stats, and charts
- **Multi-Currency Accounts** — USD, NGN, KES, ZAR support
- **Fund Transfers** — Internal, external, and international transfers
- **Bill Payments** — Pay electricity, airtime, cable TV, internet, and water bills
- **Beneficiary Management** — Save and manage frequent recipients
- **Transaction History** — Filterable, searchable, and exportable (CSV)
- **Bank Statements** — Monthly statement generation and download
- **Spending Analytics** — Interactive pie charts and balance trend lines
- **Profile Management** — Edit personal information and contact details

### 🏢 Corporate Banking
All personal features plus:
- **Business Dashboard** — Corporate financial overview with business metrics
- **Payroll Management** — Employee roster, salary tracking, payroll processing
- **Trade Finance** — Letters of Credit, Bank Guarantees, Import/Export Finance, Forex Services
- **Business Reports** — Quarterly financials, downloadable Income Statements, Cash Flow Reports, Balance Sheets, and Payroll Summaries
- **Business Profile** — Company details, Tax ID, Registration Number, industry classification
- **Multi-Currency Business Accounts** — Business Current (USD/NGN) and Fixed Deposits

### 📊 Charts & Analytics
- **Spending by Category** — Interactive pie chart (Recharts)
- **Balance Trend** — Historical line chart showing balance evolution
- **Corporate Expense Breakdown** — Business-specific spending analytics
- **Cash Flow Trend** — Corporate cash flow visualization

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5.2](https://www.typescriptlang.org/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) |
| **ORM** | [Prisma 6.7](https://www.prisma.io/) |
| **Authentication** | [NextAuth.js 4.24](https://next-auth.js.org/) |
| **Styling** | [Tailwind CSS 3.3](https://tailwindcss.com/) |
| **Charts** | [Recharts 2.15](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Forms** | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **State** | [Zustand](https://zustand-demo.pmnd.rs/), [Jotai](https://jotai.org/), [SWR](https://swr.vercel.app/) |
| **Package Manager** | [Yarn](https://yarnpkg.com/) |

---

## 📁 Project Structure

```
pact_bank_app/
└── nextjs_space/
    ├── app/
    │   ├── (auth)/                  # Auth pages (login, signup, reset-password)
    │   │   ├── login/page.tsx
    │   │   ├── signup/page.tsx
    │   │   └── reset-password/page.tsx
    │   ├── (dashboard)/             # Protected dashboard pages
    │   │   ├── layout.tsx           # Dashboard layout with sidebar + header
    │   │   ├── dashboard/page.tsx   # Main dashboard (personal/corporate)
    │   │   ├── transactions/page.tsx
    │   │   ├── transfers/page.tsx
    │   │   ├── bill-payments/page.tsx
    │   │   ├── beneficiaries/page.tsx
    │   │   ├── statements/page.tsx
    │   │   ├── profile/page.tsx
    │   │   ├── security/page.tsx
    │   │   ├── payroll/page.tsx          # Corporate only
    │   │   ├── trade-finance/page.tsx    # Corporate only
    │   │   └── reports/page.tsx          # Corporate only
    │   ├── api/                     # API routes
    │   │   ├── auth/[...nextauth]/route.ts
    │   │   ├── accounts/route.ts
    │   │   ├── transactions/route.ts
    │   │   ├── transfers/route.ts
    │   │   ├── beneficiaries/route.ts
    │   │   ├── bill-payments/route.ts
    │   │   ├── profile/route.ts
    │   │   ├── security/route.ts
    │   │   ├── signup/route.ts
    │   │   └── activity-logs/route.ts
    │   ├── components/              # App-level components
    │   │   ├── header.tsx
    │   │   ├── sidebar.tsx
    │   │   └── charts/
    │   │       ├── spending-chart.tsx
    │   │       └── balance-chart.tsx
    │   ├── globals.css
    │   ├── layout.tsx               # Root layout
    │   ├── page.tsx                 # Root redirect
    │   └── providers.tsx            # SessionProvider wrapper
    ├── components/                  # Shared UI components (shadcn/ui)
    │   └── ui/
    ├── hooks/
    │   └── use-toast.ts
    ├── lib/
    │   ├── auth.ts                  # NextAuth configuration
    │   ├── prisma.ts                # Prisma client singleton
    │   ├── utils.ts                 # Utility functions
    │   └── db.ts
    ├── prisma/
    │   └── schema.prisma            # Database schema
    ├── public/                      # Static assets
    ├── scripts/
    │   └── seed.ts                  # Database seeding script
    ├── types/
    │   └── next-auth.d.ts           # NextAuth type augmentation
    ├── .env                         # Environment variables (not committed)
    ├── next.config.js
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── postcss.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **Yarn** ≥ 1.22.x
- **PostgreSQL** ≥ 14.x (running locally or a cloud provider)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/georgedanuniverse-ship-it/pact-Bank-APP.git
   cd pact-Bank-APP
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database URL and NextAuth secret (see [Environment Variables](#-environment-variables)).

4. **Set up the database**
   ```bash
   # Generate Prisma client
   yarn prisma generate

   # Push schema to database
   yarn prisma db push

   # Seed with test data
   npx tsx scripts/seed.ts
   ```

5. **Start the development server**
   ```bash
   yarn dev
   ```

6. **Open in your browser**
   ```
   http://localhost:3000
   ```

---

## 🔑 Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/pactbank?schema=public"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"     # Your app URL

# Google OAuth (Optional — for Google SSO)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | ✅ | Secret for JWT encryption |
| `NEXTAUTH_URL` | ✅ | Application base URL |
| `GOOGLE_CLIENT_ID` | ❌ | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | ❌ | Google OAuth Client Secret |

---

## 🗄️ Database Setup

### Prisma Schema Models

| Model | Description |
|-------|-------------|
| `User` | User accounts with personal & corporate fields |
| `Account` | NextAuth.js OAuth account links |
| `Session` | Active user sessions |
| `VerificationToken` | Email verification tokens |
| `BankAccount` | Bank accounts (Savings, Current, Business Current, Fixed Deposit) |
| `Transaction` | All financial transactions (credits, debits, transfers, bill payments) |
| `Beneficiary` | Saved transfer recipients (internal, external, international) |
| `BillPayment` | Bill payment records |
| `ActivityLog` | Security audit trail |
| `SecuritySettings` | Per-user security preferences (2FA, session timeout) |

### Corporate User Fields

The `User` model includes these corporate-specific fields:
- `accountType` — `"personal"` or `"corporate"`
- `businessName` — Company name
- `businessPhone`, `businessEmail`, `businessAddress`, `businessWebsite`
- `taxId`, `registrationNumber`
- `country`, `industry`

### Common Commands

```bash
# View database in browser
yarn prisma studio

# Generate Prisma client after schema changes
yarn prisma generate

# Push schema changes to database
yarn prisma db push

# Reset database (⚠️ deletes all data)
yarn prisma db push --force-reset
```

---

## 🧪 Seed Data & Test Accounts

Run the seed script to populate the database with test data:

```bash
npx tsx scripts/seed.ts
```

### Test Accounts

| Account Type | Email | Password | Name | Details |
|:---:|-------|----------|------|--------|
| 👤 Personal | `john@doe.com` | `johndoe123` | John Doe | 3 accounts, 10+ transactions |
| 👤 Admin | `admin@pact-bank.com` | `admin123` | Admin User | Administrative access |
| 🏢 Corporate | `corporate@pact-bank.com` | `corporate123` | Ngozi Adeyemi | AfriTech Solutions Ltd |

### Corporate Test Data

**Company:** AfriTech Solutions Ltd  
**Industry:** Technology  
**Country:** Nigeria

| Account | Currency | Balance |
|---------|----------|---------|
| Business Current | USD | $875,000.00 |
| Business Current | NGN | ₦42,500,000.00 |
| Fixed Deposit | USD | $250,000.00 |

Includes 10 corporate transactions (payroll disbursements, client payments, office rent, AWS subscriptions, government contracts, etc.)

---

## 🏦 Account Types

### Personal Account

- Standard banking with Savings, Current, and Fixed Deposit accounts
- Spending analytics and balance trend charts
- Standard sidebar navigation
- Simple profile with personal information

### Corporate Account

- Business-focused dashboard with corporate badge
- Business Current accounts (multi-currency)
- **Payroll Module** — Employee management, salary tracking, payroll processing
- **Trade Finance** — Letters of Credit, Bank Guarantees, Import/Export Finance, Forex
- **Business Reports** — Quarterly financials, downloadable statements
- Extended sidebar with corporate-specific navigation
- Business Profile with Tax ID, Registration Number, and company details
- Corporate users see gold-accented Building2 avatar icon

---

## 🔌 API Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/[...nextauth]` | NextAuth.js handler | — |
| `POST` | `/api/signup` | User registration (personal & corporate) | ❌ |
| `GET` | `/api/accounts` | Fetch user bank accounts | ✅ |
| `GET` | `/api/transactions` | Fetch transactions (with filters) | ✅ |
| `POST` | `/api/transfers` | Process money transfer | ✅ |
| `GET/POST/DELETE` | `/api/beneficiaries` | Manage beneficiaries | ✅ |
| `GET/POST` | `/api/bill-payments` | Bill payments | ✅ |
| `GET/PUT` | `/api/profile` | User profile management | ✅ |
| `GET/PUT` | `/api/security` | Security settings (2FA, timeouts) | ✅ |
| `GET` | `/api/activity-logs` | Security audit logs | ✅ |

### Query Parameters (Transactions)

| Parameter | Type | Description |
|-----------|------|-------------|
| `accountId` | string | Filter by specific bank account |
| `type` | string | Filter by type (credit, debit, transfer, bill_payment) |
| `startDate` | ISO date | Filter from date |
| `endDate` | ISO date | Filter to date |
| `limit` | number | Limit number of results |

---

## 🔒 Authentication

### Flow

1. User selects **Personal** or **Corporate** on the login page
2. Credentials are validated against the database (bcrypt hash comparison)
3. JWT token is issued containing `userId`, `email`, `name`, `accountType`, `businessName`
4. Session is available application-wide via `useSession()` hook
5. Dashboard layout redirects unauthenticated users to `/login`
6. Corporate-only pages redirect personal users to `/dashboard`

### Session Object

```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
    accountType: "personal" | "corporate";
    businessName?: string;  // Corporate only
  }
}
```

---

## 🎨 Branding & Design

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Deep Forest Green** | `#0a3d2e` | Primary — Headers, sidebar, buttons |
| **Gold / Brass** | `#d4af37` | Accent — Highlights, corporate badge, CTAs |
| **Cream** | `#fbf8f3` | Background — Page backgrounds |
| **Sage** | `#5c7068` | Secondary — Muted text, borders |

### Typography

| Font | Usage |
|------|-------|
| **Space Grotesk** | Headings, logos, emphasis |
| **Poppins** | Body text, forms, labels |

### Design Principles

- **Premium Feel** — Clean layouts with generous whitespace
- **African Identity** — Branding reflects Pan-African pride and heritage
- **Responsive** — Fully functional on mobile, tablet, and desktop
- **Accessible** — High contrast, clear hierarchy, descriptive labels
- **Consistent** — Unified design language across all pages

---

## 📸 Screenshots

### Login Page
Dual account type selector with Personal and Corporate tabs. Left panel features branded imagery with contextual messaging.

### Personal Dashboard
Financial overview with total balance, transaction stats, quick actions, spending pie chart, and balance trend line.

### Corporate Dashboard
Business overview with payroll summary, trade finance stats, quarterly reports, and extended quick actions.

### Payroll Management (Corporate)
Employee roster, monthly payroll costs, department breakdown, and payroll history.

### Trade Finance (Corporate)
Letters of Credit, Bank Guarantees, Import/Export Finance, Forex Services with activity tracking.

### Business Reports (Corporate)
Q1 financial summary, downloadable reports, and monthly revenue/expense/income table.

---

## 🚢 Deployment

### Build for Production

```bash
yarn build
```

### Production Start

```bash
yarn start
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Make sure to configure all [environment variables](#-environment-variables) in your deployment platform.

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn prisma generate
RUN yarn build
EXPOSE 3000
CMD ["yarn", "start"]
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

<div align="center">

**Built with ❤️ for Africa's Global Rise**

🌍 *Connecting African entrepreneurs with global capital — secure, transparent banking that bridges continents.*

</div>
