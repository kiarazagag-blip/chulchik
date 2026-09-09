import { calculateCompanyPrice } from "../pricing-engine";
import { insuranceCompanies } from "../companies";
import { TripDetails, Traveler } from "../types";
import assert from "assert";

// Helper to quickly find a company config
const getCompany = (id: string) => insuranceCompanies.find(c => c.id === id)!;

const runTests = () => {
  console.log("Running Pricing Engine Tests...");

  // 1. Young traveler, non-USA trip (Migdal, Age 10, 5 days, non-USA)
  // Expected Migdal base: 2.0 * 5 = 10.0
  let trip: TripDetails = {
    startDate: new Date("2026-10-01"),
    endDate: new Date("2026-10-05"), // 5 days
    isUSA: false,
    coverages: {}
  };
  let travelers: Traveler[] = [{ id: "1", age: 10 }];
  let res = calculateCompanyPrice(getCompany("migdal"), trip, travelers);
  assert.strictEqual(res.finalPrice, 10.0, "Test 1 Failed: Young traveler non-USA");

  // 2. Adult traveler, non-USA trip (Menora, Age 30, 5 days, non-USA)
  // Expected Menora base: 1.95 * 5 = 9.75
  travelers = [{ id: "1", age: 30 }];
  res = calculateCompanyPrice(getCompany("menora"), trip, travelers);
  assert.strictEqual(res.finalPrice, 9.75, "Test 2 Failed: Adult traveler non-USA");

  // 3. Older traveler (PassportCard, Age 70, 5 days, non-USA)
  // Expected PassportCard base: 5.35 * 5 = 26.75
  travelers = [{ id: "1", age: 70 }];
  res = calculateCompanyPrice(getCompany("passportcard"), trip, travelers);
  assert.strictEqual(res.finalPrice, 26.75, "Test 3 Failed: Older traveler non-USA");

  // 4. USA trip (Phoenix, Age 30, 10 days, USA)
  // Expected Phoenix USA <= 15 days: 3.3 * 10 = 33.0
  trip = { ...trip, isUSA: true, endDate: new Date("2026-10-10") }; // 10 days
  travelers = [{ id: "1", age: 30 }];
  res = calculateCompanyPrice(getCompany("phoenix"), trip, travelers);
  assert.strictEqual(res.finalPrice, 33.0, "Test 4 Failed: USA trip");

  // 5. USA trip crossing a company's pricing threshold (Harel, Age 30, 25 days, USA)
  // Expected Harel USA: Days 1-20 at 3.5, Days 21-25 at 3.7
  // Total: (3.5 * 20) + (3.7 * 5) = 70 + 18.5 = 88.5
  trip = { ...trip, endDate: new Date("2026-10-25") }; // 25 days
  res = calculateCompanyPrice(getCompany("harel"), trip, travelers);
  assert.strictEqual(res.finalPrice, 88.5, "Test 5 Failed: USA trip crossing threshold");

  // 6. Trip longer than 14 days (Harel, Age 30, 20 days, non-USA)
  // Expected Harel: Days 1-14 at 2.5, Days 15-20 at 2.5
  // Total: (2.5 * 14) + (2.5 * 6) = 35 + 15 = 50.0
  trip = { ...trip, isUSA: false, endDate: new Date("2026-10-20") }; // 20 days
  res = calculateCompanyPrice(getCompany("harel"), trip, travelers);
  assert.strictEqual(res.finalPrice, 50.0, "Test 6 Failed: Trip > 14 days");

  // 7. Trip longer than 20 days (Phoenix, Age 30, 20 days, USA)
  // Expected Phoenix USA: Days 1-15 at 3.3, Days 16-20 at 3.9
  // Total: (3.3 * 15) + (3.9 * 5) = 49.5 + 19.5 = 69.0
  trip = { ...trip, isUSA: true, endDate: new Date("2026-10-20") }; // 20 days
  res = calculateCompanyPrice(getCompany("phoenix"), trip, travelers);
  assert.strictEqual(res.finalPrice, 69.0, "Test 7 Failed: Trip > 20 days USA");

  // 8. Trip longer than 30 days (PassportCard, Age 30, 35 days, USA)
  // Expected PassportCard USA > 30 days: 3.15 * 35 = 110.25
  trip = { ...trip, isUSA: true, endDate: new Date("2026-11-04") }; // 35 days
  res = calculateCompanyPrice(getCompany("passportcard"), trip, travelers);
  assert.strictEqual(res.finalPrice, 110.25, "Test 8 Failed: Trip > 30 days");

  // 9. Optional coverage selected (Clal, Age 30, 5 days, non-USA, Baggage)
  // Clal base: 1.82 * 5 = 9.1
  // Baggage: 0.36 * 5 = 1.8
  // Total = 10.9
  trip = { ...trip, isUSA: false, endDate: new Date("2026-10-05"), coverages: { baggage: true } }; // 5 days
  res = calculateCompanyPrice(getCompany("clal"), trip, travelers);
  assert.strictEqual(res.finalPrice, 10.9, "Test 9 Failed: Optional coverage");

  // 10. Coverage with a maximum (Migdal, Age 30, 15 days, Cancellation)
  // Migdal Cancellation: 1.5 * 15 = 22.5, but max is 15.
  // Migdal Base: 2.2 * 15 = 33
  // Total = 33 + 15 = 48
  trip = { ...trip, endDate: new Date("2026-10-15"), coverages: { cancellation: true } }; // 15 days
  res = calculateCompanyPrice(getCompany("migdal"), trip, travelers);
  assert.strictEqual(res.finalPrice, 48.0, "Test 10 Failed: Coverage with maximum cap");

  // 11. Multiple travelers with different ages (Menora, 5 days, non-USA)
  // Traveler 1 (Age 30): Base 1.95 * 5 = 9.75
  // Traveler 2 (Age 70): Base 4.5 * 5 = 22.5
  // Total = 32.25
  trip = { ...trip, coverages: {} }; // 15 days, wait let's use 5 days for simpler math
  trip.endDate = new Date("2026-10-05");
  travelers = [{ id: "1", age: 30 }, { id: "2", age: 70 }];
  res = calculateCompanyPrice(getCompany("menora"), trip, travelers);
  assert.strictEqual(res.finalPrice, 32.25, "Test 11 Failed: Multiple travelers");

  // 12. A company with missing tariff data (PassportCard, Age 80, 35 days, USA)
  // PassportCard age 80 > 30 days is "?$ לברר" -> should return needs_review
  trip = { ...trip, isUSA: true, endDate: new Date("2026-11-04") }; // 35 days
  travelers = [{ id: "1", age: 80 }];
  res = calculateCompanyPrice(getCompany("passportcard"), trip, travelers);
  assert.strictEqual(res.status, "needs_review", "Test 12 Failed: Missing data should be needs_review");

  console.log("All tests passed successfully!");
};

runTests();
