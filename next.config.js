// @ts-check
/** @type {import('next').NextConfig} */
const remotePatterns = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
  },
  {
    protocol: "https",
    hostname: "cdn.auto-prospect.web.id",
  },
];

if (process.env.R2_PUBLIC_URL) {
  try {
    const url = new URL(process.env.R2_PUBLIC_URL);
    remotePatterns.push({
      protocol: url.protocol.replace(":", ""),
      hostname: url.hostname,
    });
  } catch (e) {
    console.warn("Warning: R2_PUBLIC_URL is not a valid URL in next.config.js");
  }
}

const nextConfig = {
  images: {
    remotePatterns,
  },
  serverExternalPackages: [
    "@prisma/client",
    "@prisma/adapter-pg",
    "pg",
    "bcryptjs",
  ],
  // Fix: Next.js 16 serverActions body size limit (allow uploads > 1MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

module.exports = nextConfig;
