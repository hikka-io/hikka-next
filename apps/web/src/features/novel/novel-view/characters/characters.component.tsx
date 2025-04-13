'use client';

import { useParams } from 'next/navigation';
import { FC } from 'react';

import LoadMoreButton from '../../../../components/load-more-button';
import useNovelCharacters from '../../../../services/hooks/novel/use-novel-characters';
import MainCharacters from './main-characters';
import OtherCharacters from './other-characters';

interface Props {
    extended?: boolean;
}

const Characters: FC<Props> = ({ extended }) => {
    const params = useParams();
    const { fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useNovelCharacters({ slug: String(params.slug) });

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
