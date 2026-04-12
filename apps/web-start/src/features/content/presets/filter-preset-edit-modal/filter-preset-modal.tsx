'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useRouterState } from '@tanstack/react-router';
import { FC } from 'react';

import CustomCopyAddRounded from '@/components/icons/custom/CustomCopyAddRounded';
import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsDeleteForeverRounded from '@/components/icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from '@/components/ui/link';

import { useSettingsStore } from '@/services/stores/settings-store';
import { CONTENT_TYPES } from '@/utils/constants/common';

interface Props {
    onClose?: () => void;
    onCreatePreset?: () => void;
    onEditPreset?: (preset: Hikka.FilterPreset) => void;
    onCreateFromCurrent?: (filters: Partial<Hikka.FilterPreset>) => void;
}

const FilterPresetModal: FC<Props> = ({
    onClose,
    onCreatePreset,
    onEditPreset,
    onCreateFromCurrent,
}) => {
    const { filterPresets, setFilterPresets } = useSettingsStore();
    const pathname = useRouterState({
        select: (s) => (s.resolvedLocation ?? s.location).pathname,
    });
    const search = useRouterState({
        select: (s) =>
            (s.resolvedLocation ?? s.location).search as Record<
                string,
                unknown
            >,
    });

    const handleCreatePreset = () => {
        onCreatePreset?.();
    };

    const handleCreateFromCurrentFilters = () => {
        const currentFilters: Partial<Hikka.FilterPreset> = {
            name: '',
            description: '',
        };

        const arrayStringKeys = [
            'content_types',
            'statuses',
            'seasons',
            'types',
            'genres',
            'ratings',
            'studios',
        ] as const;

        arrayStringKeys.forEach((key) => {
            const rawValue = search[key];
            if (rawValue !== undefined && rawValue !== null) {
                const values = Array.isArray(rawValue)
                    ? rawValue.map(String)
                    : [String(rawValue)];
                if (values.length > 0) {
                    currentFilters[key] = values as unknown as NonNullable<
                        Hikka.FilterPreset[typeof key]
                    >;
                }
            }
        });

        const arrayNumberKeys = ['years', 'date_range'] as const;
        arrayNumberKeys.forEach((key) => {
            const rawValue = search[key];
            if (rawValue !== undefined && rawValue !== null) {
                const values = Array.isArray(rawValue)
                    ? rawValue.map(Number)
                    : [Number(rawValue)];
                if (values.length > 0) {
                    currentFilters[key] = values as unknown as NonNullable<
                        Hikka.FilterPreset[typeof key]
                    >;
                }
            }
        });

        if (search.only_translated !== undefined) {
            currentFilters.only_translated =
                search.only_translated === true ||
                search.only_translated === 'true';
        }
        if (search.date_range_enabled !== undefined) {
            currentFilters.date_range_enabled =
                search.date_range_enabled === true ||
                search.date_range_enabled === 'true';
        }

        const sortRaw = search.sort;
        if (sortRaw !== undefined && sortRaw !== null) {
            currentFilters.sort = String(sortRaw);
        }

        const order = search.order;
        if (order) currentFilters.order = String(order);

        if (!currentFilters.content_types) {
            if (pathname.includes('/anime')) {
                currentFilters.content_types = [ContentTypeEnum.ANIME];
            } else if (pathname.includes('/manga')) {
                currentFilters.content_types = [ContentTypeEnum.MANGA];
            } else if (pathname.includes('/novel')) {
                currentFilters.content_types = [ContentTypeEnum.NOVEL];
            }
        }

        onCreateFromCurrent?.(currentFilters);
    };

    const handleEditPreset = (preset: Hikka.FilterPreset) => {
        onEditPreset?.(preset);
    };

    const handleDeletePreset = (presetId: string) => {
        setFilterPresets(
            filterPresets.filter((preset) => preset.id !== presetId),
        );
    };

    const buildFilterPresetLink = (preset: Hikka.FilterPreset) => {
        const { id, name, description, ...rest } = preset;

        const params = new URLSearchParams();
        Object.entries(rest).forEach(([key, val]) => {
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
                            <span className="text-sm font-medium">
                                Поточні фільтри
                            </span>
                        </div>
                        <p className="text-muted-foreground line-clamp-2 text-xs">
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

            <hr className="bg-border -mx-6 h-px w-auto" />

            <div className="-mx-6 h-full w-auto flex-1 overflow-y-scroll">
                {filterPresets?.map((preset) => (
                    <div
                        key={preset.id}
                        className="border-border flex items-center justify-between gap-2 px-6 py-3 last:border-b-0"
                    >
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <Link
                                    onClick={() => onClose?.()}
                                    to={buildFilterPresetLink(preset)}
                                    className="text-sm font-medium"
                                >
                                    {preset.name}
                                </Link>
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
                                <p className="text-muted-foreground line-clamp-2 text-xs">
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
                        <p className="text-muted-foreground text-center text-sm">
                            Не знайдено збережених пресетів фільтрів
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default FilterPresetModal;
