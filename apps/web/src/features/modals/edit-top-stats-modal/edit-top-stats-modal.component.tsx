'use client';

import { useTopEditorsList } from '@hikka/react';

import LoadMoreButton from '@/components/load-more-button';

import EditTopItem from './edit-top-item';

const Component = () => {
    const { list, fetchNextPage, isFetchingNextPage, hasNextPage, ref } =
        useTopEditorsList();

    if (!list) {
        return null;
    }

    return (
        <div className="h-full w-auto flex-1 overflow-y-scroll">
            {list.map((stat, index) => {
                return (
                    <EditTopItem
                        key={stat.user.reference}
                        user={stat.user}
                        rank={index + 1}
                        accepted={stat.accepted}
                        closed={stat.closed}
                        denied={stat.denied}
                    />
                );
            })}
            {hasNextPage && (
                <div className="px-6">
                    <LoadMoreButton
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                        ref={ref}
                    />
                </div>
            )}
        </div>
    );
};

export default Component;
