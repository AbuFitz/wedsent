import type { Metadata } from "next";
import { PricingEditorial } from "./pricing-editorial";

export const metadata: Metadata = { title: "Pricing | Weddsent", description: "One invitation. One wedding. A one-time payment, planned at £39. Checkout is not live yet." };
export default function Pricing() { return <PricingEditorial />; }
