import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        turbo: {
            rules: {
                "*.svg": {
                    loaders: ["@svgr/webpack"],
                    as: "*.js",
                },
            },
        },
    },
    webpack: (config) => {
        // Add rule for SVG files
        config.module.rules.push({
            test: /\.svg$/,
            use: ["@svgr/webpack", "url-loader"],
        });

        return config;
    },
        transpilePackages: [
        '@gravity-ui/icons',
        'bem-cn-lite',
        '@gravity-ui/uikit',
        // Remove @gravity-ui/uikit from here
    ],
    reactStrictMode: true,
};

export default nextConfig;



// const nextConfig = {
//     webpack: (config) => {
//         config.module.rules.push({
//             test: /\.svg$/i,
//             issuer: /\.[jt]sx?$/,
//             use: ['@svgr/webpack'],
//         });
//         return config;
//     },
//     transpilePackages: [
//         '@gravity-ui/icons',
//         'bem-cn-lite',
//         '@gravity-ui/uikit',
//         // Remove @gravity-ui/uikit from here
//     ],
// };

