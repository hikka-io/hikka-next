'use client';

import { MangaResponse } from '@hikka/client';
import { useSearchMangas } from '@hikka/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback } from 'react';

import LoadMoreButton from '@/components/load-more-button';
import {
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';

import MangaCard from '../cards/manga-card';
import SearchPlaceholders from '../search-placeholders';

interface Props {
    onDismiss: (manga: MangaResponse) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
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
        <CommandList className="max-h-none">
            <SearchPlaceholders
                data={list}
                isFetching={isFetching}
                isRefetching={isRefetching}
            />
            {list && list.length > 0 && (
                <CommandGroup>
                    {list.map((manga) => (
                        <CommandItem
                            key={manga.slug}
                            value={manga.slug}
                            onSelect={() => handleSelect(manga)}
                        >
                            <MangaCard
                                onClick={() => onDismiss(manga)}
                                manga={manga}
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

export default MangaSearchList;
