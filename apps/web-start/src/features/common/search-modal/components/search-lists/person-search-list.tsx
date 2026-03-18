'use client';

import { PersonResponse } from '@hikka/client';
import { useSearchPeople } from '@hikka/react';
import { useRouter } from '@/utils/navigation';
import { useCallback } from 'react';

import LoadMoreButton from '@/components/load-more-button';

import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';

import PersonCard from '../cards/person-card';
import SearchPlaceholders from '../search-placeholders';
import { SearchGroup, SearchItem, SearchList } from '../search-ui';

interface Props {
    onDismiss: (person: PersonResponse) => void;
    type?: 'link' | 'button';
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
        <SearchList>
            <SearchPlaceholders
                data={list}
                isFetching={isFetching}
                isRefetching={isRefetching}
            />
            {list && list.length > 0 && (
                <SearchGroup>
                    {list.map((person) => (
                        <SearchItem
                            key={person.slug}
                            value={person.slug}
                            onSelect={() => handleSelect(person)}
                        >
                            <PersonCard
                                onClick={() => onDismiss(person)}
                                person={person}
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

export default PersonSearchList;
