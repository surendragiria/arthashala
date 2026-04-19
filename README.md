# Arthashala

Loan intermediation platform for small and mid-sized corporate borrowers. Facilitates business loans from ₹50 Lakhs to ₹30 Crores, secured or unsecured.

## Modules

- **Lead Origination and Management** — Direct leads and associate-referred leads with full pipeline tracking
- **Borrower / Client Module** — Application form, document upload, status tracking
- **Back Office Module** — Admin dashboard, lender submissions, associate management, reporting
- **Associate Module** — Referral tracking, commission visibility

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for production

```bash
npm run build
```

## Deployment

Deploy to Vercel by connecting this repo — Vite is auto-detected. Zero configuration.

## Demo credentials

- **Back Office**: `admin@arthashala.in` / `admin123`
- **Associate**: `priya@arthashala.in` / `demo1234`
- **Borrower**: `sunil@meridian.in` / `demo1234`

Or create a new account from the sign-in screen.

## Stack

React 18, Vite, Tailwind CSS v4, Lucide icons. Data persisted to browser localStorage (prototype). Replace with a proper backend before production use.
