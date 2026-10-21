import type { FC } from 'react';

import { LayoutGrid } from 'lucide-react';

import { CollectionContentTypeEnum } from '@hikka/api';
import { CONTENT_TYPES, type CollectionsSearch } from '@hikka/core';

import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import { type ChipTabOption, ChipTabs } from '@/components/ui/chip-tabs';
import { useChangeParam } from '@/features/filters';
import { useRouteSearch } from '@/utils/navigation';

const ALL = 'all';

type Value = CollectionContentTypeEnum | typeof ALL;

const OPTIONS: ChipTabOption<Value>[] = [
    { label: 'Усе', value: ALL, icon: LayoutGrid },
    ...[
        CollectionContentTypeEnum.ANIME,
        CollectionContentTypeEnum.MANGA,
        CollectionContentTypeEnum.NOVEL,
        CollectionContentTypeEnum.CHARACTER,
        CollectionContentTypeEnum.PERSON,
    ].map((type) => ({
        label: CONTENT_TYPES[type].plural ?? CONTENT_TYPES[type].title_ua,
        value: type,
        icon: CONTENT_TYPE_ICONS[type],
    })),
];

const CollectionTypeChips: FC = () => {
    const { content_type } =
        useRouteSearch<Pick<CollectionsSearch, 'content_type'>>();
    const handleChangeParam = useChangeParam();

    return (
        <ChipTabs
            options={OPTIONS}
            value={content_type ?? ALL}
            onValueChange={(next) =>
                handleChangeParam('content_type', next === ALL ? '' : next, [
                    'content_slug',
                ])
            }
        />
    );
};

export default CollectionTypeChips;
