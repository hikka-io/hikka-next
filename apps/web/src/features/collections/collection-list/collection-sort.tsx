import { useRouter } from '@tanstack/react-router';

import {
    COLLECTION_SORT_OPTIONS,
    type CollectionsSearch,
    DEFAULT_COLLECTION_SORT,
} from '@hikka/core';

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useRouteSearch } from '@/utils/navigation';

const CollectionSort = () => {
    const router = useRouter();
    const search = useRouteSearch<Pick<CollectionsSearch, 'sort'>>();

    const sortRaw = search.sort;
    const sort = sortRaw
        ? Array.isArray(sortRaw)
            ? sortRaw
            : [sortRaw]
        : [DEFAULT_COLLECTION_SORT];

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
            {COLLECTION_SORT_OPTIONS.map((option) => (
                <ToggleGroupItem key={option.value} value={option.value}>
                    {option.label}
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
};

export default CollectionSort;
