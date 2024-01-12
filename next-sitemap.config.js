/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://hikka.io',
    generateRobotsTxt: true,
    sitemapSize: 1000,
}

