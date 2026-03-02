/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [
            "sankavollerei.com",
            "cdn.sankavollerei.com",
            "img.sankanime.com"
        ]
    }
};
module.exports = nextConfig;
