import { type FC, type PropsWithChildren, useMemo } from 'react';

import { ContentTypeEnum } from '@hikka/api';

import { usePageHeader } from '@/features/app-shell';
import { useSessionUI } from '@/services/session';
import { CONTENT_TYPE_LINKS } from '@/utils/content-paths';
import { usePathname } from '@/utils/navigation';

import ContentActionBar from './content-action-bar';
import ContentActionsMenu from './content-actions-menu';
import { contentNavRoutes, type NavContentType } from './content-nav-routes';
import FranchiseGraphDialog from './franchise/graph/franchise-graph-dialog';
import NsfwOverlay from './nsfw-overlay';

type Props = PropsWithChildren & {
    slug: string;
    contentType: NavContentType;
    title: string;
    nsfw?: boolean;
    nsfwConsented?: boolean;
};

const ContentDetailLayout: FC<Props> = ({
    slug,
    contentType,
    title,
    nsfw,
    nsfwConsented,
    children,
}) => {
    const pathname = usePathname();
    const { preferences } = useSessionUI();
    const urlPrefix = CONTENT_TYPE_LINKS[contentType];
    const contentUrl = `${urlPrefix}/${slug}`;
    const isContentRoot = pathname === contentUrl;

    const navRoutes = useMemo(
        () => contentNavRoutes(contentType, slug),
        [contentType, slug],
    );
    const nsfwAllowed = (preferences.show_nsfw ?? false) || nsfwConsented;

    usePageHeader({
        title,
        parent: isContentRoot ? urlPrefix : contentUrl,
        navRoutes,
        anchored: true,
        actionsComponent: () => (
            <ContentActionsMenu
                url={contentUrl}
                slug={slug}
                contentType={contentType}
            />
        ),
    });

    return (
        <>
            {nsfw && !nsfwAllowed && <NsfwOverlay />}
            {children}
            {contentType !== ContentTypeEnum.CHARACTER &&
                contentType !== ContentTypeEnum.PERSON &&
                !(nsfw && !nsfwAllowed) && (
                    <FranchiseGraphDialog
                        content_type={contentType}
                        slug={slug}
                    />
                )}

            <ContentActionBar content_type={contentType} className="mt-12" />
        </>
    );
};

export default ContentDetailLayout;
