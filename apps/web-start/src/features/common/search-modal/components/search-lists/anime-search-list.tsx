'use client';

import { AnimeResponse } from '@hikka/client';
import { useSearchAnimes } from '@hikka/react';
import { useCallback } from 'react';

import LoadMoreButton from '@/components/load-more-button';

import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';
import { useRouter } from '@/utils/navigation';

import AnimeCard from '../cards/anime-card';
import SearchPlaceholders from '../search-placeholders';
import { SearchGroup, SearchItem, SearchList } from '../search-ui';

interface Props {
    onDismiss: (anime: AnimeResponse) => void;
    type?: 'link' | 'button';
    value?: string;
}

const AnimeSearchList = ({ onDismiss, type, value }: Props) => {
    const router = useRouter();

    const handleSelect = useCallback(
        (anime: AnimeResponse) => {
            onDismiss(anime);

            if (type !== 'button') {
                router.push('/anime/' + anime.slug);
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
    } = useSearchAnimes({
        args: { query: value },
        paginationArgs: { size: 30 },
        queryKey: ['anime-search-list', value],
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
                    {list.map((anime) => (
                        <SearchItem
                            key={anime.slug}
                            value={anime.slug}
                            onSelect={() => handleSelect(anime)}
                        >
                            <AnimeCard
                                onClick={() => onDismiss(anime)}
                                anime={anime}
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

export default AnimeSearchList;
