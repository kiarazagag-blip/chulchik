import { CalculationResult } from "@/lib/insurance/types";
import { Check, X, Mail, Star, ChevronDown } from "lucide-react";

interface ResultCardProps {
  result: CalculationResult;
}

export function ResultCard({ result }: ResultCardProps) {
  const isAvailable = result.status === "available";

  // Mocking promotional banners based on the image
  const getBanner = (companyId: string) => {
    if (companyId === "menora") return "10% הנחה בלעדי ללקוחות חולצ׳יק 5 ג'יגה מתנה לחבילת גלישה eSIM";
    if (companyId === "migdal") return "10% + חילוץ במתנה בלעדי לחולצ׳יק 20% ברכישת חבילת גלישה eSIM";
    return "מבצע בלעדי לרוכשים באתר!";
  };

  // Mocking features based on the image
  const features = [
    { label: "כיסוי רפואי", value: "$5,000,000", included: true },
    { label: "איתור וחילוץ", included: true },
    { label: "ביטול/קיצור נסיעה", included: false, highlight: "מומלץ להוסיף" },
    { label: "כבודה", included: false, highlight: "מומלץ להוסיף" },
  ];

  if (!isAvailable) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-between opacity-60">
        <div className="text-xl font-bold">{result.companyName}</div>
        <div className="text-gray-500">
          {result.status === "needs_review" ? "נדרש בירור טלפוני" : "לא זמין"}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col transition-all hover:shadow-md">
      {/* Promotional Banner */}
      <div className="bg-[#a1283b] text-white text-xs font-bold py-2 px-4 flex items-center gap-2">
        <div className="bg-white text-[#a1283b] w-4 h-4 rounded-full flex items-center justify-center text-[10px]">i</div>
        {getBanner(result.companyId)}
      </div>

      <div className="flex flex-col md:flex-row p-6 items-stretch gap-6">
        
        {/* Right Column: Logo & Info */}
        <div className="flex-1 flex flex-col items-center justify-center border-b md:border-b-0 md:border-l border-gray-100 pb-4 md:pb-0 px-4">
          <div className="text-2xl font-black text-[#e87722] mb-2">{result.companyName}</div>
          <p className="text-xs text-gray-500 font-medium mb-1">33,698 פוליסות נרכשו</p>
          <p className="text-[10px] text-gray-400 mb-2">נרכש לפני 8 דקות</p>
          <div className="flex items-center gap-1 mb-1">
            <span className="font-bold text-sm">4.0</span>
            <div className="flex text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 text-gray-300" />
            </div>
          </div>
          <a href="#" className="text-[#a1283b] text-xs underline font-bold">295 חוות דעת &gt;</a>
        </div>

        {/* Middle Column: Features */}
        <div className="flex-[2] flex flex-col justify-center px-4 relative">
          <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm">
            {features.map((f, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{f.label}</span>
                <div className="flex items-center gap-2">
                  {f.value ? (
                    <span className="text-[#a1283b] font-bold underline">{f.value}</span>
                  ) : f.highlight ? (
                    <span className="text-[#a1283b] text-xs">{f.highlight}</span>
                  ) : null}
                  {f.included ? (
                    <div className="w-5 h-5 bg-[#a1283b] rounded-full flex items-center justify-center text-white">
                      <Check className="w-3 h-3" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 text-[#a1283b] flex items-center justify-center font-bold">
                      <X className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button className="text-[#a1283b] text-xs font-bold mt-4 flex items-center justify-center gap-1">
            פרטי הכיסויים <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Left Column: Price & CTA */}
        <div className="flex-[1.2] flex flex-col items-center justify-center bg-[#f9e9ec] rounded-xl p-4 md:ms-4 border border-[#f0d4d8]">
          <button className="flex items-center gap-2 text-[#a1283b] text-xs font-bold mb-4 bg-white/50 px-3 py-1.5 rounded-full border border-[#f0d4d8] hover:bg-white transition-colors">
            <Mail className="w-3 h-3" /> שלח לי את ההצעה הזו
          </button>
          
          <div className="text-5xl font-bold text-gray-800 mb-1 leading-none">
            {result.finalPrice.toFixed(2)}<span className="text-3xl ml-1">{result.currency}</span>
          </div>
          <p className="text-xs text-gray-500 font-medium mb-1">לנוסע לכל התקופה</p>
          <a href="#" className="text-[#a1283b] text-xs font-bold underline mb-3">פירוט החשבון</a>
          
          <button 
            className="w-full bg-[#a1283b] hover:bg-[#852030] text-white rounded-full py-3 font-bold flex items-center justify-center gap-2 transition-colors shadow-md text-sm"
            onClick={() => window.open(result.websiteUrl, "_blank")}
          >
            לרכישה אונליין <ChevronDown className="w-4 h-4 rotate-90 rtl:-rotate-90" />
          </button>
        </div>

      </div>
      
      {/* Footer / Fine print */}
      <div className="bg-gray-50 border-t border-gray-100 p-2 text-center text-xs text-gray-500">
        בועז קציר האותיות הקטנות  <span className="font-bold">TopTravel</span>
      </div>
    </div>
  );
}
