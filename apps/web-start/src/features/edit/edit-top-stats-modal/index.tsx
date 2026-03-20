'use client';

import { useTopEditorsList } from '@hikka/react';

import LoadMoreButton from '@/components/load-more-button';

import EditTopItem from './components/edit-top-item';

const Component = () => {
    const { list, fetchNextPage, isFetchingNextPage, hasNextPage, ref } =
        useTopEditorsList();

    if (!list) {
        return null;
    }

    return (
        <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
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
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={ref}
                />
            )}
        </div>
    );
};

export default Component;
