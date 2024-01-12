export default {
    baseAPI: 'https://api.hikka.io',
    config: {
        headers: {
            'Content-type': 'application/json',
        },
        next: {
            revalidate: 1,
        },
    },
};
