'use client';

import { MangaResponse } from '@hikka/client';
import { useSearchMangas } from '@hikka/react';
import { useCallback } from 'react';

import LoadMoreButton from '@/components/load-more-button';

import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';
import { useRouter } from '@/utils/navigation';

import MangaCard from '../cards/manga-card';
import SearchPlaceholders from '../search-placeholders';
import { SearchGroup, SearchItem, SearchList } from '../search-ui';

interface Props {
    onDismiss: (manga: MangaResponse) => void;
    type?: 'link' | 'button';
    value?: string;
}

const MangaSearchList = ({ onDismiss, type, value }: Props) => {
    const router = useRouter();

    const handleSelect = useCallback(
        (manga: MangaResponse) => {
            onDismiss(manga);

            if (type !== 'button') {
                router.push('/manga/' + manga.slug);
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
    } = useSearchMangas({
        args: { query: value },
        paginationArgs: { size: 30 },
        queryKey: ['manga-search-list', value],
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
                    {list.map((manga) => (
                        <SearchItem
                            key={manga.slug}
                            value={manga.slug}
                            onSelect={() => handleSelect(manga)}
                        >
                            <MangaCard
                                onClick={() => onDismiss(manga)}
                                manga={manga}
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

export default MangaSearchList;
