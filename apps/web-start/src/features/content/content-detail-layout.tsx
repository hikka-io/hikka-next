import { ContentTypeEnum } from '@hikka/client';
import { Link } from '@/utils/navigation';
import { FC, PropsWithChildren } from 'react';

import Breadcrumbs from '@/features/common/nav-breadcrumbs';
import NavMenu from '@/features/common/nav-dropdown';

import { ContentNavbar } from '@/features/content';

import { cn } from '@/utils/cn';

interface Props extends PropsWithChildren {
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
}

const ContentDetailLayout: FC<Props> = ({
    slug,
    contentType,
    navRoutes,
    urlPrefix,
    title,
    status,
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
                        className="flex-1 overflow-hidden text-ellipsis text-sm font-bold hover:underline"
                    >
                        {title}
                    </Link>
                </div>
                <NavMenu
                    routes={navRoutes}
                    urlPrefix={`${urlPrefix}/${slug}`}
                />
            </Breadcrumbs>

            {children}

            <ContentNavbar
                content_type={contentType}
                className="mt-12"
            />
        </>
    );
};

export default ContentDetailLayout;
