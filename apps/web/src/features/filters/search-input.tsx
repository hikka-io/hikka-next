import { type FC, useEffect, useRef, useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import type { TextSearch } from '@hikka/core';

import ClearInputButton from '@/components/ui/clear-input-button';
import { Input } from '@/components/ui/input';
import { DEBOUNCE_MS, useDebounce } from '@/services/hooks/use-debounce';
import { useRouteSearch } from '@/utils/navigation';

type Props = {
    placeholder: string;
};

const SearchInput: FC<Props> = ({ placeholder }) => {
    const navigate = useNavigate();
    const { search: query } = useRouteSearch<TextSearch>();

    const inputRef = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState(query);
    const [debouncedSearch] = useDebounce({
        value: search,
        delay: DEBOUNCE_MS.input,
    });

    const queryRef = useRef(query);
    queryRef.current = query;
    const debouncedRef = useRef(debouncedSearch);
    debouncedRef.current = debouncedSearch;

    useEffect(() => {
        const desired = debouncedSearch || undefined;
        if (desired === (queryRef.current || undefined)) return;

        navigate({
            to: '.',
            search: (prev: Record<string, unknown>) => {
                const next = { ...prev };
                if (desired) {
                    next.search = desired;
                } else {
                    delete next.search;
                }
                delete next.page;
                return next;
            },
            replace: true,
        });
    }, [debouncedSearch, navigate]);

    useEffect(() => {
        if ((query || undefined) !== (debouncedRef.current || undefined)) {
            setSearch(query);
        }
    }, [query]);

    return (
        <div className="relative w-full">
            <Input
                ref={inputRef}
                className="w-full pr-11"
                value={search || ''}
                onChange={(event) => setSearch(event.target.value)}
                type="text"
                placeholder={placeholder}
            />
            <ClearInputButton
                disabled={!search}
                className="absolute top-1/2 right-1 -translate-y-1/2"
                onClick={() => {
                    setSearch('');
                    inputRef.current?.focus();
                }}
            />
        </div>
    );
};

export default SearchInput;
