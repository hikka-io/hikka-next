/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://hikkaio.vercel.app',
    generateRobotsTxt: true,
    sitemapSize: 1000,
}

