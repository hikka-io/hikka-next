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
