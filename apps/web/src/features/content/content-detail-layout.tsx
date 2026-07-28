import type { FC, PropsWithChildren } from 'react';

import type { MainContentTypeEnum } from '@hikka/api';

import { usePageHeader } from '@/features/app-shell';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { usePathname } from '@/utils/navigation';

import ContentActionBar from './content-action-bar';
import NsfwOverlay from './nsfw-overlay';

type Props = PropsWithChildren & {
    slug: string;
    contentType: MainContentTypeEnum | 'character' | 'person';
    navRoutes: Hikka.NavRoute[];
    urlPrefix: string;
    title: string;
    nsfw?: boolean;
    nsfwConsented?: boolean;
};

const ContentDetailLayout: FC<Props> = ({
    slug,
    contentType,
    navRoutes,
    urlPrefix,
    title,
    nsfw,
    nsfwConsented,
    children,
}) => {
    const pathname = usePathname();
    const { preferences } = useSessionUI();
    const contentUrl = `${urlPrefix}/${slug}`;
    const isContentRoot = pathname === contentUrl;

    const nsfwAllowed = (preferences.show_nsfw ?? false) || nsfwConsented;

    usePageHeader({
        title,
        parent: isContentRoot ? urlPrefix : contentUrl,
        navRoutes,
        navUrlPrefix: contentUrl,
        anchored: isContentRoot,
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
