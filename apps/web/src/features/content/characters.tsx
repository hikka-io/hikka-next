'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import LoadMoreButton from '@/components/load-more-button';

import { CONTENT_CONFIG } from '@/utils/constants/common';

import MainCharacters from './components/characters/main-characters';
import OtherCharacters from './components/characters/other-characters';

interface Props {
    extended?: boolean;
    content_type:
        | ContentTypeEnum.ANIME
        | ContentTypeEnum.MANGA
        | ContentTypeEnum.NOVEL;
}

const Characters: FC<Props> = ({ extended, content_type }) => {
    const params = useParams();
    const { fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        CONTENT_CONFIG[content_type].useCharacters(String(params.slug));

    return (
        <div className="flex flex-col gap-12">
            <MainCharacters extended={extended} content_type={content_type} />
            {extended && (
                <OtherCharacters
                    extended={extended}
                    content_type={content_type}
                />
            )}
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
