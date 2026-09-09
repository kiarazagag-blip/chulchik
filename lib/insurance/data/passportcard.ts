import { CompanyPricingConfig } from "../pricing-engine";

export const passportcard: CompanyPricingConfig = {
  id: "passportcard",
  name: "פספורטכארד",
  websiteUrl: "https://www.passportcard.co.il",
  calculateBaseCost: (age, tripDays, isUSA) => {
    let daily: number | "needs_review" | null = null;

    if (!isUSA) {
      if (age <= 60) daily = 3.0;
      else if (age <= 65) daily = 4.45;
      else if (age <= 70) daily = 5.35;
      else if (age <= 75) daily = 17.0;
      else if (age <= 79) daily = 26.75;
      else if (age <= 84) daily = 26.75;
    } else {
      if (tripDays <= 30) {
        if (age <= 60) daily = 1.25;
        else if (age <= 65) daily = 3.6;
        else if (age <= 70) daily = 5.85;
        else if (age <= 75) daily = 7.1;
        else if (age <= 79) daily = 12.3;
        else if (age <= 84) daily = 12.3;
      } else {
        if (age <= 60) daily = 3.15;
        else if (age <= 65) daily = 5.65;
        else if (age <= 70) daily = 8.95;
        else if (age <= 75) daily = 13.3;
        else if (age <= 79) daily = "needs_review";
        else if (age <= 84) daily = "needs_review";
      }
    }

    if (daily === "needs_review") return "needs_review";
    if (daily === null) return null;
    return daily * tripDays;
  },
  coverages: {
    searchAndRescue: (_, tripDays) => 0.2 * tripDays,
    thirdParty: () => 0.0,
    cancellation: (_, tripDays) => Math.min(0.8 * tripDays, 16),
    baggage: (_, tripDays) => 0.5 * tripDays,
    laptop: (_, tripDays) => 0.5 * tripDays,
    smartphone: (_, tripDays) => Math.min(1.6 * tripDays, 89.6),
    pregnancy: (age, tripDays) => {
      if (age <= 39) return 5.0 * tripDays;
      return null;
    },
    extremeSports: (age, tripDays) => {
      if (age <= 75) {
        return tripDays <= 30 ? 0.5 * tripDays : 1.0 * tripDays;
      }
      return null;
    },
    winterSports: (age, tripDays) => {
      if (age <= 75) return 10.0 * tripDays;
      return null;
    },
    rentalCarDeductible: (age, tripDays) => {
      if (age >= 24 && age <= 80) return 8.0 * tripDays;
      return null;
    },
  },
};
