'use client';

import { UserResponse } from '@hikka/client';
import { useSearchUsers } from '@hikka/react';
import { useRouter } from '@/utils/navigation';
import { useCallback } from 'react';

import { MIN_SEARCH_LENGTH } from '@/utils/constants/common';

import UserCard from '../cards/user-card';
import SearchPlaceholders from '../search-placeholders';
import { SearchGroup, SearchItem, SearchList } from '../search-ui';

interface Props {
    onDismiss: (user: UserResponse) => void;
    type?: 'link' | 'button';
    value?: string;
}

const UserSearchList = ({ onDismiss, type, value }: Props) => {
    const router = useRouter();

    const handleSelect = useCallback(
        (user: UserResponse) => {
            onDismiss(user);

            if (type !== 'button') {
                router.push('/u/' + user.username);
            }
        },
        [onDismiss, router, type],
    );
    const { data, isFetching, isRefetching } = useSearchUsers({
        args: { query: value || '' },
        queryKey: ['user-search-list', value],
        options: {
            enabled:
                value !== undefined && value.length >= MIN_SEARCH_LENGTH,
        },
    });

    return (
        <SearchList>
            <SearchPlaceholders
                data={data}
                isFetching={isFetching}
                isRefetching={isRefetching}
            />
            {data && data.length > 0 && (
                <SearchGroup>
                    {data.map((user) => (
                        <SearchItem
                            key={user.reference}
                            value={user.reference}
                            onSelect={() => handleSelect(user)}
                        >
                            <UserCard
                                onClick={() => onDismiss(user)}
                                user={user}
                                type={type}
                            />
                        </SearchItem>
                    ))}
                </SearchGroup>
            )}
        </SearchList>
    );
};

export default UserSearchList;
