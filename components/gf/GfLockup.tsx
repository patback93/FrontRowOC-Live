// FR monogram + wordmark lockup, sized via CSS vars so the nav (38/24),
// mobile menu (34/22), and footer (44/28) share one component.
export default function GfLockup({
  tile = 38,
  word = 24,
  gap = 13,
}: {
  tile?: number;
  word?: number;
  gap?: number;
}) {
  return (
    <span
      className="gf-lockup"
      aria-hidden="true"
      style={
        {
          "--lk-tile": `${tile}px`,
          "--lk-word": `${word}px`,
          "--lk-gap": `${gap}px`,
        } as React.CSSProperties
      }
    >
      <span className="gf-monogram">
        FR
        <span className="gf-monogram-dot" />
      </span>
      <span className="gf-wordmark">
        <span className="gf-wm-1">Front Row</span>
        <span className="gf-wm-2">
          Broadcast
          <span className="gf-wm-dot" />
        </span>
      </span>
    </span>
  );
}
