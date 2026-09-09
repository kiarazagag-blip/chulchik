import { CalculationResult } from "@/lib/insurance/types";
import { InsuranceCarousel } from "./InsuranceCarousel";

interface InsuranceResultsProps {
  results: CalculationResult[];
}

export function InsuranceResults({ results }: InsuranceResultsProps) {
  if (!results || results.length === 0) return null;

  // Sort: Available first, then by price ascending
  const sortedResults = [...results].sort((a, b) => {
    if (a.status === "available" && b.status !== "available") return -1;
    if (a.status !== "available" && b.status === "available") return 1;
    
    // Primary sort: Price
    const priceDiff = a.finalPrice - b.finalPrice;
    if (priceDiff !== 0) return priceDiff;
    
    // Secondary sort: Company name alphabetically
    return a.companyName.localeCompare(b.companyName, "he");
  });

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 px-4">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-brand-black mb-2">ההצעה הטובה ביותר</h2>
        <p className="text-gray-500">
          השווינו בין החברות המובילות כדי למצוא עבורך את המשתלם ביותר
        </p>
      </div>

      <InsuranceCarousel results={sortedResults} />
    </div>
  );
}
