// Homepage content — ported from the Claude Design handoff
// (Homepage Directions.dc.html, "Program direction — revised per
// annotations": high-end pass with hero, system section, and
// selected-work metadata).

export type ProjectItem = {
  idx: number;
  w: number; // case width in the 3D concourse (px)
  wM: number; // card width in the mobile swipe rail (px)
  meta: string; // tally chip + program plate meta line
  format: string;
  role: string;
  output: string;
  file: string;
  title: string;
  sub: string; // sentence case — the program plate uppercases it
};

export const PROJECT_ITEMS: ProjectItem[] = [
  { idx: 0, w: 340, wM: 189, meta: "Concert film", format: "Concert film", role: "Multicam coverage", output: "Program cut + records", file: "/home/posters/reba.webp", title: "Reba", sub: "Concert film / live production — Madison Square Garden" },
  { idx: 1, w: 538, wM: 299, meta: "Livestream", format: "Artist special", role: "Livestream coverage", output: "Stream + archive", file: "/home/posters/alicia-keys.webp", title: "Alicia Keys", sub: "Artist special / livestream — Webster Hall" },
  { idx: 2, w: 306, wM: 170, meta: "Multicam", format: "Arena capture", role: "Camera system", output: "Live cut + ISOs", file: "/home/posters/fall-out-boy.webp", title: "Fall Out Boy", sub: "Concert film / arena capture — Madison Square Garden" },
  { idx: 3, w: 434, wM: 241, meta: "Broadcast package", format: "Global livestream", role: "Program coverage", output: "Broadcast package", file: "/home/posters/garden-state.webp", title: "Garden State", sub: "Anniversary concert / global livestream" },
  { idx: 4, w: 364, wM: 202, meta: "Tour capture", format: "Tour capture", role: "Multicam coverage", output: "Tour records", file: "/home/posters/rascal-flatts.webp", title: "Rascal Flatts", sub: "Tour capture / multicam live production" },
  { idx: 5, w: 364, wM: 202, meta: "Artist special", format: "Theatrical event", role: "Live coverage", output: "Film + archive", file: "/home/posters/mary-j-blige.webp", title: "Mary J. Blige", sub: "Concert film / theatrical event — Madison Square Garden" },
  { idx: 6, w: 432, wM: 240, meta: "Gala", format: "Benefit concert", role: "Large-format capture", output: "Recap + records", file: "/home/posters/elton-john.webp", title: "Elton John", sub: "Benefit concert / large-format live capture — Petco Park" },
];

export type ServiceRole = { name: string; desc: string };
export type Service = {
  title: string;
  indent: number; // staggered poster-line indent (px, desktop)
  note: string; // mono annotation chip
  idealFor: string; // "Ideal for" row in the open panel
  body: string;
  roles?: ServiceRole[];
};

export const SERVICES: Service[] = [
  {
    title: "Concert Films & Livestreams",
    indent: 0,
    note: "01 — Camera plan, live cut, final delivery",
    idealFor: "Arena shows, artist specials, livestream premieres, tour captures.",
    body: "Cinema-camera coverage for concerts and artist specials, switched live and finished for release. We handle the camera plot, engineering, recording, program cut, and delivery path so the show looks intentional in the room, online, and in the archive.",
  },
  {
    title: "Touring IMAG & Festival Screens",
    indent: 120,
    note: "02 — Big-screen picture that travels",
    idealFor: "Headline sets, festival stages, touring packages, venue screens.",
    body: "Clean, cinematic IMAG for headline sets, festivals, and touring packages. We build the signal chain, integrate with stage/video departments, and keep the picture consistent from rehearsal through doors.",
  },
  {
    title: "Corporate & Brand Broadcasts",
    indent: 40,
    note: "03 — Premium picture for high-visibility rooms",
    idealFor: "Launches, executive events, conferences, brand moments.",
    body: "Multicamera coverage for keynotes, launches, conferences, and branded moments. We work alongside AV and staging teams to create a polished live cut, stream, and recording that feels aligned with the brand.",
  },
  {
    title: "Galas & Fundraiser Programs",
    indent: 180,
    note: "04 — Quiet, polished, donor-facing",
    idealFor: "Donor rooms, honoree programs, live auctions, hybrid galas.",
    body: "Elegant live video support for formal rooms: stage coverage, IMAG, giving moments, stream feeds, and recap-ready recordings. The crew stays discreet, the picture stays composed, and the program keeps moving.",
  },
  {
    title: "Technical Direction & Crew",
    indent: 70,
    note: "05 — Senior operators, engineers, and support",
    idealFor: "Production teams, AV partners, festivals, shows needing senior video support.",
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

// Hero pillars (Cinema / Live / Archive)
export type Pillar = { name: string; note: string };
export const PILLARS: Pillar[] = [
  { name: "Cinema", note: "Camera packages" },
  { name: "Live", note: "Program cut" },
  { name: "Archive", note: "Final deliverables" },
];

// 00b — the system behind the picture
export type SystemPhase = {
  idx: string;
  name: string;
  body: string;
  chips: string[];
  hot?: boolean; // the "during the show" card carries the red dash + lift
};
export const SYSTEM_PHASES: SystemPhase[] = [
  { idx: "01", name: "Before doors", body: "Camera plot, crew shape, venue realities, show flow, and deliverables.", chips: ["Camera plot", "Delivery"] },
  { idx: "02", name: "During the show", body: "A director-led live cut, comms, monitoring, stage integration, and room/stream awareness.", chips: ["Program", "Records"], hot: true },
  { idx: "03", name: "After the room clears", body: "Program cut, ISO records, audio paths, recap, archive, and release-ready assets.", chips: ["Records", "Delivery"] },
];

export type Standard = { tag: string; mark: "dot" | "dash"; title: string; body: string };
export const STANDARDS: Standard[] = [
  { tag: "REC / ISO", mark: "dot", title: "Redundant records", body: "Program, ISOs, and post-ready paths when the show requires it." },
  { tag: "COMMS", mark: "dash", title: "Comms-first crew", body: "Director, operators, engineering, and stage aligned before doors." },
  { tag: "ROOM + STREAM", mark: "dot", title: "Room + stream aware", body: "IMAG, livestream, archive, and recap treated as separate outputs." },
  { tag: "DIR / TD", mark: "dash", title: "Senior technical leadership", body: "A calm video department that knows how to work with AV, stage, and talent." },
];

// 03 — what happens next strip
export const NEXT_STEPS = ["Availability", "Approach", "Hold"];
