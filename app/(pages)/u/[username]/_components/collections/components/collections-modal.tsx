'use client';

import * as React from 'react';

import { useParams } from 'next/navigation';

import { useCollectionsList } from '@/app/(pages)/u/[username]/page.hooks';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/services/providers/auth-provider';

import CollectionItem from './ui/collection-item';

interface Props {
    className?: string;
}

const Component = ({ className }: Props) => {
    const params = useParams();
    const { secret } = useAuthContext();

    const {
        list: collections,
        hasNextPage,
        isFetchingNextPage,
        ref,
        fetchNextPage,
    } = useCollectionsList({
        username: String(params.username),
        secret: secret,
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
