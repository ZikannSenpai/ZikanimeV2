/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    images: { domains: ["*"] },
    headers: async () => {
        return [
            {
                source: "/anime/watch",
                headers: [
                    { key: "X-Frame-Options", value: "ALLOWALL" },
                    {
                        key: "Content-Security-Policy",
                        value: "frame-ancestors *;"
                    }
                ]
            }
        ];
    }
};
