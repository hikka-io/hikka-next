import type { FC, PropsWithChildren } from 'react';

import type { ContentTypeEnum } from '@hikka/client';

import Breadcrumbs from '@/features/app-shell/nav-breadcrumbs';
import NavMenu from '@/features/app-shell/nav-dropdown';
import { cn } from '@/utils/cn';
import { Link } from '@/utils/navigation';

import ContentActionBar from './content-action-bar';
import NsfwOverlay from './nsfw-overlay';

type Props = PropsWithChildren & {
    slug: string;
    contentType:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL
        | ContentTypeEnum.CHARACTER
        | ContentTypeEnum.PERSON;
    navRoutes: Hikka.NavRoute[];
    urlPrefix: string;
    title: string;
    status?: string | null;
    nsfw?: boolean;
    nsfwConsented?: boolean;
};

const ContentDetailLayout: FC<Props> = ({
    slug,
    contentType,
    navRoutes,
    urlPrefix,
    title,
    status,
    nsfw,
    nsfwConsented,
    children,
}) => {
    return (
        <>
            <Breadcrumbs>
                <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                    {status && (
                        <div
                            className={cn(
                                'size-2 rounded-full bg-white',
                                `bg-${status}-foreground`,
                            )}
                        />
                    )}
                    <Link
                        to={`${urlPrefix}/${slug}`}
                        className="flex-1 overflow-hidden text-ellipsis font-bold text-sm hover:underline"
                    >
                        {title}
                    </Link>
                </div>
                <NavMenu
                    routes={navRoutes}
                    urlPrefix={`${urlPrefix}/${slug}`}
                />
            </Breadcrumbs>

            {nsfw && !nsfwConsented && <NsfwOverlay />}
            {children}

            <ContentActionBar content_type={contentType} className="mt-12" />
        </>
    );
};

export default ContentDetailLayout;
