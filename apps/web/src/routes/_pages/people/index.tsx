import { createFileRoute } from '@tanstack/react-router';

import { generateHeadMeta } from '@/utils/metadata';
import { SITE_ORIGIN } from '@/utils/url';

export const Route = createFileRoute('/_pages/people/')({
    head: () =>
        generateHeadMeta({
            title: 'Люди',
            description: 'Каталог людей — режисери, сейю та автори на Hikka',
            url: `${SITE_ORIGIN}/people`,
        }),
    component: PeopleListPage,
});

function PeopleListPage() {
    return null;
}
