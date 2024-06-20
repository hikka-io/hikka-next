'use client';

import { ReactNode } from 'react';

import {
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';

import UserCard from '@/features/modals/search-modal/cards/user-card';
import SearchPlaceholders from '@/features/modals/search-modal/search-placeholders';

import useUserSearchList from './hooks/useUserSearchList';

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
