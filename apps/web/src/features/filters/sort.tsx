import type { FC } from 'react';

import { useStore } from '@tanstack/react-form';
import { ArrowDownWideNarrow } from 'lucide-react';

import {
    SelectField,
    type SelectFieldProps,
} from '@/components/form/form-select';
import { useTypedAppFormContext } from '@/components/form/use-app-form';
import MaterialSymbolsSortRounded from '@/components/icons/material-symbols/MaterialSymbolsSortRounded';
import { Button } from '@/components/ui/button';
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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import {
    COMMENT_SORT_OPTIONS,
    DEFAULT_COMMENT_ORDER,
    DEFAULT_COMMENT_SORT,
} from '@/utils/constants/comment-sort';
import { formatSort } from '@/utils/sort-format';

import useChangeParam from './hooks/use-change-param';
import { useFilterSearch } from './hooks/use-filter-search';

export type SortType =
    | 'anime'
    | 'watch'
    | 'manga'
    | 'novel'
    | 'read'
    | 'edit'
    | 'article'
    | 'comment';

export interface SortOption {
    label: string;
    value: string;
    /** Hidden fields auto-appended after this field in API calls. */
    secondaryFields?: string[];
}

export interface SortConfig {
    options: readonly SortOption[];
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
    comment: {
        options: COMMENT_SORT_OPTIONS,
        defaultSort: DEFAULT_COMMENT_SORT,
        defaultOrder: DEFAULT_COMMENT_ORDER,
    },
};

export function getSort(sort_type: SortType): readonly SortOption[] {
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

    return formatSort(expanded, dir);
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

export type SortSize = 'sm' | 'md';

const SORT_SIZES: Record<
    SortSize,
    { trigger: 'sm' | 'md'; button: 'icon-sm' | 'icon-md' }
> = {
    // Matches `HeaderNavButton` (`icon-sm`, h-8) so both sit flush in a header.
    sm: { trigger: 'sm', button: 'icon-sm' },
    md: { trigger: 'md', button: 'icon-md' },
};

/**
 * Controlled mode stops the component reading URL search params. All four props
 * go together — half a set leaves one of the two controls silently dead.
 */
type ControlledProps = {
    sort: string;
    order: 'asc' | 'desc';
    onSortChange: (sort: string) => void;
    onOrderChange: (order: 'asc' | 'desc') => void;
};

type BaseProps = {
    className?: string;
    sort_type: SortType;
    /** Render as a compact inline control (no label header). */
    compact?: boolean;
    size?: SortSize;
    placeholder?: string;
};

type Props = BaseProps &
    (ControlledProps | { [K in keyof ControlledProps]?: never });

const Sort: FC<Props> = ({
    sort_type,
    className,
    placeholder,
    compact = false,
    size = 'md',
    sort: sortProp,
    order: orderProp,
    onSortChange,
    onOrderChange,
}) => {
    const search = useFilterSearch<{
        order?: string;
        sort?: string;
    }>();

    const handleChangeParam = useChangeParam();

    const controlled = onSortChange !== undefined;
    const sort = controlled ? sortProp : search.sort;
    const order = controlled ? orderProp : search.order;

    const changeSort = (value: string) =>
        onSortChange ? onSortChange(value) : handleChangeParam('sort', value);

    const changeOrder = (value: 'asc' | 'desc') =>
        onOrderChange
            ? onOrderChange(value)
            : handleChangeParam('order', value);

    const orderLabel = order === 'asc' ? 'За зростанням' : 'За спаданням';

    const sizeClasses = SORT_SIZES[size];

    const control = (
        <div
            className={cn('flex', compact ? cn('w-auto', className) : 'gap-2')}
        >
            <Select
                value={sort ? [sort] : []}
                onValueChange={(value) => changeSort(value[0] ?? '')}
            >
                <SelectTrigger
                    size={sizeClasses.trigger}
                    aria-label="Сортування"
                    className={cn(
                        'min-w-0 flex-1',
                        compact && 'rounded-r-none',
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
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        size={sizeClasses.button}
                        variant="outline"
                        aria-label={`Порядок сортування: ${orderLabel}`}
                        className={cn(
                            'shrink-0',
                            compact && 'rounded-l-none border-l-0',
                        )}
                        onClick={() =>
                            changeOrder(order === 'asc' ? 'desc' : 'asc')
                        }
                    >
                        <MaterialSymbolsSortRounded
                            className={cn(order === 'asc' && '-scale-y-100')}
                        />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{orderLabel}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );

    if (compact) {
        return control;
    }

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            <div className="flex items-center gap-2 text-muted-foreground">
                <ArrowDownWideNarrow className="size-4 shrink-0" />
                <Label>Сортування</Label>
            </div>
            {control}
        </div>
    );
};

export const FormSort: FC<Props & Partial<SelectFieldProps>> = (props) => {
    const form = useTypedAppFormContext({ defaultValues: {} as never });
    const order = useStore(form.store, (s) => (s.values as any).order);

    return (
        <div className="flex flex-col gap-2">
            <Label>Сортування</Label>
            <div className="flex gap-2">
                <form.AppField
                    name={'sort' as never}
                    children={() => (
                        <SelectField
                            className="flex-1"
                            placeholder="Виберіть сортування..."
                        >
                            <SelectContent>
                                <SelectList>
                                    <SelectGroup>
                                        {getSort(props.sort_type).map(
                                            (item) => (
                                                <SelectItem
                                                    key={item.value}
                                                    value={item.value}
                                                >
                                                    {item.label}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectGroup>
                                </SelectList>
                            </SelectContent>
                        </SelectField>
                    )}
                />
                <Button
                    size="icon"
                    variant="outline"
                    onClick={() =>
                        form.setFieldValue(
                            'order' as never,
                            (order === 'asc' ? 'desc' : 'asc') as never,
                        )
                    }
                >
                    <MaterialSymbolsSortRounded
                        className={cn(order === 'asc' && '-scale-y-100')}
                    />
                </Button>
            </div>
        </div>
    );
};

export default Sort;
