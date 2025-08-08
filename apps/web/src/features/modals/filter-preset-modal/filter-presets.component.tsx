'use client';

import { ContentTypeEnum } from '@hikka/client';
import { usePathname, useRouter } from 'next/navigation';
import { FC } from 'react';

import MaterialSymbolsInfoRounded from '@/components/icons/material-symbols/MaterialSymbolsInfoRounded';
import P from '@/components/typography/p';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { useSettingsStore } from '@/services/stores/settings-store';
import createQueryString from '@/utils/create-query-string';
import { cn } from '@/utils/utils';

interface Props {
    className?: string;
    content_type: ContentTypeEnum;
}

const FilterPresets: FC<Props> = ({ className, content_type }) => {
    const { filterPresets } = useSettingsStore();
    const router = useRouter();
    const pathname = usePathname();

    const handleApplyFilterPreset = (preset: Hikka.FilterPreset) => {
        const {
            id,
            name,
            description,
            date_range_enabled,
            date_min_range,
            date_max_range,
            ...rest
        } = preset;

        const query = createQueryString('filters', rest, new URLSearchParams());

        router.replace(`${pathname}?${query}`);
    };

    return (
        <div
            className={cn(
                'no-scrollbar flex flex-1 overflow-x-auto items-center -mx-4 px-4 lg:mx-0 lg:px-0 gradient-mask-r-90-d md:gradient-mask-none lg:border-r',
                className,
            )}
        >
            {filterPresets
                .filter((preset) => preset.content_types.includes(content_type))
                .map((preset) => (
                    <Button
                        key={preset.id}
                        size="badge"
                        variant="outline"
                        className="mr-2 h-fit"
                        onClick={() => handleApplyFilterPreset(preset)}
                    >
                        {preset.name}
                        {preset.description && (
                            <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                    <div>
                                        <MaterialSymbolsInfoRounded className="text-xs opacity-30 transition duration-100 hover:opacity-100" />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <P className="text-sm">
                                        {preset.description}
                                    </P>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </Button>
                ))}
        </div>
    );
};

export default FilterPresets;
