import bundleAnalyzer from '@next/bundle-analyzer';
import Icons from 'unplugin-icons/webpack';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    eslint: {
        ignoreDuringBuilds: false,
    },
    reactStrictMode: true,
    productionBrowserSourceMaps: false,
    pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '',
                pathname: '**',
            },
        ],
    },
    webpack(config) {
        config.plugins.push(
            Icons({
                compiler: 'jsx',
                jsx: 'react',
            }),
        );

        return config;
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.API_URL}/:path*`,
            },
        ];
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
