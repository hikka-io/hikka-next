import { type FC, useEffect, useRef, useState } from 'react';

import { useNavigate } from '@tanstack/react-router';

import { Input } from '@/components/ui/input';
import useDebounce from '@/services/hooks/use-debounce';

import { useFilterSearch } from './hooks/use-filter-search';

type Props = {
    placeholder: string;
};

const SearchInput: FC<Props> = ({ placeholder }) => {
    const navigate = useNavigate();
    const { search: query } = useFilterSearch<{ search?: string }>();

    const [search, setSearch] = useState(query);
    const [debouncedSearch] = useDebounce({ value: search, delay: 300 });

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
        <Input
            className="w-full"
            value={search || ''}
            onChange={(event) => setSearch(event.target.value)}
            type="text"
            placeholder={placeholder}
        />
    );
};

export default SearchInput;
