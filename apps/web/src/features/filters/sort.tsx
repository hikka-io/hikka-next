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
import { useRouteSearch } from '@/utils/navigation';
import { getSort, type SortType } from '@/utils/sort';

import { useChangeParam } from './use-change-param';

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
    const search = useRouteSearch<{
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
                <TooltipTrigger
                    render={
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
                        />
                    }
                >
                    <MaterialSymbolsSortRounded
                        className={cn(order === 'asc' && '-scale-y-100')}
                    />
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
