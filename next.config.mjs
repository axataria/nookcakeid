import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

// A production build must never replace the HTML/chunks of a running dev server.
export default function nextConfig(phase) {
  return {
    images: {
      qualities: [75, 85],
    },
    distDir:
      process.env.NEXT_DIST_DIR ||
      (phase === PHASE_DEVELOPMENT_SERVER ? ".next-development" : ".next"),
  };
}
