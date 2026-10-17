import { type ComponentType, createElement, type FC } from 'react';

import MaterialSymbolsInfoRounded from '@/components/icons/material-symbols/MaterialSymbolsInfoRounded';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipPortal,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import type { FilterProperty } from '@/utils/labels/enum-labels';

export type BadgeFilterProps = {
    property: string;
    title?: string;
    properties: FilterProperty<string> | string[];
    icons?: Record<string, ComponentType | null>;
    counts?: Record<string, number>;
    selected: string[];
    disabled?: boolean;
    onParamChange: (key: string, value: string | string[]) => void;
    className?: string;
};

export const BadgeFilter: FC<BadgeFilterProps> = ({
    title,
    properties,
    icons,
    counts,
    selected,
    disabled,
    onParamChange,
    property,
    className,
}) => {
    const isPropertiesArray = Array.isArray(properties);

    const handleFilterSelect = (value: string, data: string[]) => {
        const newData = [...data];

        if (!newData.includes(value)) {
            newData.push(value);
        } else {
            newData.splice(newData.indexOf(value), 1);
        }

        return newData;
    };

    return (
        <div className={cn('flex flex-wrap gap-2', className)}>
            {(isPropertiesArray ? properties : Object.keys(properties)).map(
                (slug) => (
                    <Button
                        size="badge"
                        onClick={() =>
                            onParamChange(
                                property,
                                handleFilterSelect(slug, selected),
                            )
                        }
                        key={slug}
                        disabled={disabled && !selected.includes(slug)}
                        variant={
                            selected.includes(slug) ? 'default' : 'outline'
                        }
                    >
                        {icons?.[slug] && createElement(icons[slug])}
                        {isPropertiesArray ? slug : properties[slug].title_ua}
                        {counts?.[slug] !== undefined && (
                            <span className="tabular-nums opacity-60">
                                {counts[slug]}
                            </span>
                        )}

                        {!isPropertiesArray && properties[slug].description && (
                            <Tooltip delay={0}>
                                <TooltipTrigger render={<div />}>
                                    <MaterialSymbolsInfoRounded className="text-xs opacity-30 transition duration-100 hover:opacity-100" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{properties[slug].description}</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </Button>
                ),
            )}
        </div>
    );
};
