import type { FC } from 'react';

import { useNavigate } from '@tanstack/react-router';

import type { MainContentTypeEnum } from '@hikka/api';
import type { FranchiseOrder } from '@hikka/core';
import { CONTENT_TYPES } from '@hikka/core';

import { CONTENT_TYPE_ICONS } from '@/components/icons/content-type-icons';
import MaterialSymbolsSortRounded from '@/components/icons/material-symbols/MaterialSymbolsSortRounded';
import { Button } from '@/components/ui/button';
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
import { Link } from '@/utils/navigation';

import type { FranchiseModel } from './franchise-model';

type Search = Record<string, unknown>;

type Props = {
    to: string;
    order: FranchiseOrder;
    model?: FranchiseModel;
    types: MainContentTypeEnum[];
    selected: MainContentTypeEnum[];
};

const FranchiseChronologyToolbar: FC<Props> = ({
    to,
    order,
    model,
    types,
    selected,
}) => {
    const navigate = useNavigate();
    const orderLabel = order === 'asc' ? 'Спочатку старі' : 'Спочатку нові';

    const handleTypesChange = (value: string[]) => {
        const next = types.filter((type) => value.includes(type));

        navigate({
            to,
            search: (prev: Search) => ({
                ...prev,
                types:
                    next.length > 0 && next.length < types.length
                        ? next
                        : undefined,
            }),
            replace: true,
            resetScroll: false,
        });
    };

    return (
        <div className="flex items-center gap-2">
            {types.length > 1 && (
                <Select
                    multiple
                    value={selected}
                    onValueChange={handleTypesChange}
                >
                    <SelectTrigger size="md" className="flex-1 md:w-56">
                        <SelectValue
                            placeholder="Усі типи"
                            maxDisplay={1}
                            className="flex-nowrap"
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectList>
                            <SelectGroup>
                                {types.map((type) => {
                                    const Icon = CONTENT_TYPE_ICONS[type];
                                    const count = model?.nodes.filter(
                                        (node) => node.contentType === type,
                                    ).length;

                                    return (
                                        <SelectItem
                                            key={type}
                                            value={type}
                                            label={CONTENT_TYPES[type].title_ua}
                                        >
                                            <span className="flex items-center gap-2">
                                                <Icon className="size-4 text-muted-foreground" />
                                                {CONTENT_TYPES[type].title_ua}
                                                <span className="text-muted-foreground">
                                                    ({count})
                                                </span>
                                            </span>
                                        </SelectItem>
                                    );
                                })}
                            </SelectGroup>
                        </SelectList>
                    </SelectContent>
                </Select>
            )}
            <Tooltip>
                <TooltipTrigger
                    render={
                        <Button
                            size="icon-md"
                            variant="outline"
                            aria-label={`Порядок років: ${orderLabel}`}
                            className="ml-auto"
                            render={
                                <Link
                                    to={to}
                                    search={(prev: Search) => ({
                                        ...prev,
                                        order:
                                            order === 'desc'
                                                ? 'asc'
                                                : undefined,
                                    })}
                                    replace
                                    resetScroll={false}
                                />
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
};

export default FranchiseChronologyToolbar;
