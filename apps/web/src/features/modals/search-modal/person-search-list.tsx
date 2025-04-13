'use client';

import { ReactNode } from 'react';

import {
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import PersonCard from './cards/person-card';
import usePersonSearchList from './hooks/usePersonSearchList';
import SearchPlaceholders from './search-placeholders';

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
            <SearchPlaceholders
                data={data}
                isFetching={isFetching}
                isRefetching={isRefetching}
            />
            {data && data.list.length > 0 && (
                <CommandGroup>
                    {data.list.map((person) => (
                        <CommandItem key={person.slug} value={person.slug}>
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
