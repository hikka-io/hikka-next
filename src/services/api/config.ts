const config = {
    baseAPI: process.env.API_URL || process.env.NEXT_PUBLIC_SITE_URL + '/api',
    config: {
        headers: {
            'Content-type': 'application/json',
        },
    },
};

export default config;
