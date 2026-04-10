'use client';

import { ArrowDownWideNarrow } from 'lucide-react';
import { FC } from 'react';

import FormSelect, { FormSelectProps } from '@/components/form/form-select';
import MaterialSymbolsSortRounded from '@/components/icons/material-symbols/MaterialSymbolsSortRounded';
import { Button } from '@/components/ui/button';
import { FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectList,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { cn } from '@/utils/cn';

import useChangeParam from './hooks/use-change-param';
import { useFilterSearch } from './hooks/use-filter-search';

export type SortType =
    | 'anime'
    | 'watch'
    | 'manga'
    | 'novel'
    | 'read'
    | 'edit'
    | 'article';

export const SHARED_SORT = [
    {
        label: 'Оцінка MAL',
        value: 'score',
    },
    {
        label: 'Оцінка Hikka',
        value: 'native_score',
    },
    {
        label: 'Тип',
        value: 'media_type',
    },
];

export const SORT_CONTENT = [
    ...SHARED_SORT,
    {
        label: 'Дата релізу',
        value: 'start_date',
    },
    {
        label: 'Дата створення на сайті',
        value: 'created',
    },
];

export const SORT_WATCHLIST = [
    ...SHARED_SORT,
    {
        label: 'Дата релізу',
        value: 'start_date',
    },
    {
        label: 'К-сть епізодів',
        value: 'watch_episodes',
    },
    {
        label: 'Дата додавання',
        value: 'watch_created',
    },
    {
        label: 'Власна оцінка',
        value: 'watch_score',
    },
];

export const SORT_READLIST = [
    ...SHARED_SORT,
    {
        label: 'Дата релізу',
        value: 'start_date',
    },
    {
        label: 'Дата додавання',
        value: 'read_created',
    },
    {
        label: 'К-сть томів',
        value: 'read_volumes',
    },
    {
        label: 'К-сть розділів',
        value: 'read_chapters',
    },
    {
        label: 'Власна оцінка',
        value: 'read_score',
    },
];

export const SORT_EDITLIST = [
    {
        label: 'Номер правки',
        value: 'edit_id',
    },
    {
        label: 'Дата створення',
        value: 'created',
    },
];

export const SORT_ARTICLELIST = [
    {
        label: 'Дата створення',
        value: 'created',
    },
    {
        label: 'Оцінка',
        value: 'vote_score',
    },
];

export const getSort = (sort_type: SortType) => {
    switch (sort_type) {
        case 'anime':
        case 'manga':
        case 'novel':
            return SORT_CONTENT;
        case 'watch':
            return SORT_WATCHLIST;
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
    /** Render as a compact inline control (no label header). */
    compact?: boolean;
    placeholder?: string;
}

const Sort: FC<Props> = ({
    sort_type,
    className,
    placeholder,
    compact = false,
}) => {
    const { order, sort = [] } = useFilterSearch<{
        order?: string;
        sort?: string[];
    }>();

    const handleChangeParam = useChangeParam();

    const control = (
        <div
            className={cn('flex', compact ? cn('w-auto', className) : 'gap-2')}
        >
            <Select
                multiple
                value={sort}
                onValueChange={(value) => handleChangeParam('sort', value)}
            >
                <SelectTrigger
                    size="md"
                    className={cn(
                        'min-w-0',
                        compact ? 'w-40 rounded-r-none' : 'flex-1',
                    )}
                >
                    <SelectValue
                        maxDisplay={1}
                        maxItemLength={compact ? 10 : undefined}
                        className={compact ? 'flex-nowrap!' : undefined}
                        placeholder={placeholder ?? 'Виберіть сортування...'}
                    />
                </SelectTrigger>
                <SelectContent>
                    <SelectList>
                        <SelectGroup>
                            {getSort(sort_type).map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectList>
                </SelectContent>
            </Select>
            <Button
                size="icon-md"
                variant="outline"
                className={cn(
                    'shrink-0',
                    compact && 'rounded-l-none border-l-0',
                )}
                onClick={() =>
                    handleChangeParam('order', order === 'asc' ? 'desc' : 'asc')
                }
            >
                <MaterialSymbolsSortRounded
                    className={cn(order === 'asc' && '-scale-y-100')}
                />
            </Button>
        </div>
    );

    if (compact) {
        return control;
    }

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            <div className="text-muted-foreground flex items-center gap-2">
                <ArrowDownWideNarrow className="size-4 shrink-0" />
                <Label>Сортування</Label>
            </div>
            {control}
        </div>
    );
};

export const FormSort: FC<Props & Partial<FormSelectProps>> = (props) => {
    return (
        <div className="flex flex-col gap-2">
            <Label>Сортування</Label>
            <div className="flex gap-2">
                <FormSelect
                    {...props}
                    name="sort"
                    className="flex-1"
                    placeholder="Виберіть сортування..."
                    multiple
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
