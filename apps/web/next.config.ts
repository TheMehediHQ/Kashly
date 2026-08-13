import path from "node:path";
import dotenv from "dotenv";
import type { NextConfig } from "next";

// Load the shared root .env (git-ignored) so NEXT_PUBLIC_* vars (e.g. the
// Cloudinary vars) are inlined during local dev/build. On Vercel this is a
// no-op when the file does not exist - env vars come from project settings.
dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    // Local development only: proxy same-origin /api/* calls to the Express
    // API (apps/api) started by `bun run dev`.
    // In production, vercel.json routes /api/* to the serverless Express
    // function, so no Next.js rewrite is needed (or wanted).
    if (process.env.NODE_ENV === "production") {
      return [];
    }

    const apiPort = process.env.API_PORT || "5000";

    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: `http://localhost:${apiPort}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;