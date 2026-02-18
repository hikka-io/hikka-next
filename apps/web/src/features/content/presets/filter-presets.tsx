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
import { cn } from '@/utils/cn';
import { createQueryString } from '@/utils/url';

interface Props {
    className?: string;
    content_type: ContentTypeEnum;
}

const FilterPresets: FC<Props> = ({ className, content_type }) => {
    const { filterPresets, _hasHydrated } = useSettingsStore();
    const router = useRouter();
    const pathname = usePathname();

    const handleApplyFilterPreset = (preset: Hikka.FilterPreset) => {
        const { id, name, description, ...rest } = preset;

        const query = createQueryString('filters', rest, new URLSearchParams());

        router.replace(`${pathname}?${query}`);
    };

    return (
        <div
            className={cn(
                'no-scrollbar -mx-4 flex flex-1 items-center overflow-x-auto px-4 gradient-mask-r-90-d md:gradient-mask-none lg:mx-0 lg:border-r lg:px-0',
                className,
            )}
        >
            {_hasHydrated &&
                filterPresets
                    .filter((preset) =>
                        preset.content_types.includes(content_type),
                    )
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
                                    <TooltipTrigger
                                        asChild
                                        className="hidden md:block"
                                    >
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
