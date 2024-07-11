import { dehydrate } from '@tanstack/query-core';
import { HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FC, PropsWithChildren } from 'react';

import Breadcrumbs from '@/components/navigation/nav-breadcrumbs';
import NavMenu from '@/components/navigation/nav-dropdown';
import InternalNavBar from '@/components/navigation/nav-tabs';
import SubBar from '@/components/navigation/sub-nav';

import Actions from '@/features/manga/manga-view/actions/actions.component';
import Cover from '@/features/manga/manga-view/cover.component';
import Title from '@/features/manga/manga-view/title.component';

import { prefetchMangaInfo } from '@/services/hooks/manga/use-manga-info';
import { MANGA_NAV_ROUTES, RELEASE_STATUS } from '@/utils/constants';
import getQueryClient from '@/utils/get-query-client';

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
    return await _generateMetadata(props);
}

const MangaLayout: FC<Props> = async ({ params: { slug }, children }) => {
    const queryClient = getQueryClient();

    await prefetchMangaInfo({ slug });

    const manga: API.MangaInfo | undefined = queryClient.getQueryData([
        'manga',
        slug,
    ]);

    if (!manga) {
        return redirect('/');
    }

    await prefetchQueries({ params: { slug } });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <Breadcrumbs>
                <div className="flex w-auto items-center gap-4 overflow-hidden whitespace-nowrap">
                    <div
                        className="size-2 rounded-full bg-white"
                        style={{
                            backgroundColor:
                                RELEASE_STATUS[manga?.status].color,
                        }}
                    />
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
            <SubBar>
                <InternalNavBar
                    routes={MANGA_NAV_ROUTES}
                    urlPrefix={`/manga/${slug}`}
                />
            </SubBar>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[20%_1fr] lg:gap-16">
                <div className="flex flex-col gap-4">
                    <div className="flex w-full flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
                        <Cover />
                        <Actions />
                    </div>
                </div>
                <div className="flex flex-col gap-12">
                    <Title />
                    {children}
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default MangaLayout;
