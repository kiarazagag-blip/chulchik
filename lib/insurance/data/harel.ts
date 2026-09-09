import { CompanyPricingConfig } from "../pricing-engine";

export const harel: CompanyPricingConfig = {
  id: "harel",
  name: "הראל",
  websiteUrl: "https://www.harel-group.co.il",
  calculateBaseCost: (age, tripDays, isUSA) => {
    let total = 0;

    const getRate = (age: number, isUsa: boolean, isLatePeriod: boolean) => {
      if (!isUsa) {
        if (!isLatePeriod) {
          if (age <= 50) return 2.5;
          if (age <= 60) return 2.5;
          if (age <= 65) return 3.8;
          if (age <= 70) return 4.8;
          if (age <= 75) return 6.55;
          if (age <= 80) return 11.6;
          if (age <= 85) return 11.6;
          if (age <= 95) return 17.5;
        } else {
          if (age <= 50) return 2.5;
          if (age <= 60) return 2.8;
          if (age <= 65) return 4.0;
          if (age <= 70) return 5.1;
          if (age <= 75) return 6.55;
          if (age <= 80) return 11.6;
          if (age <= 85) return 11.6;
          if (age <= 95) return 17.5;
        }
      } else {
        if (!isLatePeriod) {
          if (age <= 50) return 3.5;
          if (age <= 60) return 3.5;
          if (age <= 65) return 6.8;
          if (age <= 70) return 9.7;
          if (age <= 75) return 11.6;
          if (age <= 80) return 21.2;
          if (age <= 85) return 21.2;
          if (age <= 95) return 32.5;
        } else {
          if (age <= 50) return 3.7;
          if (age <= 60) return 3.7;
          if (age <= 65) return 6.8;
          if (age <= 70) return 9.7;
          if (age <= 75) return 11.6;
          if (age <= 80) return 21.2;
          if (age <= 85) return 21.2;
          if (age <= 95) return 32.5;
        }
      }
      return null;
    };

    if (isUSA) {
      const earlyDays = Math.min(tripDays, 20);
      const lateDays = Math.max(0, tripDays - 20);
      
      const earlyRate = getRate(age, true, false);
      const lateRate = getRate(age, true, true);
      
      if (earlyRate === null || lateRate === null) return null;
      
      total = (earlyRate * earlyDays) + (lateRate * lateDays);
    } else {
      const earlyDays = Math.min(tripDays, 14);
      const lateDays = Math.max(0, tripDays - 14);
      
      const earlyRate = getRate(age, false, false);
      const lateRate = getRate(age, false, true);
      
      if (earlyRate === null || lateRate === null) return null;
      
      total = (earlyRate * earlyDays) + (lateRate * lateDays);
    }

    return total;
  },
  coverages: {
    searchAndRescue: (_, tripDays) => 0.2 * tripDays,
    thirdParty: () => 0.0,
    cancellation: (age, tripDays) => {
      let daily = 0;
      if (age <= 17) daily = 0.65;
      else if (age <= 40) daily = 0.7;
      else if (age <= 50) daily = 1.0;
      else if (age <= 60) daily = 1.0;
      else if (age <= 75) daily = 1.5;
      else if (age <= 85) daily = 2.8;
      else if (age <= 100) daily = 4.2;
      else return null;
      return daily * tripDays;
    },
    baggage: (_, tripDays) => 0.39 * tripDays,
    laptop: (_, tripDays) => 2.0 * tripDays,
    smartphone: (_, tripDays) => 1.6 * tripDays,
    pregnancy: (_, tripDays, isUSA) => (isUSA ? 10.0 : 5.0) * tripDays,
    extremeSports: (age, tripDays) => {
      if (age <= 75) return 0.5 * tripDays;
      if (age <= 85) return 2.0 * tripDays;
      return null;
    },
    winterSports: (age, tripDays) => {
      if (age <= 75) return 9.5 * tripDays;
      if (age <= 80) return 13.5 * tripDays;
      return null;
    },
    rentalCarDeductible: (age, tripDays) => {
      if (age >= 24 && age <= 75) {
        return Math.min(6.5 * tripDays, 88);
      }
      return null;
    },
  },
};
