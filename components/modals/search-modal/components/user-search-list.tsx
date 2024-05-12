'use client';

import * as React from 'react';
import { ReactNode } from 'react';

import UserCard from '@/components/modals/search-modal/components/ui/user-card';
import SearchPlaceholders from '@/components/modals/search-modal/components/ui/search-placeholders';

import {
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import useUserSearchList from './useUserSearchList';

interface Props {
    onDismiss: (character: API.User) => void;
    type?: 'link' | 'button';
    children?: ReactNode;
    value?: string;
}

const UserSearchList = ({ onDismiss, type, value }: Props) => {
    const { data, isFetching, isRefetching } = useUserSearchList({ value });

    return (
        <CommandList className="max-h-screen">
            <SearchPlaceholders
                isFetching={isFetching}
                isRefetching={isRefetching}
            />
            {data && data.length > 0 && (
                <CommandGroup>
                    {data.map((user) => (
                        <CommandItem key={user.reference} value={user.reference}>
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
