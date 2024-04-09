export default {
    baseAPI: process.env.API_URL || process.env.NEXT_PUBLIC_API_URL,
    config: {
        headers: {
            'Content-type': 'application/json',
        },
        next: {
            revalidate: 0,
        },
    },
};
