import { useCallback } from 'react';

import { type NovelResponse, searchNovelInfiniteOptions } from '@hikka/api';

import LoadMoreButton from '@/components/load-more-button';
import { useInfiniteList } from '@/utils/api/use-infinite-list';
import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';
import { useRouter } from '@/utils/navigation';

import NovelCard from '../cards/novel-card';
import SearchPlaceholders from '../search-placeholders';
import { SearchGroup, SearchItem, SearchList } from '../search-ui';

type Props = {
    onDismiss: (novel: NovelResponse) => void;
    type?: 'link' | 'button';
    value?: string;
};

const NovelSearchList = ({ onDismiss, type, value }: Props) => {
    const router = useRouter();

    const handleSelect = useCallback(
        (novel: NovelResponse) => {
            onDismiss(novel);

            if (type !== 'button') {
                router.push(`/novel/${novel.slug}`);
            }
        },
        [onDismiss, router, type],
    );
    const {
        list,
        isFetching,
        isRefetching,
        ref,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
    } = useInfiniteList(
        searchNovelInfiniteOptions({
            body: { query: value },
            query: { size: 30 },
        }),
        {
            enabled: value !== undefined && value.length >= MIN_SEARCH_LENGTH,
        },
    );

    return (
        <SearchList>
            <SearchPlaceholders
                data={list}
                isFetching={isFetching}
                isRefetching={isRefetching}
            />
            {list && list.length > 0 && (
                <SearchGroup>
                    {list.map((novel) => (
                        <SearchItem
                            key={novel.slug}
                            value={novel.slug}
                            onSelect={() => handleSelect(novel)}
                        >
                            <NovelCard
                                onClick={() => onDismiss(novel)}
                                novel={novel}
                                type={type}
                            />
                        </SearchItem>
                    ))}
                </SearchGroup>
            )}
            <div className="flex items-center justify-center">
                {hasNextPage && (
                    <LoadMoreButton
                        ref={ref}
                        isFetchingNextPage={isFetchingNextPage}
                        fetchNextPage={fetchNextPage}
                    />
                )}
            </div>
        </SearchList>
    );
};

export default NovelSearchList;
