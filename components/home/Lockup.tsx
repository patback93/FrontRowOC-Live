// FR monogram + locked wordmark lockup (design system D3 lockup,
// reproduced from the brandbook's Monogram/Wordmark components).
export default function Lockup({ footer = false }: { footer?: boolean }) {
  return (
    <span className={`hm-lockup${footer ? " hm-lockup-footer" : ""}`}>
      <span className="hm-monogram" aria-hidden="true">
        FR
        <span className="hm-tally" />
      </span>
      <span className="hm-wordmark">
        <span className="hm-wm-1">Front Row</span>
        <span className="hm-wm-2">
          Broadcast
          <span className="hm-tally hm-sm" />
        </span>
      </span>
    </span>
  );
}
