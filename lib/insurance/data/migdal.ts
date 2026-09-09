import { CompanyPricingConfig } from "../pricing-engine";

export const migdal: CompanyPricingConfig = {
  id: "migdal",
  name: "מגדל",
  websiteUrl: "https://www.migdal.co.il",
  calculateBaseCost: (age, tripDays, isUSA) => {
    let daily = 0;
    if (age >= 0 && age <= 17) daily = isUSA ? 2.9 : 2.0;
    else if (age >= 18 && age <= 44) daily = isUSA ? 3.21 : 2.2;
    else if (age >= 45 && age <= 60) daily = isUSA ? 3.99 : 2.7;
    else if (age >= 61 && age <= 65) daily = isUSA ? 6.64 : 4.4;
    else if (age >= 66 && age <= 70) daily = isUSA ? 9.6 : 6.3;
    else if (age >= 71 && age <= 75) daily = isUSA ? 13.39 : 8.73;
    else if (age >= 76 && age <= 80) daily = isUSA ? 19.12 : 12.4;
    else if (age >= 81 && age <= 85) daily = isUSA ? 26.0 : 17.3;
    else if (age >= 86 && age <= 100) daily = isUSA ? 36.89 : 23.79;
    else return null;

    return daily * tripDays;
  },
  coverages: {
    searchAndRescue: (_, tripDays) => 0.2 * tripDays,
    thirdParty: (_, tripDays) => 0.2 * tripDays,
    cancellation: (age, tripDays) => {
      let daily = 0;
      if (age >= 0 && age <= 75) daily = 1.5;
      else if (age >= 76 && age <= 100) daily = 2.5;
      else return null;
      return Math.min(daily * tripDays, 15);
    },
    baggage: (_, tripDays) => 0.4 * tripDays,
    laptop: (_, tripDays) => 0.8 * tripDays,
    smartphone: (_, tripDays) => 1.9 * tripDays,
    pregnancy: (_, tripDays) => 4.0 * tripDays,
    extremeSports: (_, tripDays) => 0.6 * tripDays,
    winterSports: (_, tripDays) => 6.75 * tripDays,
    rentalCarDeductible: (_, tripDays) => 6.5 * tripDays,
  },
};
