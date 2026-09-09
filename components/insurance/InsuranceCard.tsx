import { CalculationResult } from "@/lib/insurance/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertCircle } from "lucide-react";

interface InsuranceCardProps {
  result: CalculationResult;
  isBest?: boolean;
}

export function InsuranceCard({ result, isBest }: InsuranceCardProps) {
  const isAvailable = result.status === "available";

  return (
    <Card className={`relative w-full h-full flex flex-col justify-between border-2 transition-all hover:shadow-md ${isBest ? "border-brand-blue" : "border-gray-100"}`}>
      {isBest && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          ההצעה הטובה ביותר
        </div>
      )}
      <CardHeader className="text-center pt-6">
        <CardTitle className="text-2xl font-black text-brand-black">{result.companyName}</CardTitle>
      </CardHeader>
      <CardContent className="text-center flex-1 flex flex-col justify-center">
        {isAvailable ? (
          <p className="text-4xl font-bold text-brand-blue">
            {result.finalPrice.toFixed(2)}{result.currency}
          </p>
        ) : (
          <div className="flex flex-col items-center text-gray-400 gap-2">
            <AlertCircle className="w-8 h-8" />
            <p className="text-sm">
              {result.status === "needs_review" ? "נדרש בירור מחיר" : "לא נמצא תעריף זמין"}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pb-6">
        <Button
          className="w-full text-lg h-12 rounded-xl bg-brand-yellow text-brand-black hover:bg-brand-yellow/90"
          disabled={!isAvailable}
          onClick={() => window.open(result.websiteUrl, "_blank")}
        >
          לאתר החברה <ExternalLink className="w-4 h-4 ms-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}
