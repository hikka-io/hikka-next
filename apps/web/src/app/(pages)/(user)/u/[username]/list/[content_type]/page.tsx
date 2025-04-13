import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { Metadata, ResolvingMetadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { FC } from 'react';

import Block from '../../../../../../../components/ui/block';
import ReadFilters from '../../../../../../../features/filters/read-filters.component';
import List from '../../../../../../../features/users/user-readlist/readlist/readlist.component';
import StatusCombobox from '../../../../../../../features/users/user-readlist/status-combobox.component';
import ToolsCombobox from '../../../../../../../features/users/user-readlist/tools-combobox.component';
import ViewCombobox from '../../../../../../../features/users/view-combobox.component';
import { prefetchReadList } from '../../../../../../../services/hooks/read/use-read-list';
import _generateMetadata from '../../../../../../../utils/generate-metadata';
import getQueryClient from '../../../../../../../utils/get-query-client';

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

    const { username, content_type } = params;

    const searchParams = await props.searchParams;

    const { status, sort } = searchParams;

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

    await prefetchReadList({
        username,
        read_status: status as API.ReadStatus,
        sort: [`${sort}:desc`],
        content_type: content_type as 'manga' | 'novel',
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
                    <ReadFilters
                        content_type={content_type as API.ContentType}
                        sort_type="read"
                    />
                </div>
            </div>
        </HydrationBoundary>
    );
};

export default ListPage;
