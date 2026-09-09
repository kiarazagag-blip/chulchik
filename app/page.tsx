"use client";

import { useState } from "react";
import { SearchBar } from "@/components/insurance/SearchBar";
import { InsuranceResults } from "@/components/insurance/InsuranceResults";
import { TripDetails, Traveler, CalculationResult } from "@/lib/insurance/types";
import { insuranceCompanies } from "@/lib/insurance/companies";
import { calculateCompanyPrice } from "@/lib/insurance/pricing-engine";
import { Phone } from "lucide-react";

export default function ChulchikPage() {
  const [results, setResults] = useState<CalculationResult[] | null>(null);
  const [lastSearch, setLastSearch] = useState<{trip: TripDetails, travelers: Traveler[]} | null>(null);

  const handleCalculate = (trip: TripDetails, travelers: Traveler[]) => {
    const calculated = insuranceCompanies.map((company) =>
      calculateCompanyPrice(company, trip, travelers)
    );
    setResults(calculated);
    setLastSearch({ trip, travelers });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navbar */}
      <header className="border-b border-gray-100 py-4 px-8 flex justify-between items-center bg-white z-50 relative">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-400">
            <Phone className="w-5 h-5" />
          </div>
          <span className="font-bold text-gray-700">03.5444425</span>
        </div>
        
        <nav className="hidden md:flex gap-6 text-sm font-bold text-gray-600">
          <a href="#" className="hover:text-[#57aaed] transition">ביטוח נסיעות למדינות...</a>
          <a href="#" className="hover:text-[#57aaed] transition">כיסויים עיקריים</a>
          <a href="#" className="hover:text-[#57aaed] transition">טיפים</a>
          <a href="#" className="text-[#57aaed] transition">השוואת ביטוח נסיעות</a>
        </nav>

        <div>
          <img src="/logo.png" alt="חולצ׳יק" className="h-10 w-auto" />
        </div>
      </header>

      {!results ? (
        <main className="relative min-h-[80vh] flex flex-col pt-16 overflow-hidden">
          {/* Background graphics */}
          <div className="absolute bottom-0 left-0 opacity-10 pointer-events-none w-full h-full">
            {/* Generic shapes simulating the background illustrations */}
            <svg viewBox="0 0 100 100" className="absolute bottom-0 left-0 w-64 h-64 text-gray-400 fill-current -scale-x-100"><path d="M50 0 C70 40 90 60 100 100 L0 100 Z" /></svg>
            <svg viewBox="0 0 100 100" className="absolute bottom-0 right-10 w-48 h-48 text-gray-400 fill-current"><path d="M20 0 L80 0 L100 100 L0 100 Z" /></svg>
          </div>

          <div className="relative z-10 px-4">
            <SearchBar onCalculate={handleCalculate} />
            
            <div className="text-center mt-20 max-w-3xl mx-auto space-y-4">
              <h1 className="text-5xl md:text-6xl font-black text-gray-800 leading-tight">
                ביטוח נסיעות בחולצ׳יק<br/>רואים הכל באותיות גדולות
              </h1>
              <p className="text-xl text-gray-500 font-medium">
                בלי פרטים וטלפונים מציקים, 100,000 כבר ביטחו, שירות ממומחה.
              </p>
            </div>
          </div>
        </main>
      ) : (
        <main className="bg-[#f4f6f8] min-h-screen pb-24">
          {/* Collapsed Search Header */}
          <div className="bg-white py-4 shadow-sm border-b">
            <div className="max-w-6xl mx-auto px-4">
               <SearchBar onCalculate={handleCalculate} />
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 mt-12">
            <InsuranceResults results={results} />
          </div>
        </main>
      )}
    </div>
  );
}
