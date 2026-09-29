import { createFileRoute } from '@tanstack/react-router';

import { PersonDetailPage } from '@/features/entities';

export const Route = createFileRoute('/_pages/people/$slug/')({
    component: PersonPage,
});

function PersonPage() {
    const { slug } = Route.useParams();

    return <PersonDetailPage slug={slug} />;
}
