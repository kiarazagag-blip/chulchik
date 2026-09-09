import { CompanyPricingConfig } from "../pricing-engine";

export const clal: CompanyPricingConfig = {
  id: "clal",
  name: "כלל",
  websiteUrl: "https://www.clalbit.co.il",
  calculateBaseCost: (age, tripDays, isUSA) => {
    let daily: number | null = null;
    if (!isUSA) {
      if (age <= 18) daily = 1.69;
      else if (age <= 60) daily = 1.82;
      else if (age <= 65) daily = 2.82;
      else if (age <= 70) daily = 4.52;
      else if (age <= 75) daily = 6.52;
      else if (age <= 80) daily = 12.02;
      else if (age <= 85) daily = 14.02;
      else if (age <= 100) daily = 19.52;
    } else {
      if (age <= 18) daily = 3.3;
      else if (age <= 60) daily = 3.3;
      else if (age <= 65) daily = 6.5;
      else if (age <= 70) daily = 9.5;
      else if (age <= 75) daily = 12.0;
      else if (age <= 80) daily = 22.0;
      else if (age <= 85) daily = 22.0;
      else if (age <= 100) daily = 32.0;
    }
    
    if (daily === null) return null;
    return daily * tripDays;
  },
  coverages: {
    searchAndRescue: (age, tripDays) => {
      if (age <= 18) return 0.22 * tripDays;
      if (age <= 100) return 0.44 * tripDays;
      return null;
    },
    thirdParty: (_, tripDays) => 0.04 * tripDays,
    cancellation: (age, tripDays) => {
      let daily = 0;
      if (age <= 30) daily = 0.29;
      else if (age <= 40) daily = 0.46;
      else if (age <= 50) daily = 0.86;
      else if (age <= 65) daily = 2.16;
      else if (age <= 75) daily = 2.26;
      else if (age <= 80) daily = 3.26;
      else if (age <= 100) daily = 4.26;
      else return null;
      return daily * tripDays;
    },
    baggage: (_, tripDays) => 0.36 * tripDays,
    laptop: (_, tripDays) => 1.32 * tripDays,
    smartphone: (_, tripDays) => 1.32 * tripDays,
    pregnancy: (age, tripDays) => {
      if (age >= 18 && age <= 50) return 7.5 * tripDays;
      return null;
    },
    extremeSports: (age, tripDays) => {
      if (age <= 75) return 0.46 * tripDays;
      return null;
    },
    winterSports: (age, tripDays) => {
      if (age <= 75) return 6.38 * tripDays;
      return null;
    },
    rentalCarDeductible: (age, tripDays) => {
      if (age >= 17 && age <= 100) return 8.0 * tripDays;
      return null;
    },
  },
};
