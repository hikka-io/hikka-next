'use client';

import React, { FC } from 'react';

import { useParams } from 'next/navigation';

import LoadMoreButton from '@/components/load-more-button';
import useCharacters from '@/services/hooks/anime/useCharacters';

import MainCharacters from './components/main-characters';
import OtherCharacters from './components/other-characters';

interface Props {
    extended?: boolean;
}

const Characters: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useCharacters({ slug: String(params.slug) });

    return (
        <div className="flex flex-col gap-12">
            <MainCharacters extended={extended} />
            {extended && <OtherCharacters extended={extended} />}
            {extended && hasNextPage && (
                <LoadMoreButton
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    ref={ref}
                />
            )}
        </div>
    );
};

export default Characters;
