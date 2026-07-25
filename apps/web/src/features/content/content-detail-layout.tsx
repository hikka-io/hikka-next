import type { FC, PropsWithChildren } from 'react';

import type { MainContentTypeEnum } from '@hikka/api';

import { usePageHeader } from '@/features/app-shell';
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
    const contentUrl = `${urlPrefix}/${slug}`;

    usePageHeader({
        title,
        parent: pathname === contentUrl ? urlPrefix : contentUrl,
        navRoutes,
        navUrlPrefix: contentUrl,
    });

    return (
        <>
            {nsfw && !nsfwConsented && <NsfwOverlay />}
            {children}

            <ContentActionBar content_type={contentType} className="mt-12" />
        </>
    );
};

export default ContentDetailLayout;
