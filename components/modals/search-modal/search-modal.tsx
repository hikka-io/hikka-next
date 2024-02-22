'use client';

import clsx from 'clsx';
import * as React from 'react';
import { useEffect, useState } from 'react';
import MaterialSymbolsSearch from '~icons/material-symbols/search';

import { useQuery } from '@tanstack/react-query';

import SearchCard from '@/components/modals/search-modal/_components/ui/search-card';
import { Button } from '@/components/ui/button';
import getAnimeCatalog from '@/services/api/anime/getAnimeCatalog';
import useDebounce from '@/services/hooks/useDebounce';

import {
    CommandDialog,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '../../ui/command';


const Component = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string | undefined>(
        undefined,
    );
    const value = useDebounce({ value: searchValue, delay: 500 });
    const { data } = useQuery<
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
        setSearchValue('');
        setOpen(false);
    };

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === '/') {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <>
            <Button
                size="sm"
                variant="outline"
                onClick={() => setOpen(true)}
                className={clsx(
                    'bg-secondary/30 hover:!bg-secondary/60',
                    'lg:w-48 lg:justify-between lg:font-normal lg:!text-foreground/60',
                    'transition-all duration-200',
                    'lg:hover:w-60',
                    'items-center',
                )}
            >
                <div className="flex items-center gap-2">
                    <MaterialSymbolsSearch />{' '}
                    <span className="hidden lg:block">Пошук...</span>
                </div>
                <div className="hidden items-center lg:flex">
                    <kbd className="flex pointer-events-none select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                        <span className="text-xs">/</span>
                    </kbd>
                </div>
            </Button>
            <CommandDialog
                className="max-w-3xl"
                open={open}
                onOpenChange={setOpen}
                shouldFilter={false}
            >
                <CommandInput
                    value={searchValue}
                    onValueChange={(value) => setSearchValue(value)}
                    placeholder="Пошук..."
                    containerClassName={data ? '' : 'border-b-0'}
                />
                {data && (
                    <CommandList className="max-h-[calc(100vh-6rem)]">
                        <CommandGroup>
                            {data.list.length > 0 &&
                                data.list.map((anime) => (
                                    <CommandItem key={anime.slug}>
                                        <SearchCard
                                            onClick={onDismiss}
                                            anime={anime}
                                        />
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                )}
            </CommandDialog>
        </>
    );
};

export default Component;