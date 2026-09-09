# חולצ׳יק - Chulchik Travel Insurance Comparison

Welcome to the Chulchik travel insurance comparison engine! This project is a Next.js application designed to run perfectly on Vercel and GitHub.

## How to Run Locally

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How the Pricing Engine Works

The pricing engine is completely isolated from the UI to ensure accurate, easily maintainable calculations.
- **Engine Location:** `lib/insurance/pricing-engine.ts`
- **Flow:** When the user clicks "Compare", the form sends `TripDetails` and an array of `Traveler` objects to the pricing engine. The engine iterates over every active insurance company.
- **Rules Handling:** The engine multiplies the calculated daily base rate by the number of trip days, factoring in edge-cases like marginal duration changes (e.g., Harel's day 1-14 vs day 15+), USA destinations, and maximum caps for coverages (e.g. max $15 for Cancellation).
- **Missing Data:** If a company does not have pricing for a specific edge-case (e.g. age 80 in the USA for 40 days), the engine marks the result as `needs_review` or `unavailable`.

## Where Insurance Tariff Data Lives

The authoritative pricing rules are stored as structured configuration objects inside:
- `lib/insurance/data/`

Inside this folder, you will find files for each insurance company (e.g., `migdal.ts`, `harel.ts`, `phoenix.ts`). 

## How to Add/Edit a Tariff

To edit an existing tariff, open the company's file in `lib/insurance/data/`.
For example, to change Migdal's base rate for ages 0-17:
1. Open `lib/insurance/data/migdal.ts`.
2. Locate the `calculateBaseCost` function.
3. Update the condition: `if (age >= 0 && age <= 17) daily = isUSA ? 2.9 : 2.0;`

## How to Add a New Company

1. Create a new file in `lib/insurance/data/` (e.g., `shirbit.ts`).
2. Export a `CompanyPricingConfig` object containing the `id`, `name`, `websiteUrl`, `calculateBaseCost` function, and `coverages` object.
3. Open `lib/insurance/companies.ts`.
4. Import your new company and add it to the `insuranceCompanies` array.

## How to Deploy to Vercel

The architecture is already 100% Vercel-compatible. To deploy:
1. Push this code to a new repository on your GitHub account.
   ```bash
   git remote add origin https://github.com/your-username/chulchik.git
   git push -u origin main
   ```
2. Log into [Vercel](https://vercel.com/) and click "Add New Project".
3. Select your GitHub repository.
4. Vercel will automatically detect that this is a Next.js project. Click **Deploy**.
