// Camera-slate section plate — the page's wayfinding device:
// ink plate, red accent edge bar, mono index cell, name + descriptor.
export default function Slate({
  idx,
  name,
  sub,
}: {
  idx: string;
  name: string;
  sub: string;
}) {
  return (
    <div className="hm-slate">
      <span className="hm-slate-bar" />
      <span className="hm-slate-idx">{idx}</span>
      <span className="hm-slate-body">
        <span className="hm-slate-name">{name}</span>
        <span className="hm-slate-sub">{sub}</span>
      </span>
    </div>
  );
}
