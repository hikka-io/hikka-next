import type { FC, PropsWithChildren } from 'react';

import { ContentTypeEnum, type MainContentTypeEnum } from '@hikka/api';

import { usePageHeader } from '@/features/app-shell';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { CONTENT_TYPE_LINKS } from '@/utils/content-paths';
import { usePathname } from '@/utils/navigation';

import ContentActionBar from './content-action-bar';
import ContentActionsMenu from './content-actions-menu';
import {
    ANIME_NAV_ROUTES,
    MANGA_NAV_ROUTES,
    NOVEL_NAV_ROUTES,
} from './content-nav-routes';
import NsfwOverlay from './nsfw-overlay';

const CONTENT_NAV_ROUTES = {
    [ContentTypeEnum.ANIME]: ANIME_NAV_ROUTES,
    [ContentTypeEnum.MANGA]: MANGA_NAV_ROUTES,
    [ContentTypeEnum.NOVEL]: NOVEL_NAV_ROUTES,
} satisfies Record<MainContentTypeEnum, Hikka.NavRoute[]>;

type Props = PropsWithChildren & {
    slug: string;
    title: string;
    nsfw?: boolean;
    nsfwConsented?: boolean;
} & (
        | { contentType: MainContentTypeEnum; navRoutes?: never }
        | {
              contentType:
                  | typeof ContentTypeEnum.CHARACTER
                  | typeof ContentTypeEnum.PERSON;
              navRoutes: Hikka.NavRoute[];
          }
    );

const ContentDetailLayout: FC<Props> = ({
    slug,
    contentType,
    navRoutes,
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

    const nsfwAllowed = (preferences.show_nsfw ?? false) || nsfwConsented;

    usePageHeader({
        title,
        parent: isContentRoot ? urlPrefix : contentUrl,
        navRoutes:
            contentType === ContentTypeEnum.CHARACTER ||
            contentType === ContentTypeEnum.PERSON
                ? navRoutes
                : CONTENT_NAV_ROUTES[contentType],
        navUrlPrefix: contentUrl,
        anchored: isContentRoot,
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

            <ContentActionBar content_type={contentType} className="mt-12" />
        </>
    );
};

export default ContentDetailLayout;
