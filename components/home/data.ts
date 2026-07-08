// Homepage content — ported from the Claude Design handoff
// (project/Homepage Directions.dc.html, option 1a "Program").

export type ProjectItem = {
  idx: number;
  w: number; // case width in the 3D concourse (px)
  ch: string;
  file: string;
  title: string;
  sub: string;
};

export const PROJECT_ITEMS: ProjectItem[] = [
  { idx: 0, w: 432, ch: "CH 01", file: "/home/posters/elton-john.webp", title: "Elton John", sub: "BENEFIT CONCERT / LARGE-FORMAT LIVE CAPTURE — PETCO PARK" },
  { idx: 1, w: 538, ch: "CH 02", file: "/home/posters/alicia-keys.webp", title: "Alicia Keys", sub: "ARTIST SPECIAL / LIVESTREAM — WEBSTER HALL" },
  { idx: 2, w: 340, ch: "CH 03", file: "/home/posters/reba.webp", title: "Reba", sub: "CONCERT FILM / LIVE PRODUCTION — MADISON SQUARE GARDEN" },
  { idx: 3, w: 306, ch: "CH 04", file: "/home/posters/fall-out-boy.webp", title: "Fall Out Boy", sub: "CONCERT FILM / ARENA CAPTURE — MADISON SQUARE GARDEN" },
  { idx: 4, w: 434, ch: "CH 05", file: "/home/posters/garden-state.webp", title: "Garden State", sub: "ANNIVERSARY CONCERT / GLOBAL LIVESTREAM" },
  { idx: 5, w: 364, ch: "CH 06", file: "/home/posters/rascal-flatts.webp", title: "Rascal Flatts", sub: "TOUR CAPTURE / MULTICAM LIVE PRODUCTION" },
  { idx: 6, w: 364, ch: "CH 07", file: "/home/posters/mary-j-blige.webp", title: "Mary J. Blige", sub: "CONCERT FILM / THEATRICAL EVENT — MADISON SQUARE GARDEN" },
];

export type ServiceRole = { name: string; desc: string };
export type Service = {
  title: string;
  indent: number; // staggered poster-line indent (px, desktop)
  note: string; // mono annotation chip
  body: string;
  roles?: ServiceRole[];
};

export const SERVICES: Service[] = [
  {
    title: "Cinematic Multicam Concert Films & Livestreams",
    indent: 0,
    note: "01 — Concert film, livestream, or both",
    body: "Cinema-camera coverage for concerts and artist specials, switched live and finished for release. We handle the camera plot, engineering, recording, program cut, and delivery path so the show looks intentional in the room, online, and in the archive.",
  },
  {
    title: "Festival & Touring IMAG",
    indent: 120,
    note: "02 — Turnkey, travels with the tour",
    body: "Clean, cinematic IMAG for headline sets, festivals, and touring packages. We build the signal chain, integrate with stage/video departments, and keep the picture consistent from rehearsal through doors.",
  },
  {
    title: "Corporate & Brand Events",
    indent: 40,
    note: "03 — Premium picture for high-visibility rooms",
    body: "Multicamera coverage for keynotes, launches, conferences, and branded moments. We work alongside AV and staging teams to create a polished live cut, stream, and recording that feels aligned with the brand.",
  },
  {
    title: "Galas & Fundraisers",
    indent: 180,
    note: "04 — Quiet, polished, donor-facing",
    body: "Elegant live video support for formal rooms: stage coverage, IMAG, giving moments, stream feeds, and recap-ready recordings. The crew stays discreet, the picture stays composed, and the program keeps moving.",
  },
  {
    title: "Technical Direction & Crew",
    indent: 70,
    note: "05 — Senior operators, engineers, and support",
    body: "Bring in a focused broadcast team or fill the positions your show is missing:",
    roles: [
      { name: "Technical Direction", desc: "Show planning, crew leadership, switching approach, and video department oversight." },
      { name: "System Engineering", desc: "Signal flow, routing, records, monitoring, comms, and fault-tolerant builds." },
      { name: "Camera Operation", desc: "Cinema, broadcast, handheld, long lens, jib, PTZ, and specialty positions." },
      { name: "DIT / Media", desc: "Recording strategy, media integrity, color pipeline, and post handoff." },
      { name: "Utilities", desc: "Cable, deployment, strike, and the practical work that keeps the show moving." },
      { name: "Camera Assist", desc: "Builds, lens support, focus, batteries, and operator support." },
      { name: "Comms", desc: "Intercom planning and deployment for directors, operators, producers, and stage teams." },
      { name: "RF Video", desc: "Wireless camera paths for mobile, specialty, or hard-to-cable positions." },
    ],
  },
];

export const EVENT_TYPES = [
  "Concert film / livestream",
  "Festival & touring IMAG",
  "Corporate & brand event",
  "Gala / fundraiser",
  "Crew & technical resources",
];
