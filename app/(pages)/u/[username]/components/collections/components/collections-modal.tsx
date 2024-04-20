'use client';

import * as React from 'react';

import { useParams } from 'next/navigation';

import LoadMoreButton from '@/components/load-more-button';
import { Button } from '@/components/ui/button';
import useUserCollections from '@/services/hooks/user/useUserCollections';

import CollectionItem from './ui/collection-item';

interface Props {
    className?: string;
}

const Component = ({ className }: Props) => {
    const params = useParams();

    const {
        list: collections,
        hasNextPage,
        isFetchingNextPage,
        ref,
        fetchNextPage,
    } = useUserCollections({
        username: String(params.username),
    });

    return (
        <>
            <hr className="-mx-6 mt-4 h-px w-auto bg-border" />
            <div className="-mx-6 h-full w-auto flex-1 overflow-y-scroll">
                {collections &&
                    collections.map((item) => (
                        <CollectionItem
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

export default Component;
