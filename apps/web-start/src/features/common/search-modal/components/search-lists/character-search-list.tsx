'use client';

import { CharacterResponse } from '@hikka/client';
import { useSearchCharacters } from '@hikka/react';
import { useCallback } from 'react';

import LoadMoreButton from '@/components/load-more-button';

import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';
import { useRouter } from '@/utils/navigation';

import CharacterCard from '../cards/character-card';
import SearchPlaceholders from '../search-placeholders';
import { SearchGroup, SearchItem, SearchList } from '../search-ui';

interface Props {
    onDismiss: (character: CharacterResponse) => void;
    type?: 'link' | 'button';
    value?: string;
}

const CharacterSearchList = ({ onDismiss, type, value }: Props) => {
    const router = useRouter();

    const handleSelect = useCallback(
        (character: CharacterResponse) => {
            onDismiss(character);

            if (type !== 'button') {
                router.push('/characters/' + character.slug);
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
    } = useSearchCharacters({
        args: { query: value },
        paginationArgs: { size: 30 },
        queryKey: ['character-search-list', value],
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
                    {list.map((character) => (
                        <SearchItem
                            key={character.slug}
                            value={character.slug}
                            onSelect={() => handleSelect(character)}
                        >
                            <CharacterCard
                                onClick={() => onDismiss(character)}
                                character={character}
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

export default CharacterSearchList;
