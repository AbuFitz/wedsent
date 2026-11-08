/** Only one Wedsent media source may play in a document at a time.
 * WaveSurfer can own a detached audio element, so it registers explicitly. */
const players = new Set<HTMLMediaElement>();

export function claimAudioFocus(active: HTMLMediaElement) {
  // Native previews can be added dynamically, so check the DOM as well as the registry.
  for (const player of [...players, ...document.querySelectorAll<HTMLMediaElement>("audio, video")]) {
    if (player !== active && !player.paused) player.pause();
  }
}

export function registerAudioPlayer(player: HTMLMediaElement) {
  players.add(player);
  const onPlay = () => claimAudioFocus(player);
  player.addEventListener("play", onPlay);
  return () => { player.removeEventListener("play", onPlay); players.delete(player); };
}

export function installAudioFocus() {
  const onPlay = (event: Event) => {
    if (event.target instanceof HTMLMediaElement) claimAudioFocus(event.target);
  };
  // `play` does not bubble, but capture sees native controls and autoplay alike.
  document.addEventListener("play", onPlay, true);
  return () => document.removeEventListener("play", onPlay, true);
}
