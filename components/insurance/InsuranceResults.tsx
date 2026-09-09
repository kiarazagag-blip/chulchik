import { CalculationResult } from "@/lib/insurance/types";
import { ResultCard } from "./ResultCard";

interface InsuranceResultsProps {
  results: CalculationResult[];
}

export function InsuranceResults({ results }: InsuranceResultsProps) {
  if (!results || results.length === 0) return null;

  const sortedResults = [...results].sort((a, b) => {
    if (a.status === "available" && b.status !== "available") return -1;
    if (a.status !== "available" && b.status === "available") return 1;
    const priceDiff = a.finalPrice - b.finalPrice;
    if (priceDiff !== 0) return priceDiff;
    return a.companyName.localeCompare(b.companyName, "he");
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl md:text-3xl font-medium text-gray-800">
          חיפשנו לכם את הביטוחים עם הכיסויים הטובים ביותר במחירים הטובים ביותר.<br className="hidden md:block" />
          התוצאות מיידיות, וברגע הקנייה תקבלו את הביטוח למייל תוך 5 דק'!
        </h2>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-600 px-2 font-medium">
        <div className="flex items-center gap-4">
          <span>מצאנו {results.length} הצעות!</span>
          <div className="hidden md:flex items-center gap-2">
            <span>השוואה:</span>
            <button className="bg-white border rounded-full px-3 py-1 shadow-sm font-bold">טבלה רשימה</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>מטבע:</span>
            <button className="bg-white border rounded-full px-3 py-1 shadow-sm font-bold">ש"ח דולר</button>
          </div>
          <div className="flex items-center gap-2">
            <span>מיון לפי:</span>
            <div className="bg-white border rounded-full flex overflow-hidden shadow-sm font-bold">
              <button className="px-3 py-1 bg-gray-100 border-l">מחיר</button>
              <button className="px-3 py-1 hover:bg-gray-50">דירוג</button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {sortedResults.map((result) => (
          <ResultCard key={result.companyId} result={result} />
        ))}
      </div>
    </div>
  );
}
