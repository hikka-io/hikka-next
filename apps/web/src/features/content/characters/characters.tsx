import type { FC } from 'react';

import type { MainContentTypeEnum } from '@hikka/api';

import MaterialSymbolsFace3 from '@/components/icons/material-symbols/MaterialSymbolsFace3';
import LoadMoreButton from '@/components/load-more-button';
import EmptyState from '@/components/ui/empty-state';
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
    const { list, fetchNextPage, hasNextPage, isFetchingNextPage, ref } =
        useInfiniteList(
            contentCharactersOptions(content_type, String(params.slug)),
        );

    if (extended && list?.length === 0) {
        return (
            <EmptyState
                bordered
                icon={<MaterialSymbolsFace3 />}
                title="Персонажів не знайдено"
                description="Інформацію ще не додано"
            />
        );
    }

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
