import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Produce a standalone build for Docker — copies only what's needed to run.
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js/output
  // output: "standalone", // Disabled because we use pm2 next start

  // Multi-server deployments: version-skew protection
  ...(process.env.DEPLOYMENT_VERSION && {
    deploymentId: process.env.DEPLOYMENT_VERSION,
  }),

  // Consistent build ID across containers (falls back to random when env unset)
  ...(process.env.GIT_HASH && {
    generateBuildId: async () => process.env.GIT_HASH!,
  }),

  // Allow images from any tenant domain
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Suppress X-Powered-By header in production
  poweredByHeader: false,

  // Streaming: prevent nginx from buffering RSC responses
  async headers() {
    return [
      {
        source: "/:path*{/}?",
        headers: [{ key: "X-Accel-Buffering", value: "no" }],
      },
    ];
  },
};

export default nextConfig;
