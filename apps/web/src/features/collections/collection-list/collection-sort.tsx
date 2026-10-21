import { ArrowDownWideNarrow } from 'lucide-react';

import {
    COLLECTION_SORT_OPTIONS,
    type CollectionsSearch,
    DEFAULT_COLLECTION_SORT,
} from '@hikka/core';

import { Label } from '@/components/ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useChangeParam } from '@/features/filters';
import { useRouteSearch } from '@/utils/navigation';

const CollectionSort = () => {
    const { sort = DEFAULT_COLLECTION_SORT } =
        useRouteSearch<Pick<CollectionsSearch, 'sort'>>();
    const handleChangeParam = useChangeParam();

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
                <ArrowDownWideNarrow className="size-4 shrink-0" />
                <Label>Сортування</Label>
            </div>
            <ToggleGroup
                className="w-full"
                value={[sort]}
                onValueChange={([value]: string[]) => {
                    if (value) handleChangeParam('sort', value);
                }}
            >
                {COLLECTION_SORT_OPTIONS.map((option) => (
                    <ToggleGroupItem
                        key={option.value}
                        value={option.value}
                        className="flex-1"
                    >
                        {option.label}
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        </div>
    );
};

export default CollectionSort;
