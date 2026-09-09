import { TripDetails, Traveler, CalculationResult, CalculationStatus, OptionalCoverages } from "./types";

export type BaseRateFn = (age: number, tripDays: number, isUSA: boolean) => number | "needs_review" | null;
export type CoverageRateFn = (age: number, tripDays: number, isUSA: boolean) => number | "needs_review" | null;

export interface CompanyPricingConfig {
  id: string;
  name: string;
  websiteUrl: string;
  calculateBaseCost: BaseRateFn;
  coverages: {
    [K in keyof OptionalCoverages]?: CoverageRateFn;
  };
}

export const calculateCompanyPrice = (
  company: CompanyPricingConfig,
  trip: TripDetails,
  travelers: Traveler[]
): CalculationResult => {
  let totalPrice = 0;
  let status: CalculationStatus = "available";
  
  const tripDays = Math.ceil((trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 3600 * 24)) + 1;

  for (const traveler of travelers) {
    const baseCost = company.calculateBaseCost(traveler.age, tripDays, trip.isUSA);
    
    if (baseCost === "needs_review") {
      status = "needs_review";
      break;
    }
    if (baseCost === null) {
      status = "unavailable";
      break;
    }

    let travelerPrice = baseCost;

    for (const [key, isSelected] of Object.entries(trip.coverages)) {
      if (isSelected) {
        const coverageFn = company.coverages[key as keyof OptionalCoverages];
        if (!coverageFn) {
          // Company doesn't offer this coverage
          status = "unavailable";
          break;
        }

        const coverageCost = coverageFn(traveler.age, tripDays, trip.isUSA);
        if (coverageCost === "needs_review") {
          status = "needs_review";
          break;
        }
        if (coverageCost === null) {
          status = "unavailable";
          break;
        }

        travelerPrice += coverageCost;
      }
    }

    if (status !== "available") break;
    totalPrice += travelerPrice;
  }

  return {
    companyId: company.id,
    companyName: company.name,
    finalPrice: Number(totalPrice.toFixed(2)),
    currency: "$",
    status,
    websiteUrl: company.websiteUrl,
  };
};
