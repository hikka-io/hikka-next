'use client';

import { PersonResponse } from '@hikka/client';
import { useSearchPeople } from '@hikka/react';
import { useRouter } from 'next/navigation';
import { ReactNode, useCallback } from 'react';

import LoadMoreButton from '@/components/load-more-button';
import {
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';

import PersonCard from '../cards/person-card';
import SearchPlaceholders from '../search-placeholders';

interface Props {
    onDismiss: (person: PersonResponse) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
    value?: string;
}

const PersonSearchList = ({ onDismiss, type, value }: Props) => {
    const router = useRouter();

    const handleSelect = useCallback(
        (person: PersonResponse) => {
            onDismiss(person);

            if (type !== 'button') {
                router.push('/people/' + person.slug);
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
    } = useSearchPeople({
        args: { query: value },
        paginationArgs: { size: 30 },
        queryKey: ['person-search-list', value],
        options: {
            enabled: value !== undefined && value.length >= MIN_SEARCH_LENGTH,
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
                        <CommandItem
                            key={person.slug}
                            value={person.slug}
                            onSelect={() => handleSelect(person)}
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
