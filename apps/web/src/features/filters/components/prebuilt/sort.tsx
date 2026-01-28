'use client';

import { ArrowDownWideNarrow } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { FC } from 'react';

import { CollapsibleFilter } from '@/components/collapsible-filter';
import FormSelect, { FormSelectProps } from '@/components/form/form-select';
import MaterialSymbolsSortRounded from '@/components/icons/material-symbols/MaterialSymbolsSortRounded';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { useChangeParam } from '@/features/filters';

import { cn } from '@/utils/cn';

export type SortType =
    | 'anime'
    | 'watch'
    | 'manga'
    | 'novel'
    | 'read'
    | 'edit'
    | 'article';

const SHARED_SORT = [
    {
        label: 'Загальна оцінка',
        value: ['score'],
    },
    {
        label: 'Тип',
        value: ['media_type'],
    },
];

const SORT_CONTENT = [
    ...SHARED_SORT,
    {
        label: 'Дата релізу',
        value: ['start_date', 'created'],
    },
    {
        label: 'Дата створення на сайті',
        value: ['created'],
    },
];

const SORT_WATCHLIST = [
    ...SHARED_SORT,
    {
        label: 'Дата релізу',
        value: ['start_date'],
    },
    {
        label: 'К-сть епізодів',
        value: ['watch_episodes'],
    },
    {
        label: 'Дата додавання',
        value: ['watch_created'],
    },
    {
        label: 'Власна оцінка',
        value: ['watch_score'],
    },
];

const SORT_READLIST = [
    ...SHARED_SORT,
    {
        label: 'Дата релізу',
        value: ['start_date'],
    },
    {
        label: 'Дата додавання',
        value: ['read_created'],
    },
    {
        label: 'К-сть томів',
        value: ['read_volumes'],
    },
    {
        label: 'К-сть розділів',
        value: ['read_chapters'],
    },
    {
        label: 'Власна оцінка',
        value: ['read_score'],
    },
];

const SORT_EDITLIST = [
    {
        label: 'Номер правки',
        value: ['edit_id'],
    },
    {
        label: 'Дата створення',
        value: ['created'],
    },
];

const SORT_ARTICLELIST = [
    {
        label: 'Дата створення',
        value: ['created'],
    },
    {
        label: 'Оцінка',
        value: ['vote_score'],
    },
];

const getSort = (sort_type: SortType) => {
    switch (sort_type) {
        case 'anime':
            return SORT_CONTENT;
        case 'watch':
            return SORT_WATCHLIST;
        case 'manga':
            return SORT_CONTENT;
        case 'novel':
            return SORT_CONTENT;
        case 'read':
            return SORT_READLIST;
        case 'edit':
            return SORT_EDITLIST;
        case 'article':
            return SORT_ARTICLELIST;
        default:
            return SORT_CONTENT;
    }
};

interface Props {
    className?: string;
    sort_type: SortType;
}

const Sort: FC<Props> = ({ sort_type, className }) => {
    const searchParams = useSearchParams()!;

    const order = searchParams.get('order');
    const sort = searchParams.getAll('sort');

    const handleChangeParam = useChangeParam();

    return (
        <CollapsibleFilter
            title="Сортування"
            icon={<ArrowDownWideNarrow className="size-4" />}
        >
            <div className="flex gap-2">
                <Select
                    value={sort.length > 0 ? [sort.join(',')] : undefined}
                    onValueChange={(value) =>
                        handleChangeParam('sort', value[0].split(','))
                    }
                >
                    <SelectTrigger className="min-w-0 flex-1">
                        <SelectValue placeholder="Виберіть сортування..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectList>
                            <SelectGroup>
                                {getSort(sort_type).map((item) => (
                                    <SelectItem
                                        key={item.value[0]}
                                        value={item.value.join(',')}
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectList>
                    </SelectContent>
                </Select>
                <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                        handleChangeParam(
                            'order',
                            order === 'asc' ? 'desc' : 'asc',
                        )
                    }
                >
                    <MaterialSymbolsSortRounded
                        className={cn(order === 'asc' && '-scale-y-100')}
                    />
                </Button>
            </div>
        </CollapsibleFilter>
    );
};

export const FormSort: FC<Props & Partial<FormSelectProps>> = (props) => {
    return (
        <div className="flex flex-col gap-2">
            <FormLabel>Сортування</FormLabel>
            <div className="flex gap-2">
                <FormSelect
                    {...props}
                    name="sort"
                    className="flex-1"
                    placeholder="Виберіть сортування..."
                >
                    <SelectContent>
                        <SelectList>
                            <SelectGroup>
                                {getSort(props.sort_type).map((item) => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectList>
                    </SelectContent>
                </FormSelect>
                <FormField
                    name="order"
                    render={({ field }) => (
                        <FormItem>
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() =>
                                    field.onChange(
                                        field.value === 'asc' ? 'desc' : 'asc',
                                    )
                                }
                            >
                                <MaterialSymbolsSortRounded
                                    className={cn(
                                        field.value === 'asc' && '-scale-y-100',
                                    )}
                                />
                            </Button>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
};

export default Sort;
