'use client';

import { CharacterResponse } from '@hikka/client';
import { useSearchCharacters } from '@hikka/react';
import { ReactNode } from 'react';

import LoadMoreButton from '@/components/load-more-button';
import {
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';

import CharacterCard from '../cards/character-card';
import SearchPlaceholders from '../search-placeholders';

interface Props {
    onDismiss: (character: CharacterResponse) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
    value?: string;
}

const CharacterSearchList = ({ onDismiss, type, value }: Props) => {
    const {
        list,
        isFetching,
        isRefetching,
        ref,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
    } = useSearchCharacters({
        args: { query: value },
        paginationArgs: { size: 30 },
        queryKey: ['character-search-list', value],
        options: {
            enabled: value !== undefined && value.length >= MIN_SEARCH_LENGTH,
        },
    });
    /* const { data, isFetching, isRefetching } = useCharacterSearchList({
        value,
    }); */

    return (
        <CommandList className="max-h-screen">
            <SearchPlaceholders
                data={list}
                isFetching={isFetching}
                isRefetching={isRefetching}
            />
            {list && list.length > 0 && (
                <CommandGroup>
                    {list.map((character) => (
                        <CommandItem
                            key={character.slug}
                            value={character.slug}
                        >
                            <CharacterCard
                                onClick={() => onDismiss(character)}
                                character={character}
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

export default CharacterSearchList;
