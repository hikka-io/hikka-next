'use client';

import { usePathname } from 'next/navigation';
import { FC } from 'react';

import MaterialSymbolsAddRounded from '@/components/icons/material-symbols/MaterialSymbolsAddRounded';
import MaterialSymbolsDeleteForeverRounded from '@/components/icons/material-symbols/MaterialSymbolsDeleteForeverRounded';
import MaterialSymbolsEditRounded from '@/components/icons/material-symbols/MaterialSymbolsEditRounded';
import MaterialSymbolsFileCopyOutlineRounded from '@/components/icons/material-symbols/MaterialSymbolsFileCopyRounded';
import P from '@/components/typography/p';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from '@/components/ui/link';

import { useModalContext } from '@/services/providers/modal-provider';
import { useSettingsStore } from '@/services/stores/settings-store';
import { CONTENT_TYPES } from '@/utils/constants/common';
import { createQueryString } from '@/utils/url';

import FilterPresetEditModal from './filter-preset-edit-modal';

const FilterPresetModal: FC = () => {
    const { closeModal, openModal } = useModalContext();
    const { filterPresets, setFilterPresets } = useSettingsStore();
    const pathname = usePathname();

    const handleCreatePreset = () => {
        openModal({
            content: <FilterPresetEditModal />,
            className: '!max-w-xl',
            title: 'Створити пресет',
            forceModal: true,
        });
    };

    const handleEditPreset = (preset: Hikka.FilterPreset) => {
        openModal({
            content: <FilterPresetEditModal filterPreset={preset} />,
            className: '!max-w-xl',
            title: 'Редагувати пресет',
            forceModal: true,
        });
    };

    const handleDeletePreset = (presetId: string) => {
        setFilterPresets(
            filterPresets.filter((preset) => preset.id !== presetId),
        );
    };

    const buildFilterPresetLink = (preset: Hikka.FilterPreset) => {
        const { id, name, description, ...rest } = preset;

        const query = createQueryString('filters', rest, new URLSearchParams());

        return `${pathname}?${query}`;
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
            </div>

            <hr className="-mx-6 h-px w-auto bg-border" />

            <div className="flex items-center justify-between gap-2">
                <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                            Поточні налаштування
                        </span>
                    </div>
                    <P className="line-clamp-2 text-xs text-muted-foreground">
                        Зберегти поточні налаштування каталогу як окремий пресет
                    </P>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="icon-md"
                        variant="outline"
                        onClick={() => { }}
                    >
                        <MaterialSymbolsFileCopyOutlineRounded className="text-lg" />
                    </Button>
                </div>
            </div>

            <div className="-mx-6 h-full w-auto flex-1 overflow-y-scroll">
                {filterPresets?.map((preset) => (
                    <div
                        key={preset.id}
                        className="flex items-center justify-between gap-2 border-border px-6 py-3 last:border-b-0"
                    >
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <Link
                                    onClick={() => closeModal()}
                                    href={buildFilterPresetLink(preset)}
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
                                <P className="line-clamp-2 text-xs text-muted-foreground">
                                    {preset.description}
                                </P>
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
                        <P className="text-center text-sm text-muted-foreground">
                            Не знайдено збережених пресетів фільтрів
                        </P>
                    </div>
                )}
            </div>
        </>
    );
};

export default FilterPresetModal;
