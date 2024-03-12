import { Metadata, ResolvingMetadata } from 'next';

import { redirect } from 'next/navigation';

import Filters from '@/components/filters/anime-filters';
import _generateMetadata from '@/utils/generateMetadata';

import List from './_components/list/list';
import StatusCombobox from './_components/status-combobox';
import ToolsCombobox from './_components/tools-combobox';
import ViewCombobox from './_components/view-combobox';


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

const Component = ({
    searchParams: { status, sort },
    params: { username },
}: Props) => {
    if (!status || !sort) {
        if (!status) {
            redirect(`/u/${username}/list?status=completed&sort=watch_score`);
        }

        redirect(`/u/${username}/list?status=${status}&sort=watch_score`);
    }

    return (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_25%] lg:gap-16">
            <div className="flex flex-col gap-8">
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
            </div>
            <div className="hidden lg:block bg-secondary/30 border border-secondary/60 rounded-md h-fit opacity-60 hover:opacity-100 transition-opacity sticky top-20">
                <Filters className="px-4" type="watchlist" />
            </div>
        </div>
    );
};

export default Component;
