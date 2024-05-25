import { Metadata, ResolvingMetadata } from 'next';
import { redirect } from 'next/navigation';
import { FC } from 'react';

import Block from '@/components/ui/block';

import Filters from '@/features/filters/anime-filters.component';
import StatusCombobox from '@/features/users/user-watchlist/status-combobox.component';
import ToolsCombobox from '@/features/users/user-watchlist/tools-combobox.component';
import ViewCombobox from '@/features/users/user-watchlist/view-combobox.component';
import List from '@/features/users/user-watchlist/watchlist/watchlist.component';

import _generateMetadata from '@/utils/generateMetadata';

export async function generateMetadata(
    { params }: { params: { username: string } },
    parent: ResolvingMetadata,
): Promise<Metadata> {
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

const ListPage: FC<Props> = ({
    searchParams: { status, sort },
    params: { username },
}) => {
    if (!status || !sort) {
        if (!status) {
            redirect(`/u/${username}/list?status=completed&sort=watch_score`);
        }

        redirect(`/u/${username}/list?status=${status}&sort=watch_score`);
    }

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
            <Block>
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <StatusCombobox />
                    </div>
                    <div className="flex gap-2">
                        <ViewCombobox />
                        <ToolsCombobox />
                    </div>
                </div>
                <List />
            </Block>
            <div className="sticky top-20 hidden h-fit rounded-md border border-secondary/60 bg-secondary/30 opacity-60 transition-opacity hover:opacity-100 lg:block">
                <Filters className="px-4" type="watchlist" />
            </div>
        </div>
    );
};

export default ListPage;
