export interface Traveler {
  id: string;
  age: number;
}

export interface OptionalCoverages {
  searchAndRescue?: boolean; // איתור וחילוץ
  thirdParty?: boolean; // צד ג'
  cancellation?: boolean; // ביטול או קיצור נסיעה
  baggage?: boolean; // כבודה
  laptop?: boolean; // מחשב אישי
  smartphone?: boolean; // טלפון נייד
  pregnancy?: boolean; // הריון
  extremeSports?: boolean; // ספורט אתגרי
  winterSports?: boolean; // ספורט חורף
  rentalCarDeductible?: boolean; // ביטול השתתפות עצמית רכב שכור
}

export interface TripDetails {
  startDate: Date;
  endDate: Date;
  isUSA: boolean;
  coverages: OptionalCoverages;
}

export type CalculationStatus = "available" | "unavailable" | "needs_review";

export interface CalculationResult {
  companyId: string;
  companyName: string;
  finalPrice: number;
  currency: string;
  status: CalculationStatus;
  websiteUrl: string;
}

export interface InsuranceCompany {
  id: string;
  name: string;
  websiteUrl: string;
  calculate: (trip: TripDetails, travelers: Traveler[]) => CalculationResult;
}
