// Pure switcher state machine — port of the prototype's unified controller state.
// No DOM here: ControlRoom.tsx owns painting/animation and drives this machine,
// so behavior stays byte-compatible with prototype/frontrow-v3.html.

export type Source = "cam1" | "cam2" | "pb" | "blk";
export type TransMode = "mix" | "wipe";

export const DEFS: Record<Source, { cls: string; short: string }> = {
  cam1: { cls: "f-cam1", short: "CAM 1" },
  cam2: { cls: "f-cam2", short: "CAM 2" },
  pb: { cls: "f-pb", short: "TRIBUTE" },
  blk: { cls: "f-blk", short: "BLK" },
};

const LCD_SHORT: Record<Source, string> = {
  cam1: "CAM 1",
  cam2: "CAM 2",
  pb: "PB",
  blk: "BLK",
};

export interface SwitcherState {
  pgm: Source;
  pvw: Source;
  ftb: boolean;
  trans: TransMode;
  busy: boolean;
}

export interface Switcher {
  readonly state: Readonly<SwitcherState>;
  /** Exchange program and preview. */
  swap(): void;
  /** Tap-to-cut: source straight to program, old program becomes preview. */
  hardCut(src: Source): boolean;
  /** CUT key: flip-flop program/preview. */
  cutKey(): boolean;
  /** Preview bus key. */
  setPreview(src: Source): boolean;
  /** MIX / WIPE keys. */
  setTrans(t: TransMode): boolean;
  /** FTB key — toggles even mid-transition, exactly like the prototype. */
  toggleFtb(): void;
  /** Guarded entry into AUTO / T-bar transition; marks the desk busy. */
  beginTransition(): boolean;
  /** Completed transition: swap buses, clear busy. */
  commit(): void;
  /** Aborted transition (T-bar sprung back): clear busy, no swap. */
  release(): void;
  /** LCD main string: `PGM CAM 1 · PVW PB · MIX`. */
  lcdMain(): string;
}

export function createSwitcher(): Switcher {
  const s: SwitcherState = {
    pgm: "cam1",
    pvw: "pb",
    ftb: false,
    trans: "mix",
    busy: false,
  };
  const swap = () => {
    const o = s.pgm;
    s.pgm = s.pvw;
    s.pvw = o;
  };
  return {
    get state() {
      return s;
    },
    swap,
    hardCut(src) {
      if (s.busy || src === s.pgm) return false;
      s.pvw = s.pgm;
      s.pgm = src;
      return true;
    },
    cutKey() {
      if (s.busy || s.pvw === s.pgm) return false;
      swap();
      return true;
    },
    setPreview(src) {
      if (s.busy) return false;
      s.pvw = src;
      return true;
    },
    setTrans(t) {
      if (s.busy) return false;
      s.trans = t;
      return true;
    },
    toggleFtb() {
      s.ftb = !s.ftb;
    },
    beginTransition() {
      if (s.busy || s.pvw === s.pgm) return false;
      s.busy = true;
      return true;
    },
    commit() {
      swap();
      s.busy = false;
    },
    release() {
      s.busy = false;
    },
    lcdMain() {
      return (
        "PGM " +
        LCD_SHORT[s.pgm] +
        " · PVW " +
        LCD_SHORT[s.pvw] +
        " · " +
        s.trans.toUpperCase()
      );
    },
  };
}
