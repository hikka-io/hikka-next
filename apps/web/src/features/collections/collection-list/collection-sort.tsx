import { useRouter } from '@tanstack/react-router';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useRouteSearch } from '@/utils/navigation';
import type { CollectionsSearch } from '@/utils/search-schemas';

const CollectionSort = () => {
    const router = useRouter();
    const search = useRouteSearch<Pick<CollectionsSearch, 'sort'>>();

    const sortRaw = search.sort;
    const sort = sortRaw
        ? Array.isArray(sortRaw)
            ? sortRaw
            : [sortRaw]
        : ['system_ranking'];

    const handleChangeSort = ([value]: string[]) => {
        if (!value) return;

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
        <ToggleGroup value={[sort[0]]} onValueChange={handleChangeSort}>
            <ToggleGroupItem value="system_ranking">Популярні</ToggleGroupItem>
            <ToggleGroupItem value="created">Нові</ToggleGroupItem>
        </ToggleGroup>
    );
};

export default CollectionSort;
