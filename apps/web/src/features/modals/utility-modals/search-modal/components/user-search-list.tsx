'use client';

import { UserResponse } from '@hikka/client';
import { ReactNode } from 'react';

import {
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import useUserSearchList from '../hooks/useUserSearchList';
import UserCard from './cards/user-card';
import SearchPlaceholders from './search-placeholders';

interface Props {
    onDismiss: (user: UserResponse) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
    value?: string;
}

const UserSearchList = ({ onDismiss, type, value }: Props) => {
    const { data, isFetching, isRefetching } = useUserSearchList({ value });
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
