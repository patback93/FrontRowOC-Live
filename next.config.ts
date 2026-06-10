import type { NextConfig } from "next";

// Next 16 never runs ESLint as part of `next build`; lint runs standalone
// via `npm run lint`.
const nextConfig: NextConfig = {};

export default nextConfig;
