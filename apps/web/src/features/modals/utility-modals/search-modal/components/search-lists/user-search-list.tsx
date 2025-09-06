'use client';

import { UserResponse } from '@hikka/client';
import { useSearchUsers } from '@hikka/react';
import { ReactNode } from 'react';

import {
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import UserCard from '../cards/user-card';
import SearchPlaceholders from '../search-placeholders';

interface Props {
    onDismiss: (user: UserResponse) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
    value?: string;
}

const UserSearchList = ({ onDismiss, type, value }: Props) => {
    const { data, isFetching, isRefetching } = useSearchUsers({
        args: { query: value || '' },
        queryKey: ['user-search-list', value],
        options: {
            enabled: value !== undefined && value.length >= 3,
        },
    });

    return (
        <CommandList className="max-h-screen">
            <SearchPlaceholders
                data={data}
                isFetching={isFetching}
                isRefetching={isRefetching}
            />
            {data && data.length > 0 && (
                <CommandGroup>
                    {data.map((user) => (
                        <CommandItem
                            key={user.reference}
                            value={user.reference}
                        >
                            <UserCard
                                onClick={() => onDismiss(user)}
                                user={user}
                                type={type}
                            />
                        </CommandItem>
                    ))}
                </CommandGroup>
            )}
        </CommandList>
    );
};

export default UserSearchList;
