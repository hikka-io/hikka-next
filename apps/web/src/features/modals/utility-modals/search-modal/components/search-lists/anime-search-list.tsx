'use client';

import { AnimeResponse } from '@hikka/client';
import { useSearchAnimes } from '@hikka/react';
import { ReactNode } from 'react';

import LoadMoreButton from '@/components/load-more-button';
import {
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';

import AnimeCard from '../cards/anime-card';
import SearchPlaceholders from '../search-placeholders';

interface Props {
    onDismiss: (anime: AnimeResponse) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
    value?: string;
}

const AnimeSearchList = ({ onDismiss, type, value }: Props) => {
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
        <CommandList className="max-h-none">
            <SearchPlaceholders
                data={list}
                isFetching={isFetching}
                isRefetching={isRefetching}
            />
            {list && list.length > 0 && (
                <CommandGroup>
                    {list.map((anime) => (
                        <CommandItem key={anime.slug} value={anime.slug}>
                            <AnimeCard
                                onClick={() => onDismiss(anime)}
                                anime={anime}
                                type={type}
                            />
                        </CommandItem>
                    ))}
                </CommandGroup>
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
        </CommandList>
    );
};

export default AnimeSearchList;
