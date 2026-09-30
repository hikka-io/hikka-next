import type { FC } from 'react';

import type { MainContentTypeEnum } from '@hikka/api';

import LoadMoreButton from '@/components/load-more-button';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { useParams } from '@/utils/navigation';

import { contentCharactersOptions } from '../queries';
import MainCharacters from './components/main-characters';
import OtherCharacters from './components/other-characters';

type Props = {
    extended?: boolean;
    content_type: MainContentTypeEnum;
};

const ContentCharacters: FC<Props> = ({ extended, content_type }) => {
    const params = useParams();
    const { fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useInfiniteList(
            contentCharactersOptions(content_type, String(params.slug)),
        );

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

export default ContentCharacters;
