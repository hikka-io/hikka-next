'use client';

import { useRouter } from '@tanstack/react-router';
import { useFilterSearch } from '@/features/filters/hooks/use-filter-search';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
        <Tabs
            value={sort[0]}
            onValueChange={handleChangeSort}
        >
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="system_ranking">Популярні</TabsTrigger>
                <TabsTrigger value="created">Нові</TabsTrigger>
            </TabsList>
        </Tabs>
    );
};

export default CollectionSort;
