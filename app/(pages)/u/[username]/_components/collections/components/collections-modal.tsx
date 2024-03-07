'use client';

import * as React from 'react';

import { useParams } from 'next/navigation';

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
            <hr className="h-[1px] w-auto -mx-6 bg-border mt-4" />
            <div className="flex-1 overflow-y-scroll w-auto h-full -mx-6">
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
                        <Button
                            variant="outline"
                            ref={ref}
                            disabled={isFetchingNextPage}
                            onClick={() => hasNextPage && fetchNextPage()}
                            className="w-full"
                        >
                            {isFetchingNextPage && (
                                <span className="loading loading-spinner"></span>
                            )}
                            Завантажити ще
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Component;
