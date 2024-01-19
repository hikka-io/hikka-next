'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import SearchCard from '@/app/_components/search-card';
import getAnimeCatalog from '@/utils/api/anime/getAnimeCatalog';
import useDebounce from '@/utils/hooks/useDebounce';
import { useModalContext } from '@/utils/providers/modal-provider';

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '../_components/ui/command';

const Component = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [searchValue, setSearchValue] = useState<string | undefined>(
        undefined,
    );
    const value = useDebounce({ value: searchValue, delay: 500 });
    const { search, closeModals, switchModal } = useModalContext();
    const { data, isLoading, error } = useQuery<
        { list: Hikka.Anime[]; pagination: Hikka.Pagination },
        Error
    >({
        queryKey: ['searchList', value],
        queryFn: () =>
            getAnimeCatalog({
                query: value,
            }),
        enabled: value !== undefined && value.length >= 3,
    });

    const onDismiss = () => {
        closeModals();
        setSearchValue('');
    };

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                switchModal('search', true);
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <CommandDialog
            className="max-w-3xl"
            open={Boolean(search)}
            onOpenChange={(open) => switchModal('search', open)}
            shouldFilter={false}
        >
            <CommandInput
                value={searchValue}
                onValueChange={(value) => setSearchValue(value)}
                placeholder="Пошук..."
            />
            <CommandList className="max-h-[calc(100vh-6rem)]">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {data &&
                        data.list.length > 0 &&
                        data.list.map((anime) => (
                            <CommandItem key={anime.slug}>
                                <SearchCard onClick={onDismiss} anime={anime} />
                            </CommandItem>
                        ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
};

export default Component;