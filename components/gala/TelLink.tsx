"use client";

import { track } from "@/lib/gala/track";

// Single phone number, labeled by placement for the tel_click event.
export default function TelLink({
  placement,
  className,
}: {
  placement: "hero" | "sticky" | "rates" | "footer";
  className?: string;
}) {
  return (
    <a
      className={className}
      href="tel:+19492367573"
      onClick={() => track("tel_click", { placement })}
    >
      (949) 236-7573
    </a>
  );
}
