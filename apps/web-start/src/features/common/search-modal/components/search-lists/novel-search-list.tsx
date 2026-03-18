'use client';

import { NovelResponse } from '@hikka/client';
import { useSearchNovels } from '@hikka/react';
import { useRouter } from '@/utils/navigation';
import { useCallback } from 'react';

import LoadMoreButton from '@/components/load-more-button';

import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';

import NovelCard from '../cards/novel-card';
import SearchPlaceholders from '../search-placeholders';
import { SearchGroup, SearchItem, SearchList } from '../search-ui';

interface Props {
    onDismiss: (novel: NovelResponse) => void;
    type?: 'link' | 'button';
    value?: string;
}

const NovelSearchList = ({ onDismiss, type, value }: Props) => {
    const router = useRouter();

    const handleSelect = useCallback(
        (novel: NovelResponse) => {
            onDismiss(novel);

            if (type !== 'button') {
                router.push('/novel/' + novel.slug);
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
    } = useSearchNovels({
        args: { query: value },
        paginationArgs: { size: 30 },
        queryKey: ['novel-search-list', value],
        options: {
            enabled: value !== undefined && value.length >= MIN_SEARCH_LENGTH,
        },
    });

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
