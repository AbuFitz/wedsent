import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Nav } from "@/components/site/nav";
import { Faq, SiteFooter } from "@/components/site/sections";
import "./pricing.css";

export const metadata: Metadata = { title: "Pricing — Wedsent", description: "One price per wedding. Pay once, no subscription. The price shown is provisional and checkout is not live yet." };

const READY: string[] = [
  "Your invitation at its own link, with six designs and every colour and font changeable",
  "Your own photograph, with the focal point you choose",
  "A private link for every household",
  "Replies per person and per event, counted as people",
  "Address, Google and Apple Maps links and a calendar file for every event",
  "Arabic, Hindi or your own opening line, set properly",
];
const SOON: string[] = ["Reminders to guests who haven’t replied", "Music", "Photo Hall for after the day", "Print-shop files with bleed and crop marks"];

export default function Pricing() {
  return (
    <>
      <Nav />
      <main className="pp">
        <section className="pp-head">
          <h1>One price for the whole day.</h1>
          <p>Design the invitation, give every household its own link, and see the replies come in. Pay once, per wedding. No subscription, no per-guest charges.</p>
        </section>

        <section className="pp-grid" aria-labelledby="pp-price">
          <div className="pp-price-col">
            <p className="pp-flag">Provisional price</p>
            <p id="pp-price" className="pp-price"><sup>£</sup>39</p>
            <p className="pp-per">once, per wedding</p>
            <Link href="/start" className="btn btn-dark">Start designing <ArrowRight size={18} /></Link>
            <p className="pp-fine">Checkout isn’t live, so nothing is charged. The price and the hosting period will be confirmed before you’re ever asked to pay.</p>
          </div>
          <div className="pp-list-col">
            <h2>Included</h2>
            <ul>{READY.map((t) => <li key={t}>{t}</li>)}</ul>
            <h2>On the way</h2>
            <ul className="pp-soon">{SOON.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </section>

        <section className="pp-steps">
          <h2>How it works</h2>
          <ol>
            <li><h3>Design</h3><p>Pick a design, add your photograph and words, and add each event with its address.</p></li>
            <li><h3>Send</h3><p>Every household gets its own private link to paste into WhatsApp, a text or an email.</p></li>
            <li><h3>Count</h3><p>Guests reply for each person and each event. You see exactly who’s coming where.</p></li>
          </ol>
        </section>
        <Faq />
        <section className="pp-end"><h2>See what feels like you.</h2><Link href="/start" className="btn">Start your invitation <ArrowRight size={18} /></Link></section>
      </main>
      <SiteFooter />
    </>
  );
}
