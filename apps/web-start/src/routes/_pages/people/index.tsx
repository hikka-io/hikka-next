import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_pages/people/')({
    head: () => ({
        meta: [{ title: 'Люди / Hikka' }],
    }),
    component: PeopleListPage,
});

function PeopleListPage() {
    return null;
}
