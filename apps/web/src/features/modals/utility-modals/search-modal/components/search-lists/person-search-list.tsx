'use client';

import { PersonResponse } from '@hikka/client';
import { useSearchPeople } from '@hikka/react';
import { ReactNode } from 'react';

import LoadMoreButton from '@/components/load-more-button';
import {
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import PersonCard from '../cards/person-card';
import SearchPlaceholders from '../search-placeholders';

interface Props {
    onDismiss: (person: PersonResponse) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
    value?: string;
}

const PersonSearchList = ({ onDismiss, type, value }: Props) => {
    const {
        list,
        isFetching,
        isRefetching,
        ref,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
    } = useSearchPeople({
        args: { query: value },
        paginationArgs: { size: 30 },
        queryKey: ['person-search-list', value],
        options: {
            enabled: value !== undefined && value.length >= 3,
        },
    });

    return (
        <CommandList className="max-h-screen">
            <SearchPlaceholders
                data={list}
                isFetching={isFetching}
                isRefetching={isRefetching}
            />
            {list && list.length > 0 && (
                <CommandGroup>
                    {list.map((person) => (
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

export default PersonSearchList;
