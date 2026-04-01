'use client';

import { useRouter } from '@tanstack/react-router';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

const CollectionSort = () => {
    const router = useRouter();
    const search = useFilterSearch<{ sort?: string | string[] }>();

    const sortRaw = search.sort;
    const sort = sortRaw
        ? Array.isArray(sortRaw)
            ? sortRaw
            : [sortRaw]
        : ['system_ranking'];

    const handleChangeSort = (value: string) => {
        router.navigate({
            to: '.',
            search: (prev: Record<string, unknown>) => ({
                ...prev,
                sort: value,
                page: undefined,
            }),
            replace: true,
        } as any);
    };

    return (
        <ToggleGroup
            type="single"
            size="badge"
            value={sort[0]}
            onValueChange={handleChangeSort}
        >
            <ToggleGroupItem value="system_ranking">Популярні</ToggleGroupItem>
            <ToggleGroupItem value="created">Нові</ToggleGroupItem>
        </ToggleGroup>
    );
};

export default CollectionSort;
