'use client';

import { useAnimeCharacters } from '@hikka/react';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import LoadMoreButton from '@/components/load-more-button';

import { cn } from '@/utils/utils';

import MainCharacters from './components/characters/main-characters';
import OtherCharacters from './components/characters/other-characters';

interface Props {
    extended?: boolean;
    className?: string;
}

const Characters: FC<Props> = ({ extended, className }) => {
    const params = useParams();
    const { fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useAnimeCharacters({
            slug: String(params.slug),
        });

    return (
        <div className={cn('flex flex-col gap-12', className)}>
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
