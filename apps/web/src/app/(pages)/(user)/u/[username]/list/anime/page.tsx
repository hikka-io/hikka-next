import { ContentTypeEnum, WatchStatusEnum } from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchSearchUserWatches } from '@hikka/react/server';
import { Metadata, ResolvingMetadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { FC } from 'react';

import Block from '@/components/ui/block';

import Filters from '@/features/filters/anime-filters.component';
import StatusCombobox from '@/features/users/user-watchlist/status-combobox.component';
import ToolsCombobox from '@/features/users/user-watchlist/tools-combobox.component';
import List from '@/features/users/user-watchlist/watchlist/watchlist.component';
import ViewCombobox from '@/features/users/view-combobox.component';

import _generateMetadata from '@/utils/generate-metadata';
import getHikkaClientConfig from '@/utils/get-hikka-client-config';

export async function generateMetadata(
    props: { params: Promise<{ username: string }> },
    parent: ResolvingMetadata,
): Promise<Metadata> {
    const params = await props.params;
    const parentMetadata = await parent;

    return _generateMetadata({
        title: 'Список',
        description: parentMetadata.openGraph?.description,
        images: parentMetadata.openGraph?.images,
    });
}

interface Props {
    searchParams: { [key: string]: string | string[] | undefined };
    params: { username: string };
}

const ListPage: FC<Props> = async (props) => {
    const params = await props.params;
    const { username } = params;
    const searchParams = await props.searchParams;
    const { status, sort } = searchParams;

    if (!status || !sort) {
        if (!status) {
            permanentRedirect(
                `/u/${username}/list?status=completed&sort=watch_score`,
            );
        }

        permanentRedirect(
            `/u/${username}/list?status=${status}&sort=watch_score`,
        );
    }

    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    await prefetchSearchUserWatches({
        username,
        args: {
            watch_status: status as WatchStatusEnum,
            sort: [`${sort}:desc`],
        },
        clientConfig,
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
                <Block>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <StatusCombobox />
                        </div>
                        <div className="flex items-center gap-2">
                            <ViewCombobox />
                            <ToolsCombobox />
                        </div>
                    </div>
                    <List />
                </Block>
                <div className="sticky top-20 hidden h-fit opacity-60 transition-opacity hover:opacity-100 lg:block">
                    <Filters
                        sort_type="watch"
                        content_type={ContentTypeEnum.ANIME}
                    />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default ListPage;
