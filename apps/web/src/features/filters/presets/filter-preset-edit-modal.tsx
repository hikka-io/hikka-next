import { useStore } from '@tanstack/react-form';
import { toast } from 'sonner';

import { ContentTypeEnum } from '@hikka/api';

import { useAppForm } from '@/components/form';
import { Button } from '@/components/ui/button';
import { ResponsiveModalFooter } from '@/components/ui/responsive-modal';
import { cn } from '@/utils/cn';
import { newId } from '@/utils/new-id';
import { DATE_RANGE } from '@/utils/season';
import type { SortType } from '@/utils/sort';

import { FormAgeRating } from '../age-rating';
import { FormDateRange } from '../date-range';
import { SCORE_RANGE, YEARS } from '../filter-ranges';
import { FormGenre } from '../genre';
import { FormLocalization } from '../localization';
import { FormMediaType } from '../media-type';
import { FormReleaseStatus } from '../release-status';
import { FormScore } from '../score';
import { FormSeason } from '../season';
import { FormSort } from '../sort';
import { FormStudio } from '../studio';
import { FormYear } from '../year/year';
import ContentTypeSelect from './content-type-select';
import {
    type FilterPresetFormValues,
    filterPresetFormOptions,
} from './filter-preset-form';
import { useFilterPresetsStore } from './filter-presets-store';
import type { FilterPreset } from './types';

const arraysEqual = (a: unknown[] | undefined, b: unknown[] | undefined) =>
    JSON.stringify(a) === JSON.stringify(b);

type Props = {
    filterPreset?: FilterPreset;
    onClose?: () => void;
    onBack?: () => void;
};

const FilterPresetEditModal = ({ filterPreset, onClose, onBack }: Props) => {
    const { filterPresets, setFilterPresets } = useFilterPresetsStore();

    const defaultValues: FilterPresetFormValues = {
        ...filterPresetFormOptions.defaultValues,
        ...(filterPreset ?? {}),
    };

    const form = useAppForm({
        ...filterPresetFormOptions,
        defaultValues,
        onSubmit: async ({ value }) => {
            const filteredData = Object.fromEntries(
                Object.entries(value).filter(
                    ([key, val]) =>
                        val !== false &&
                        val !== undefined &&
                        val !== null &&
                        !(Array.isArray(val) && val.length === 0) &&
                        !(
                            key === 'years' &&
                            arraysEqual(val as number[], YEARS)
                        ) &&
                        !(
                            key === 'score' &&
                            arraysEqual(val as number[], SCORE_RANGE)
                        ) &&
                        !(
                            key === 'date_range' &&
                            arraysEqual(val as number[], DATE_RANGE)
                        ),
                ),
            );

            const newFilterPreset: FilterPreset = {
                name: value.name,
                description: value.description,
                content_types: value.content_types,
                ...filteredData,
                id: filterPreset?.id || newId(),
                ...(value.date_range_enabled && {
                    years: undefined,
                    seasons: undefined,
                }),
                ...(!value.date_range_enabled && {
                    date_range: undefined,
                }),
            };

            if (filterPreset) {
                setFilterPresets([
                    newFilterPreset,
                    ...filterPresets.filter(
                        (preset) => preset.id !== filterPreset.id,
                    ),
                ]);
            } else {
                setFilterPresets([newFilterPreset, ...filterPresets]);
            }

            toast.success('Фільтр успішно збережено');
            onClose?.();
        },
    });

    const content_types = useStore(form.store, (s) => s.values.content_types);
    const date_range_enabled = useStore(
        form.store,
        (s) => s.values.date_range_enabled,
    );

    const handleBack = () => {
        onBack?.();
    };

    return (
        <form.AppForm>
            <form.Form className="contents">
                <div className="-m-4 flex flex-1 flex-col gap-6 overflow-y-scroll p-4">
                    <form.AppField
                        name="name"
                        children={(field) => (
                            <field.TextField
                                label="Назва"
                                placeholder="Назва"
                                required
                            />
                        )}
                    />
                    <form.AppField
                        name="description"
                        children={(field) => (
                            <field.TextareaField
                                label="Опис"
                                placeholder="Опис"
                            />
                        )}
                    />
                    <ContentTypeSelect disabled={!!filterPreset} />
                    <div
                        className={cn(
                            !content_types && 'pointer-events-none opacity-50',
                            'flex w-full flex-col gap-6',
                        )}
                    >
                        <FormReleaseStatus />
                        {!date_range_enabled &&
                            content_types &&
                            content_types.includes(ContentTypeEnum.ANIME) && (
                                <FormSeason />
                            )}
                        {!date_range_enabled && <FormYear />}
                        {content_types &&
                            content_types.length === 1 &&
                            content_types.includes(ContentTypeEnum.ANIME) && (
                                <FormDateRange />
                            )}
                        <FormGenre />
                        {content_types && content_types.length === 1 && (
                            <FormMediaType content_type={content_types[0]} />
                        )}
                        <FormLocalization />
                        {content_types && content_types.length > 0 && (
                            <FormSort
                                sort_type={
                                    content_types.length > 1
                                        ? 'anime'
                                        : (content_types[0] as SortType)
                                }
                            />
                        )}
                        <FormAgeRating />
                        <FormScore score_type="score" />
                        {content_types?.includes(ContentTypeEnum.ANIME) && (
                            <FormStudio />
                        )}
                    </div>
                </div>
                <ResponsiveModalFooter>
                    <Button size="md" variant="outline" onClick={handleBack}>
                        Скасувати
                    </Button>
                    <Button size="md" type="submit">
                        Зберегти
                    </Button>
                </ResponsiveModalFooter>
            </form.Form>
        </form.AppForm>
    );
};

export default FilterPresetEditModal;
