import { createFileRoute } from '@tanstack/react-router';

import { generateHeadMeta } from '@/utils/metadata';

export const Route = createFileRoute('/_pages/people/')({
    head: () =>
        generateHeadMeta({
            title: 'Люди',
            description:
                'Каталог людей — режисери, сейю та автори на Hikka',
            url: 'https://hikka.io/people',
        }),
    component: PeopleListPage,
});

function PeopleListPage() {
    return null;
}
