import bundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',

    reactCompiler: true,
    reactStrictMode: true,
    pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
    images: {
        unoptimized: true,
        qualities: [75, 85],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '',
                pathname: '**',
            },
        ],
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    async redirects() {
        return [
            {
                source: '/u/:username/list',
                destination: '/u/:username/list/anime',
                permanent: true,
            },
            {
                source: '/api/metrics',
                destination: `/`,
                permanent: true,
            },
        ];
    },
};

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
});

// const withPlausibleProxy = plausibleProxy({});

export default withBundleAnalyzer(nextConfig);
