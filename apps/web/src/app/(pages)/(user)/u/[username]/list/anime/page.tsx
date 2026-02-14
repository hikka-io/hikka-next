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

import { AnimeFilters } from '@/features/filters';
import {
    Userlist,
    UserlistHeader,
    UserlistStatusCombobox,
    UserlistToolsCombobox,
    UserlistViewCombobox,
} from '@/features/users';

import { getHikkaClientConfig } from '@/utils/hikka-client';
import { generateMetadata as _generateMetadata } from '@/utils/metadata';

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
        queryClient,
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-12">
                <Block>
                    <UserlistHeader content_type={ContentTypeEnum.ANIME} />
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <UserlistStatusCombobox
                                content_type={ContentTypeEnum.ANIME}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <UserlistViewCombobox />
                            <UserlistToolsCombobox
                                content_type={ContentTypeEnum.ANIME}
                            />
                        </div>
                    </div>
                    <Userlist content_type={ContentTypeEnum.ANIME} />
                </Block>
                <div className="sticky top-20 hidden w-full max-h-[calc(100vh-9rem)] self-start rounded-lg border border-border bg-secondary/20 backdrop-blur-xl overflow-hidden sm:flex">
                    <AnimeFilters
                        sort_type="watch"
                        content_type={ContentTypeEnum.ANIME}
                    />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default ListPage;
