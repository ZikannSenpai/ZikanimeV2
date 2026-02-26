/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["www.sankavollerei.com"] // jika gambar dari domain tersebut
    }
};

module.exports = nextConfig;
