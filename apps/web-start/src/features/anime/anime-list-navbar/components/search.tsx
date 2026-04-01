'use client';

import { useRouter } from '@tanstack/react-router';
import { useState } from 'react';

import { Input } from '@/components/ui/input';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

const Search = () => {
    const router = useRouter();
    const { search: query } = useFilterSearch<{ search?: string }>();

    const [search, setSearch] = useState(query);

    const handleChangeSearch = (value: string) => {
        setSearch(value);

        router.navigate({
            search: (prev: Record<string, unknown>) => {
                const next = { ...prev };
                if (value) {
                    next.search = value;
                } else {
                    delete next.search;
                }
                delete next.page;
                return next;
            },
            replace: true,
        } as any);
    };

    return (
        <div className="flex flex-1 flex-col gap-4">
            <Input
                value={search || ''}
                onChange={(event) => handleChangeSearch(event.target.value)}
                type="text"
                placeholder="Введіть назву аніме..."
            />
        </div>
    );
};

export default Search;
