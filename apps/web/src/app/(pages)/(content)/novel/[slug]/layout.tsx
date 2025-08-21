import { ContentTypeEnum } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import {
    prefetchNovelBySlug,
    prefetchSearchArticles,
} from '@hikka/react/server';
import { Metadata } from 'next';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import NavMenu from '@/components/navigation/nav-dropdown';

import NovelNavbar from '@/features/novel/novel-view/novel-navbar/novel-navbar.component';

import { NOVEL_NAV_ROUTES } from '@/utils/constants/navigation';
import getHikkaClientConfig from '@/utils/get-hikka-client-config';
import { cn } from '@/utils/utils';

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

const NovelLayout: FC<Props> = async (props) => {
    const params = await props.params;
    const { slug } = params;
    const { children } = props;

    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    const novel = await prefetchNovelBySlug({ slug, queryClient });

    if (!novel) {
        return permanentRedirect('/');
    }

    await prefetchQueries({ params: { slug }, queryClient });
    await prefetchSearchArticles({
        args: {
            content_slug: slug,
            content_type: ContentTypeEnum.NOVEL,
        },
        clientConfig,
        queryClient,
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <Breadcrumbs>
                <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                    {novel?.status && (
                        <div
                            className={cn(
                                'size-2 rounded-full bg-white',
                                `bg-${novel?.status}-foreground`,
                            )}
                        />
                    )}
                    <Link
                        href={'/novel/' + novel?.slug}
                        className="flex-1 overflow-hidden text-ellipsis text-sm font-bold hover:underline"
                    >
                        {novel?.title_ua ||
                            novel?.title_en ||
                            novel?.title_original}
                    </Link>
                </div>
                <NavMenu
                    routes={NOVEL_NAV_ROUTES}
                    urlPrefix={`/novel/${slug}`}
                />
            </Breadcrumbs>

            {children}

            <NovelNavbar className="mt-12" />
        </HydrationBoundary>
    );
};

export default NovelLayout;
