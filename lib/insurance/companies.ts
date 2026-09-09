import { migdal } from "./data/migdal";
import { menora } from "./data/menora";
import { harel } from "./data/harel";
import { phoenix } from "./data/phoenix";
import { passportcard } from "./data/passportcard";
import { clal } from "./data/clal";
import { CompanyPricingConfig } from "./pricing-engine";

export const insuranceCompanies: CompanyPricingConfig[] = [
  migdal,
  menora,
  harel,
  phoenix,
  passportcard,
  clal,
];
