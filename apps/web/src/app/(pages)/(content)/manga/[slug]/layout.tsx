import { ContentTypeEnum } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import {
    prefetchMangaBySlug,
    prefetchSearchArticles,
} from '@hikka/react/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import NavMenu from '@/components/navigation/nav-dropdown';

import { ContentNavbar } from '@/features/content';

import { cn } from '@/utils/cn';
import { MANGA_NAV_ROUTES } from '@/utils/constants/navigation';
import { getHikkaClientConfig } from '@/utils/hikka-client';

import _generateMetadata, { MetadataProps } from './layout.metadata';
import prefetchQueries from './layout.queries';

interface Props extends PropsWithChildren {
    params: {
        slug: string;
    };
}

export async function generateMetadata(
    props: MetadataProps,
): Promise<Metadata> {
    const params = await props.params;
    const searchParams = await props.searchParams;

    return await _generateMetadata({ params, searchParams });
}

const MangaLayout: FC<Props> = async (props) => {
    const params = await props.params;
    const { slug } = params;
    const { children } = props;

    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    const manga = await prefetchMangaBySlug({
        slug,
        clientConfig,
        queryClient,
    });

    if (!manga) {
        return permanentRedirect('/');
    }

    await prefetchQueries({ params: { slug }, queryClient });
    await prefetchSearchArticles({
        args: {
            content_slug: slug,
            content_type: ContentTypeEnum.MANGA,
        },
        clientConfig,
        queryClient,
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <Breadcrumbs>
                <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                    {manga?.status && (
                        <div
                            className={cn(
                                'size-2 rounded-full bg-white',
                                `bg-${manga?.status}-foreground`,
                            )}
                        />
                    )}
                    <Link
                        href={'/manga/' + manga?.slug}
                        className="flex-1 overflow-hidden text-ellipsis text-sm font-bold hover:underline"
                    >
                        {manga?.title_ua ||
                            manga?.title_en ||
                            manga?.title_original}
                    </Link>
                </div>
                <NavMenu
                    routes={MANGA_NAV_ROUTES}
                    urlPrefix={`/manga/${slug}`}
                />
            </Breadcrumbs>

            {children}

            <ContentNavbar
                content_type={ContentTypeEnum.MANGA}
                className="mt-12"
            />
        </HydrationBoundary>
    );
};

export default MangaLayout;
