import {
    ContentTypeEnum,
    ReadContentType,
    ReadStatusEnum,
} from '@hikka/client';
import {
    HydrationBoundary,
    dehydrate,
    getQueryClient,
} from '@hikka/react/core';
import { prefetchSearchUserReads } from '@hikka/react/server';
import { Metadata, ResolvingMetadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { FC } from 'react';

import Block from '@/components/ui/block';

import { ReadFilters } from '@/features/filters';
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
    params: { username: string; content_type: string };
}

const ListPage: FC<Props> = async (props) => {
    const params = await props.params;
    const { username } = params;
    const searchParams = await props.searchParams;
    const { status, sort } = searchParams;
    const content_type = params.content_type as
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;

    if (!status || !sort) {
        if (!status) {
            permanentRedirect(
                `/u/${username}/list/${content_type}?status=completed&sort=read_score`,
            );
        }

        permanentRedirect(
            `/u/${username}/list/${content_type}?status=${status}&sort=read_score`,
        );
    }

    const queryClient = getQueryClient();
    const clientConfig = await getHikkaClientConfig();

    await prefetchSearchUserReads({
        username,
        contentType: content_type as ReadContentType,
        args: {
            read_status: status as ReadStatusEnum,
            sort: [`${sort}:desc`],
        },
        clientConfig,
        queryClient,
    });

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
                <Block>
                    <UserlistHeader content_type={content_type} />
                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            <UserlistStatusCombobox
                                content_type={content_type}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <UserlistViewCombobox />
                            <UserlistToolsCombobox
                                content_type={content_type}
                            />
                        </div>
                    </div>
                    <Userlist content_type={content_type} />
                </Block>
                <div className="sticky top-20 hidden h-fit opacity-60 transition-opacity hover:opacity-100 lg:block">
                    <ReadFilters
                        content_type={content_type as ReadContentType}
                        sort_type="read"
                    />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default ListPage;
