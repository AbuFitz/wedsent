/** Guest replies are measured per person AND per event, not per household link. */
export type GuestAnswer = { events: { status: string | null }[] };

export function guestProgress(guests: GuestAnswer[]) {
  let invited = 0;
  let attending = 0;
  let declined = 0;
  for (const person of guests) {
    for (const event of person.events) {
      invited++;
      if (event.status === "attending") attending++;
      else if (event.status === "declined") declined++;
    }
  }
  const replied = attending + declined;
  return { invited, replied, awaiting: invited - replied, attending, declined };
}
