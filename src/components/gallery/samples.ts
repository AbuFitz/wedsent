import { defaults, type InviteData, type InviteEvent } from "@/lib/designs";
import type { DesignSpec } from "@/engine/registry";

/** Sample content so every design is shown as a real invitation, never a lorem-ipsum card. */
export const sampleData = (spec: DesignSpec, palette = ""): InviteData => ({
  ...defaults, design: spec.id, palette, names: spec.sample.names, occasion: spec.sample.occasion,
  venue: "The Glasshouse", city: "London", message: "We would be honoured to celebrate with you.",
});
export const sampleEvents = (spec: DesignSpec): InviteEvent[] => {
  const o = spec.sample.occasion;
  const first = o === "Nikah" ? "Nikah" : o === "Mehndi" ? "Mehndi" : "Ceremony";
  const second = o === "Nikah" ? "Walima" : o === "Mehndi" ? "Wedding" : "Reception";
  return [
    { id: "s1", title: first, startsOn: "2027-06-12", startsAt: "11:00", venue: "Central Hall", city: "London" },
    { id: "s2", title: second, startsOn: "2027-06-12", startsAt: "18:30", venue: "The Glasshouse", city: "London" },
  ];
};
