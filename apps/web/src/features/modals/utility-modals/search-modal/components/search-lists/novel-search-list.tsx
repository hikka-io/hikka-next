'use client';

import { NovelResponse } from '@hikka/client';
import { useSearchNovels } from '@hikka/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback } from 'react';

import LoadMoreButton from '@/components/load-more-button';
import {
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';

import NovelCard from '../cards/novel-card';
import SearchPlaceholders from '../search-placeholders';

interface Props {
    onDismiss: (novel: NovelResponse) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
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
        <CommandList className="max-h-none">
            <SearchPlaceholders
                data={list}
                isFetching={isFetching}
                isRefetching={isRefetching}
            />
            {list && list.length > 0 && (
                <CommandGroup>
                    {list.map((novel) => (
                        <CommandItem
                            key={novel.slug}
                            value={novel.slug}
                            onSelect={() => handleSelect(novel)}
                        >
                            <NovelCard
                                onClick={() => onDismiss(novel)}
                                novel={novel}
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

export default NovelSearchList;
