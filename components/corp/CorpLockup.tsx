// FR monogram + wordmark lockup, sized via CSS vars so the nav (38/24),
// mobile menu (34/22), and footer (44/28) share one component.
export default function CorpLockup({
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
      className="cp-lockup"
      aria-hidden="true"
      style={
        {
          "--lk-tile": `${tile}px`,
          "--lk-word": `${word}px`,
          "--lk-gap": `${gap}px`,
        } as React.CSSProperties
      }
    >
      <span className="cp-monogram">
        FR
        <span className="cp-monogram-dot" />
      </span>
      <span className="cp-wordmark">
        <span className="cp-wm-1">Front Row</span>
        <span className="cp-wm-2">
          Broadcast
          <span className="cp-wm-dot" />
        </span>
      </span>
    </span>
  );
}
