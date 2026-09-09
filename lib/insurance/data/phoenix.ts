import { CompanyPricingConfig } from "../pricing-engine";

export const phoenix: CompanyPricingConfig = {
  id: "phoenix",
  name: "הפניקס",
  websiteUrl: "https://www.fnx.co.il",
  calculateBaseCost: (age, tripDays, isUSA) => {
    let total = 0;

    const getRate = (age: number, isUsa: boolean, isLatePeriod: boolean) => {
      if (!isUsa) {
        if (age <= 18) return 2.0;
        if (age <= 60) return 2.2;
        if (age <= 65) return 3.8;
        if (age <= 70) return 5.0;
        if (age <= 75) return 6.55;
        if (age <= 80) return 11.6;
        if (age <= 85) return 11.6;
        if (age <= 90) return 24.57;
      } else {
        if (!isLatePeriod) {
          if (age <= 18) return 3.3;
          if (age <= 60) return 3.3;
          if (age <= 65) return 6.1;
          if (age <= 70) return 9.0;
          if (age <= 75) return 15.0;
          if (age <= 80) return 28.0;
          if (age <= 85) return 28.0;
          if (age <= 90) return 33.0;
        } else {
          if (age <= 18) return 3.9;
          if (age <= 60) return 3.9;
          if (age <= 65) return 7.4;
          if (age <= 70) return 10.9;
          if (age <= 75) return 15.0;
          if (age <= 80) return 28.0;
          if (age <= 85) return 28.0;
          if (age <= 90) return 40.0;
        }
      }
      return null;
    };

    if (isUSA) {
      const earlyDays = Math.min(tripDays, 15);
      const lateDays = Math.max(0, tripDays - 15);
      
      const earlyRate = getRate(age, true, false);
      const lateRate = getRate(age, true, true);
      
      if (earlyRate === null || lateRate === null) return null;
      
      total = (earlyRate * earlyDays) + (lateRate * lateDays);
    } else {
      const rate = getRate(age, false, false);
      if (rate === null) return null;
      total = rate * tripDays;
    }

    return total;
  },
  coverages: {
    searchAndRescue: (_, tripDays) => 0.2 * tripDays,
    thirdParty: () => 0.0,
    cancellation: (age, tripDays) => {
      if (age <= 60) return Math.min(0.7 * tripDays, 21);
      if (age <= 90) return Math.min(0.8 * tripDays, 24);
      return null;
    },
    baggage: (_, tripDays) => 0.5 * tripDays,
    laptop: (_, tripDays) => 0.8 * tripDays,
    smartphone: (_, tripDays) => 1.0 * tripDays,
    pregnancy: (age, tripDays) => {
      if (age >= 18 && age <= 46) return 4.0 * tripDays;
      return null;
    },
    extremeSports: (age, tripDays) => {
      if (age <= 75) return 0.5 * tripDays;
      return null;
    },
    winterSports: (age, tripDays) => {
      if (age <= 75) return 10.0 * tripDays;
      return null;
    },
    rentalCarDeductible: (age, tripDays) => {
      if (age >= 24 && age <= 75) return 8.0 * tripDays;
      return null;
    },
  },
};
