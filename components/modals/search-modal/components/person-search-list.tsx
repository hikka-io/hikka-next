'use client';

import * as React from 'react';
import { ReactNode } from 'react';



import PersonCard from '@/components/modals/search-modal/components/ui/person-card';
import SearchPlaceholders from '@/components/modals/search-modal/components/ui/search-placeholders';
import useCharacterSearchList from '@/components/modals/search-modal/components/useCharacterSearchList';
import { CommandGroup, CommandItem, CommandList } from '@/components/ui/command';



import CharacterCard from './ui/character-card';
import usePersonSearchList from './usePersonSearchList';


interface Props {
    onDismiss: (character: API.Person) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
    value?: string;
}

const PersonSearchList = ({ onDismiss, type, value }: Props) => {
    const { data, isFetching, isRefetching } = usePersonSearchList({ value });

    return (
        <CommandList className="max-h-screen">
            <SearchPlaceholders data={data} isFetching={isFetching} isRefetching={isRefetching} />
            {data && data.list.length > 0 && (
                <CommandGroup>
                    {data.list.map((person) => (
                        <CommandItem
                            key={person.slug}
                            value={person.slug}
                        >
                            <PersonCard
                                onClick={() => onDismiss(person)}
                                person={person}
                                type={type}
                            />
                        </CommandItem>
                    ))}
                </CommandGroup>
            )}
        </CommandList>
    );
};

export default PersonSearchList;
