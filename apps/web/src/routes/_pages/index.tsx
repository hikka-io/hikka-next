import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';

import { CoverImage, usePageHeader } from '@/features/app-shell';
import { FeedLayout, HomeHeaderActions } from '@/features/home';
import { loadHomePage } from '@/features/home/queries';
import { useSession } from '@/services/session';
import { generateHeadMeta } from '@/utils/metadata';
import { feedSearchSchema } from '@/utils/search-schemas';
import { SITE_ORIGIN } from '@/utils/url';

const HeaderWordmark = () => (
    <span
        role="img"
        aria-label="Hikka"
        className="logo-full h-4 w-14 shrink-0 bg-left"
    />
);

export const Route = createFileRoute('/_pages/')({
    validateSearch: zodValidator(feedSearchSchema),
    head: () =>
        generateHeadMeta({
            title: 'Hikka - енциклопедія аніме, манґи та ранобе українською',
            url: SITE_ORIGIN,
        }),
    loader: ({ context }) => loadHomePage(context),
    component: HomePage,
});

function HomePage() {
    const { user: loggedUser } = useSession();

    usePageHeader({
        title: 'Головна',
        titleComponent: HeaderWordmark,
        actionsComponent: HomeHeaderActions,
        hideBack: true,
    });

    return (
        <>
            <CoverImage cover={loggedUser?.cover} />
            <FeedLayout />
        </>
    );
}
