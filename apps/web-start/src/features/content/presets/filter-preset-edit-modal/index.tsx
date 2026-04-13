'use client';

import { ContentTypeEnum } from '@hikka/client';
import { useStore } from '@tanstack/react-form';
import { toast } from 'sonner';

import { useAppForm } from '@/components/form/use-app-form';
import { Button } from '@/components/ui/button';
import { ResponsiveModalFooter } from '@/components/ui/responsive-modal';

import { FormAgeRating } from '@/features/filters/age-rating';
import { FormDateRange } from '@/features/filters/date-range';
import { FormGenre } from '@/features/filters/genre';
import { FormLocalization } from '@/features/filters/localization';
import { FormMediaType } from '@/features/filters/media-type';
import { FormReleaseStatus } from '@/features/filters/release-status';
import { FormScore } from '@/features/filters/score';
import { FormSeason } from '@/features/filters/season';
import { FormSort, SortType } from '@/features/filters/sort';
import { FormStudio } from '@/features/filters/studio';
import { FormYear } from '@/features/filters/year';

import { useSettingsStore } from '@/services/stores/settings-store';
import { cn } from '@/utils/cn';
import { z } from '@/utils/i18n/zod';

import ContentTypeSelect from './components/content-type-select';

const formSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().min(1).max(500).optional(),
    content_types: z.array(z.nativeEnum(ContentTypeEnum)),
    statuses: z.array(z.string()).optional(),
    seasons: z.array(z.string()).optional(),
    types: z.array(z.string()).optional(),
    genres: z.array(z.string()).optional(),
    only_translated: z.boolean().optional(),
    sort: z.string().nullable().optional(),
    order: z.string().nullable().optional(),
    ratings: z.array(z.string()).optional(),
    studios: z.array(z.string()).optional(),
    years: z.array(z.number()).optional(),
    score: z.array(z.number()).optional(),
    date_range_enabled: z.boolean().optional(),
    date_range: z.array(z.number()).nullable().optional(),
});

const YEARS: [number, number] = [1965, new Date().getFullYear()];
const DATE_RANGE: [number, number] = [-4, 4];
const SCORE_RANGE: [number, number] = [1, 10];

const DEFAULT_VALUES = {
    years: YEARS,
    statuses: [],
    seasons: [],
    types: [],
    genres: [],
    only_translated: false,
    sort: undefined,
    order: null,
    ratings: [],
    studios: [],
    date_range_enabled: false,
    date_range: DATE_RANGE,
    score: SCORE_RANGE,
};

const arraysEqual = (a: unknown[] | undefined, b: unknown[] | undefined) =>
    JSON.stringify(a) === JSON.stringify(b);

interface Props {
    filterPreset?: Hikka.FilterPreset;
    onClose?: () => void;
    onBack?: () => void;
}

const Component = ({ filterPreset, onClose, onBack }: Props) => {
    const { filterPresets, setFilterPresets } = useSettingsStore();

    const form = useAppForm({
        defaultValues: {
            ...DEFAULT_VALUES,
            ...(filterPreset ?? {}),
        } as z.infer<typeof formSchema>,
        validators: { onSubmit: formSchema },
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

            const newFilterPreset: Hikka.FilterPreset = {
                name: value.name,
                description: value.description,
                content_types: value.content_types,
                ...filteredData,
                id: filterPreset?.id || crypto.randomUUID(),
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

    const content_types = useStore(
        form.store,
        (s) => s.values.content_types,
    );
    const date_range_enabled = useStore(
        form.store,
        (s) => s.values.date_range_enabled,
    );

    const handleBack = () => {
        onBack?.();
    };

    return (
        <form.AppForm>
            <form
                className="contents"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                }}
            >
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
                    {content_types &&
                        content_types.includes(ContentTypeEnum.ANIME) && (
                            <FormStudio />
                        )}
                </div>
            </div>
            <ResponsiveModalFooter>
                <Button size="md" variant="outline" onClick={handleBack}>
                    Скасувати
                </Button>
                <Button
                    size="md"
                    type="submit"
                >
                    Зберегти
                </Button>
            </ResponsiveModalFooter>
            </form>
        </form.AppForm>
    );
};

export default Component;
