/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '',
                pathname: '**',
            },
        ],
    },
    '@mui/base': {
        transform: '@mui/base/{{member}}'
    },
    webpack(config) {
        config.plugins.push(
            require('unplugin-icons/webpack')({
                compiler: 'jsx',
                jsx: 'react',
            }),
        )

        return config
    },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(nextConfig)
