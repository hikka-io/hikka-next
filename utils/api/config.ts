export default {
    baseAPI: 'https://testapi.hikka.io',
    config: {
        headers: {
            'Content-type': 'application/json',
        },
        next: {
            revalidate: 1,
        },
    },
};
