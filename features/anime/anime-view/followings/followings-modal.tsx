'use client';

import { useParams } from 'next/navigation';

import LoadMoreButton from '@/components/load-more-button';

import useFollowingWatchList from '@/services/hooks/watch/use-following-watch-list';

import FollowingItem from './following-item';

const FollowingsModal = () => {
    const params = useParams();

    const { list, hasNextPage, isFetchingNextPage, fetchNextPage, ref } =
        useFollowingWatchList({ slug: String(params.slug) });

    return (
        <>
            <hr className="-mx-6 mt-4 h-px w-auto bg-border" />
            <div className="-mx-6 h-full w-auto flex-1 overflow-y-scroll">
                {list &&
                    list.map((item) => (
                        <FollowingItem
                            className="px-6 py-4"
                            data={item}
                            key={item.reference}
                        />
                    ))}
                {hasNextPage && (
                    <div className="px-4">
                        <LoadMoreButton
                            isFetchingNextPage={isFetchingNextPage}
                            fetchNextPage={fetchNextPage}
                            ref={ref}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default FollowingsModal;
