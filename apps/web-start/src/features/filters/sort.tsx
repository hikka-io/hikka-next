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

export interface SortOption {
    label: string;
    value: string;
    /** Hidden fields auto-appended after this field in API calls. */
    secondaryFields?: string[];
}

export interface SortConfig {
    options: SortOption[];
    defaultSort: string;
    defaultOrder: 'asc' | 'desc';
}

const SHARED_SORT: SortOption[] = [
    {
        label: 'Оцінка MAL',
        value: 'score',
        secondaryFields: ['scored_by'],
    },
    {
        label: 'Оцінка Hikka',
        value: 'native_score',
        secondaryFields: ['native_scored_by'],
    },
    {
        label: 'Тип',
        value: 'media_type',
    },
];

const SORT_CONTENT: SortOption[] = [
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

const SORT_WATCHLIST: SortOption[] = [
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

const SORT_READLIST: SortOption[] = [
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

const SORT_EDITLIST: SortOption[] = [
    {
        label: 'Номер правки',
        value: 'edit_id',
    },
    {
        label: 'Дата створення',
        value: 'created',
    },
];

const SORT_ARTICLELIST: SortOption[] = [
    {
        label: 'Дата створення',
        value: 'created',
    },
    {
        label: 'Оцінка',
        value: 'vote_score',
    },
];

const SORT_CONFIGS: Record<SortType, SortConfig> = {
    anime: {
        options: SORT_CONTENT,
        defaultSort: 'score',
        defaultOrder: 'desc',
    },
    manga: {
        options: SORT_CONTENT,
        defaultSort: 'score',
        defaultOrder: 'desc',
    },
    novel: {
        options: SORT_CONTENT,
        defaultSort: 'score',
        defaultOrder: 'desc',
    },
    watch: {
        options: SORT_WATCHLIST,
        defaultSort: 'watch_score',
        defaultOrder: 'desc',
    },
    read: {
        options: SORT_READLIST,
        defaultSort: 'read_score',
        defaultOrder: 'desc',
    },
    edit: {
        options: SORT_EDITLIST,
        defaultSort: 'edit_id',
        defaultOrder: 'desc',
    },
    article: {
        options: SORT_ARTICLELIST,
        defaultSort: 'created',
        defaultOrder: 'desc',
    },
};

export function getSort(sort_type: SortType): SortOption[] {
    return SORT_CONFIGS[sort_type].options;
}

export function expandSort(
    sortType: SortType,
    sort?: string,
    order?: 'asc' | 'desc',
): string[] {
    const config = SORT_CONFIGS[sortType];
    const field = sort || config.defaultSort;
    const dir = order ?? config.defaultOrder;

    const option = config.options.find((o) => o.value === field);

    const expanded = option?.secondaryFields
        ? [field, ...option.secondaryFields]
        : [field];

    return expanded.map((f) => `${f}:${dir}`);
}

const ONGOINGS_SORT_FIELDS = [
    'score',
    'scored_by',
    'native_score',
    'native_scored_by',
] as const;

const ONGOINGS_SORT: string[] = ONGOINGS_SORT_FIELDS.map((f) => `${f}:desc`);

export function getOngoingsSort(): string[] {
    return ONGOINGS_SORT;
}

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
    const { order, sort } = useFilterSearch<{
        order?: string;
        sort?: string;
    }>();

    const handleChangeParam = useChangeParam();

    const control = (
        <div
            className={cn('flex', compact ? cn('w-auto', className) : 'gap-2')}
        >
            <Select
                value={sort ? [sort] : []}
                onValueChange={(value) =>
                    handleChangeParam('sort', value[0] ?? '')
                }
            >
                <SelectTrigger
                    size="md"
                    className={cn(
                        'min-w-0',
                        compact ? 'w-40 rounded-r-none' : 'flex-1',
                    )}
                >
                    <SelectValue
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
