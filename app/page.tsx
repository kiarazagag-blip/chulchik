"use client";

import { useState } from "react";
import { InsuranceForm } from "@/components/insurance/InsuranceForm";
import { InsuranceResults } from "@/components/insurance/InsuranceResults";
import { TripDetails, Traveler, CalculationResult } from "@/lib/insurance/types";
import { insuranceCompanies } from "@/lib/insurance/companies";
import { calculateCompanyPrice } from "@/lib/insurance/pricing-engine";
import { Plane } from "lucide-react";

export default function ChulchikPage() {
  const [results, setResults] = useState<CalculationResult[] | null>(null);

  const handleCalculate = (trip: TripDetails, travelers: Traveler[]) => {
    // Run the calculation engine for all configured companies
    const calculated = insuranceCompanies.map((company) =>
      calculateCompanyPrice(company, trip, travelers)
    );
    setResults(calculated);
    
    // Optional: Scroll down to results smoothly
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-brand-gray pb-24">
      {/* Header */}
      <header className="bg-brand-blue text-white py-6 shadow-md mb-8">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-3">
          <Plane className="w-8 h-8 rtl:-scale-x-100" />
          <h1 className="text-3xl font-black tracking-tight">חולצ׳יק</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-black mb-2">
            השוואת ביטוחי נסיעות לחו"ל
          </h2>
          <p className="text-gray-500">
            הזן את פרטי הנסיעה שלך ותן לנו למצוא עבורך את הביטוח המשתלם והמתאים ביותר, במינימום מאמץ.
          </p>
        </div>

        <InsuranceForm onCalculate={handleCalculate} />

        {results && (
          <div className="mt-12">
            <InsuranceResults results={results} />
          </div>
        )}
      </main>
    </div>
  );
}
