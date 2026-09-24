export type AboutTeamMember = (typeof ABOUT_CONTENT.team)[number];

export const ABOUT_CONTENT = {
    description: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet augue. Vestibulum auctor ornare leo, non suscipit magna interdum eu. Curabitur pellentesque nibh nibh, at maximus ante fermentum sit amet. Pellentesque commodo lacus at sodales sodales. Quisque sagittis orci ut diam condimentum, vel euismod erat placerat. In iaculis arcu eros, eget tempus orci facilisis id.',
    ],
    team: [
        {
            reference: '49c60ffe-c1d8-45a7-ace7-531b19ec3d98',
            role: 'Front-end / Співзасновник',
            quoteFromProfile: true,
            links: [
                { title: 'Telegram', href: 'https://t.me/olexh' },
                { title: 'GitHub', href: 'https://github.com/olexh' },
            ],
        },
        {
            reference: '6ca960d0-b84f-4769-bef5-b132c0211613',
            role: 'Back-end / Співзасновник',
            quoteFromProfile: true,
            links: [{ title: 'volbil.com', href: 'https://volbil.com' }],
        },
        {
            reference: '47dc6171-0426-456e-9c37-a8598afd67ae',
            role: 'Світла пам’ять',
            memorial:
                'Зробив великий внесок у розвиток Хікки. Загинув на війні, захищаючи Україну.',
            links: [],
        },
        {
            reference: '23f98f78-5434-4ec5-a174-47a3734dc619',
            role: 'Модератор',
            links: [],
        },
        {
            reference: '4910f871-3441-4609-b5b9-8476c8ad6dbd',
            role: 'Модератор',
            links: [],
        },
        {
            reference: 'bed68b8f-fe4f-4439-9965-d5fab23b8a34',
            role: 'Модератор',
            links: [],
        },
        {
            reference: '3109e94f-538b-4e43-9a84-6b49c92bb8c2',
            role: 'Модератор',
            links: [],
        },
        {
            reference: '461e2b32-ae87-4ca2-a5f7-1fafedbda58f',
            role: 'Модератор',
            links: [
                { title: 'Telegram', href: 'https://t.me/rosset_nocpes' },
                {
                    title: 'GitHub',
                    href: 'https://github.com/rosset-nocpes',
                },
            ],
        },
        {
            reference: '94e69306-fd6e-4267-b38b-6e5372918ad3',
            role: 'Модератор',
            links: [],
        },
    ],
    thanks: [
        'fa0955fc-4755-4b89-b174-0bada2bf0b50',
        'b0a8ae7f-ab1a-4a07-a5bb-897d1c989190',
        'b4e22f4c-fa28-4e36-8e48-f49694189204',
        'c8bd3fd4-748c-4656-baf1-fe1e2f5f9be6',
    ],
} as const;
