'use client';

import { CharacterResponse } from '@hikka/client';
import { ReactNode } from 'react';

import {
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import useCharacterSearchList from '../../hooks/useCharacterSearchList';
import CharacterCard from '../cards/character-card';
import SearchPlaceholders from '../search-placeholders';

interface Props {
    onDismiss: (character: CharacterResponse) => void;
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
