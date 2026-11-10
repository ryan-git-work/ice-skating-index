// Authored seasonal navigation expires at Nashville midnight after Jan 31.
// Consumption is recorded even after expiry so later builds keep runtime checks.
let consumed = false;
export function holidayDiscoveryActive(asOf: Date): boolean {
  consumed = true;
  return Number.isFinite(asOf.getTime()) && asOf.getTime() >= Date.parse("2026-11-10T06:00:00Z") && asOf.getTime() < Date.parse("2027-02-01T06:00:00Z");
}
export function resetHolidayDiscoveryConsumption() { consumed = false; }
export function getHolidayDiscoveryConsumption() { return consumed; }
export const HOLIDAY_COMPARISON = "/blog/ice-skating-cost-nashville#holiday-rinks";
