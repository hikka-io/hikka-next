import { useCallback } from 'react';

import { useQuery } from '@tanstack/react-query';

import { API_LIMITS, searchUsersOptions, type UserResponse } from '@hikka/api';

import { useRouter } from '@/utils/navigation';

import SearchPlaceholders from '../components/search-placeholders';
import { SearchGroup, SearchItem, SearchList } from '../components/search-ui';
import UserCard from '../components/user-card';

type Props = {
    onDismiss: (user: UserResponse) => void;
    type?: 'link' | 'button';
    value?: string;
};

const UserSearchList = ({ onDismiss, type, value }: Props) => {
    const router = useRouter();

    const handleSelect = useCallback(
        (user: UserResponse) => {
            onDismiss(user);

            if (type !== 'button') {
                router.push(`/u/${user.username}`);
            }
        },
        [onDismiss, router, type],
    );
    const { data, isFetching, isRefetching } = useQuery({
        ...searchUsersOptions({ body: { query: value || '' } }),
        enabled:
            value !== undefined &&
            value.length >= API_LIMITS.userSearchQuery.min,
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
                            <UserCard user={user} type={type} />
                        </SearchItem>
                    ))}
                </SearchGroup>
            )}
        </SearchList>
    );
};

export default UserSearchList;
