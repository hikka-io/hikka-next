'use client';

import { ReactNode } from 'react';

import {
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import SearchPlaceholders from '@/features/modals/search-modal/search-placeholders';
import useCharacterSearchList from '@/features/modals/search-modal/useCharacterSearchList';

import CharacterCard from './character-card';

interface Props {
    onDismiss: (character: API.Character) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
    value?: string;
}

const CharacterSearchList = ({ onDismiss, type, value }: Props) => {
    const { data, isFetching, isRefetching } = useCharacterSearchList({
        value,
    });

    return (
        <CommandList className="max-h-screen">
            <SearchPlaceholders
                data={data}
                isFetching={isFetching}
                isRefetching={isRefetching}
            />
            {data && data.list.length > 0 && (
                <CommandGroup>
                    {data.list.map((character) => (
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
        </CommandList>
    );
};

export default CharacterSearchList;
