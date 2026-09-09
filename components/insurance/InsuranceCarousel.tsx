"use client";

import { useRef } from "react";
import { CalculationResult } from "@/lib/insurance/types";
import { InsuranceCard } from "./InsuranceCard";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface InsuranceCarouselProps {
  results: CalculationResult[];
}

export function InsuranceCarousel({ results }: InsuranceCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "prev" | "next") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      // In RTL, "next" (moving left) means negative scroll left.
      // Actually scrollLeft in RTL is usually negative in modern browsers.
      // But standard scrollTo works with relative signs.
      const sign = direction === "next" ? -1 : 1;
      scrollRef.current.scrollBy({ left: sign * scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full py-8 group">
      <div className="absolute top-1/2 -start-4 md:-start-6 -translate-y-1/2 z-10 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => scroll("next")}
          className="w-10 h-10 bg-white rounded-full shadow-lg border flex items-center justify-center hover:bg-gray-50 text-gray-700"
        >
          <ChevronRight className="w-6 h-6 rtl:hidden" />
          <ChevronLeft className="w-6 h-6 hidden rtl:block" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {results.map((result, index) => (
          <div key={result.companyId} className="w-[85vw] sm:w-[280px] md:w-[24%] flex-none snap-center md:snap-start">
            <InsuranceCard result={result} isBest={index === 0 && result.status === "available"} />
          </div>
        ))}
      </div>

      <div className="absolute top-1/2 -end-4 md:-end-6 -translate-y-1/2 z-10 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => scroll("prev")}
          className="w-10 h-10 bg-white rounded-full shadow-lg border flex items-center justify-center hover:bg-gray-50 text-gray-700"
        >
          <ChevronLeft className="w-6 h-6 rtl:hidden" />
          <ChevronRight className="w-6 h-6 hidden rtl:block" />
        </button>
      </div>
    </div>
  );
}
