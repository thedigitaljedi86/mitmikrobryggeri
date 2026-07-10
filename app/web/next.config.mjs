/** @type {import('next').NextConfig} */
const nextConfig = {
  // better-sqlite3 er en native modul — må ikke bundtes af webpack/turbopack,
  // kun kræves på serveren.
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
