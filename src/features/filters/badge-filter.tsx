import { FC } from 'react';
import MaterialSymbolsInfoRounded from '~icons/material-symbols/info-rounded';

import P from '@/components/typography/p';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {
    property: string;
    title?: string;
    properties: Hikka.FilterProperty<string> | string[];
    selected: string[];
    onParamChange: (key: string, value: string | string[]) => void;
}

const BadgeFilter: FC<Props> = ({
    title,
    properties,
    selected,
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
        <div className="flex flex-wrap gap-2">
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
                        variant={
                            selected.includes(slug) ? 'default' : 'outline'
                        }
                    >
                        {isPropertiesArray ? slug : properties[slug].title_ua}

                        {!isPropertiesArray && properties[slug].description && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <div>
                                        <MaterialSymbolsInfoRounded className="text-xs opacity-30 transition duration-100 hover:opacity-100" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <P className="text-sm">
                                        {properties[slug].description}
                                    </P>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </Button>
                ),
            )}
        </div>
    );
};

export default BadgeFilter;
