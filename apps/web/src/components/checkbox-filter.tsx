import { FC, createElement } from 'react';

import MaterialSymbolsInfoRounded from '@/components/icons/material-symbols/MaterialSymbolsInfoRounded';
import P from '@/components/typography/p';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export interface CheckboxFilterProps {
    property: string;
    title?: string;
    properties: Hikka.FilterProperty<string> | string[];
    selected: string[];
    disabled?: boolean;
    onParamChange: (key: string, value: string | string[]) => void;
}

export const CheckboxFilter: FC<CheckboxFilterProps> = ({
    title,
    properties,
    selected,
    disabled,
    onParamChange,
    property,
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
        <div className="grid grid-cols-2 gap-3">
            {(isPropertiesArray ? properties : Object.keys(properties)).map(
                (slug) => {
                    const isChecked = selected.includes(slug);
                    const isDisabled = disabled && !isChecked;

                    return (
                        <div key={slug} className="flex items-center gap-2">
                            <Checkbox
                                id={`${property}-${slug}`}
                                checked={isChecked}
                                disabled={isDisabled}
                                onCheckedChange={() =>
                                    onParamChange(
                                        property,
                                        handleFilterSelect(slug, selected),
                                    )
                                }
                            />
                            <Label
                                htmlFor={`${property}-${slug}`}
                                className="flex cursor-pointer items-center gap-1.5"
                            >
                                {!isPropertiesArray &&
                                    properties[slug].icon &&
                                    createElement(properties[slug].icon, {
                                        className: 'size-4',
                                    })}
                                {isPropertiesArray
                                    ? slug
                                    : properties[slug].title_ua}

                                {!isPropertiesArray &&
                                    properties[slug].description && (
                                        <Tooltip delayDuration={0}>
                                            <TooltipTrigger asChild>
                                                <div>
                                                    <MaterialSymbolsInfoRounded className="text-xs opacity-30 transition duration-100 hover:opacity-100" />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <P className="text-sm">
                                                    {
                                                        properties[slug]
                                                            .description
                                                    }
                                                </P>
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                            </Label>
                        </div>
                    );
                },
            )}
        </div>
    );
};
