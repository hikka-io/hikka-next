import type { FC } from 'react';

import LoadMoreButton from '@/components/load-more-button';
import { CONTENT_CONFIG } from '@/utils/constants/common';
import { useParams } from '@/utils/navigation';

import MainCharacters from './components/main-characters';
import OtherCharacters from './components/other-characters';

type Props = {
    extended?: boolean;
    content_type: 'anime' | 'manga' | 'novel';
};

const Characters: FC<Props> = ({ extended, content_type }) => {
    const params = useParams();
    const { fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        CONTENT_CONFIG[content_type].useCharacters(String(params.slug));

    return (
        <div className="flex flex-col gap-12" id="content-characters">
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
