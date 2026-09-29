import type { FC } from 'react';

import type { ContentTypeEnum } from '@hikka/api';

import CustomCopyAddRounded from '@/components/icons/custom/CustomCopyAddRounded';
import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsDeleteForeverRounded from '@/components/icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TextLink from '@/components/ui/text-link';
import { CONTENT_TYPES } from '@/utils/labels/content-types';
import { usePathname, useRouteSearch } from '@/utils/navigation';

import { presetFromSearch, presetToSearch } from '../preset-search-mapper';
import { useFilterPresetsStore } from './filter-presets-store';
import type { FilterPreset } from './types';

type Props = {
    contentType: ContentTypeEnum;
    onClose?: () => void;
    onCreatePreset?: () => void;
    onEditPreset?: (preset: FilterPreset) => void;
    onCreateFromCurrent?: (filters: Partial<FilterPreset>) => void;
};

const FilterPresetModal: FC<Props> = ({
    contentType,
    onClose,
    onCreatePreset,
    onEditPreset,
    onCreateFromCurrent,
}) => {
    const { filterPresets, setFilterPresets } = useFilterPresetsStore();
    const pathname = usePathname();
    const search = useRouteSearch();

    const handleCreatePreset = () => {
        onCreatePreset?.();
    };

    const handleCreateFromCurrentFilters = () => {
        onCreateFromCurrent?.(presetFromSearch(search, contentType));
    };

    const handleEditPreset = (preset: FilterPreset) => {
        onEditPreset?.(preset);
    };

    const handleDeletePreset = (presetId: string) => {
        setFilterPresets(
            filterPresets.filter((preset) => preset.id !== presetId),
        );
    };

    const buildFilterPresetLink = (preset: FilterPreset) => {
        const params = new URLSearchParams();
        Object.entries(presetToSearch(preset)).forEach(([key, val]) => {
            if (val === undefined || val === null) return;
            if (Array.isArray(val)) {
                val.forEach((item) => {
                    if (item !== undefined && item !== null) {
                        params.append(key, String(item));
                    }
                });
            } else {
                params.set(key, String(val));
            }
        });

        const query = params.toString();
        return query ? `${pathname}?${query}` : pathname;
    };

    return (
        <>
            <div className="flex flex-col gap-4">
                <Button
                    variant="secondary"
                    onClick={handleCreatePreset}
                    className="w-full"
                >
                    <MaterialSymbolsAddRounded />
                    Створити новий пресет
                </Button>

                <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                                Поточні фільтри
                            </span>
                        </div>
                        <p className="line-clamp-2 text-muted-foreground text-xs">
                            Створити пресет із поточних фільтрів
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="icon-md"
                            variant="secondary"
                            onClick={handleCreateFromCurrentFilters}
                        >
                            <CustomCopyAddRounded className="text-lg" />
                        </Button>
                    </div>
                </div>
            </div>

            <hr className="-mx-4 h-px w-auto bg-border" />

            <div className="-mx-4 h-full w-auto flex-1 overflow-y-scroll">
                {filterPresets?.map((preset) => (
                    <div
                        key={preset.id}
                        className="flex items-center justify-between gap-2 border-border px-4 py-3 last:border-b-0"
                    >
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <TextLink
                                    onClick={() => onClose?.()}
                                    to={buildFilterPresetLink(preset)}
                                    className="font-medium text-sm"
                                >
                                    {preset.name}
                                </TextLink>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary">
                                        {
                                            CONTENT_TYPES[
                                                preset
                                                    .content_types[0] as keyof typeof CONTENT_TYPES
                                            ]?.title_ua
                                        }
                                    </Badge>
                                    {preset.content_types.length > 1 && (
                                        <Badge variant="outline">
                                            +{preset.content_types.length - 1}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                            {preset.description && (
                                <p className="line-clamp-2 text-muted-foreground text-xs">
                                    {preset.description}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                size="icon-md"
                                variant="outline"
                                onClick={() => handleEditPreset(preset)}
                            >
                                <MaterialSymbolsEditRounded className="text-lg" />
                            </Button>
                            <Button
                                size="icon-md"
                                variant="outline"
                                onClick={() => handleDeletePreset(preset.id)}
                            >
                                <MaterialSymbolsDeleteForeverRounded className="text-lg" />
                            </Button>
                        </div>
                    </div>
                ))}

                {filterPresets?.length === 0 && (
                    <div className="px-6 py-8">
                        <p className="text-center text-muted-foreground text-sm">
                            Не знайдено збережених пресетів фільтрів
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default FilterPresetModal;
