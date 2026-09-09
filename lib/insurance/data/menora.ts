import { CompanyPricingConfig } from "../pricing-engine";

export const menora: CompanyPricingConfig = {
  id: "menora",
  name: "מנורה",
  websiteUrl: "https://www.menoramivt.co.il",
  calculateBaseCost: (age, tripDays, isUSA) => {
    let daily = 0;
    if (age >= 0 && age <= 40) daily = isUSA ? 3.3 : 1.95;
    else if (age >= 41 && age <= 60) daily = isUSA ? 3.3 : 1.95;
    else if (age >= 61 && age <= 65) daily = isUSA ? 6.1 : 3.3;
    else if (age >= 66 && age <= 70) daily = isUSA ? 9.0 : 4.5;
    else if (age >= 71 && age <= 75) daily = isUSA ? 14.0 : 6.55;
    else if (age >= 76 && age <= 80) daily = isUSA ? 27.0 : 11.6;
    else return null;

    return daily * tripDays;
  },
  coverages: {
    searchAndRescue: (_, tripDays) => 0.2 * tripDays,
    thirdParty: (_, tripDays) => 0.0,
    cancellation: (age, tripDays) => {
      let daily = 0;
      if (age >= 0 && age <= 40) daily = 0.3;
      else if (age >= 41 && age <= 60) daily = 0.5;
      else if (age >= 61 && age <= 75) daily = 0.8;
      else if (age >= 76 && age <= 80) daily = 1.2;
      else return null;
      return daily * tripDays;
    },
    baggage: (_, tripDays) => 0.35 * tripDays,
    laptop: (_, tripDays) => 1.0 * tripDays,
    smartphone: (_, tripDays) => 1.6 * tripDays,
    pregnancy: (age, tripDays, isUSA) => {
      if (age >= 0 && age <= 42) return (isUSA ? 7.5 : 4.0) * tripDays;
      return null;
    },
    extremeSports: (age, tripDays) => {
      if (age >= 0 && age <= 75) return 0.5 * tripDays;
      return null;
    },
    winterSports: (age, tripDays) => {
      if (age >= 0 && age <= 70) return 8.47 * tripDays;
      return null;
    },
    rentalCarDeductible: (age, tripDays, isUSA) => {
      if (isUSA) {
        if (age >= 18 && age <= 75) return 6.0 * tripDays;
      } else {
        if (age >= 21 && age <= 75) return 6.0 * tripDays;
      }
      return null;
    },
  },
};
