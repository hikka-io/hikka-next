export default {
    baseAPI:
        (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL) + '/api',
    config: {
        headers: {
            'Content-type': 'application/json',
        },
        next: {
            revalidate: 0,
        },
    },
};
