'use client';

import { ContentTypeEnum } from '@hikka/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import FormInput from '@/components/form/form-input';
import FormTextarea from '@/components/form/form-textarea';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { FormAgeRating } from '@/features/filters/components/prebuilt/age-rating';
import { FormDateRange } from '@/features/filters/components/prebuilt/date-range';
import { FormGenre } from '@/features/filters/components/prebuilt/genre';
import { FormLocalization } from '@/features/filters/components/prebuilt/localization';
import { FormMediaType } from '@/features/filters/components/prebuilt/media-type';
import { FormReleaseStatus } from '@/features/filters/components/prebuilt/release-status';
import { FormSeason } from '@/features/filters/components/prebuilt/season';
import {
    FormSort,
    SortType,
} from '@/features/filters/components/prebuilt/sort';
import { FormStudio } from '@/features/filters/components/prebuilt/studio';
import { FormYear } from '@/features/filters/components/prebuilt/year';

import { useModalContext } from '@/services/providers/modal-provider';
import { useSettingsStore } from '@/services/stores/settings-store';
import { cn } from '@/utils/utils';
import { z } from '@/utils/zod';

import ContentTypeSelect from './components/content-type-select';
import FilterPresetModal from './filter-preset-modal';

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
    date_range_enabled: z.boolean().optional(),
    date_range: z.array(z.number()).nullable().optional(),
});

const YEARS: [number, number] = [1965, new Date().getFullYear()];
const DATE_RANGE: [number, number] = [-4, 4];

const DEFAULT_VALUES = {
    years: YEARS,
    statuses: [],
    seasons: [],
    types: [],
    genres: [],
    only_translated: false,
    sort: null,
    order: null,
    ratings: [],
    studios: [],
    date_range_enabled: false,
    date_range: DATE_RANGE,
};

interface Props {
    filterPreset?: Hikka.FilterPreset;
}

const Component = ({ filterPreset }: Props) => {
    const { filterPresets, setFilterPresets } = useSettingsStore();
    const { closeModal, openModal } = useModalContext();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...DEFAULT_VALUES,
            ...(filterPreset ?? {}),
        },
    });

    const content_types = form.watch('content_types');
    const date_range_enabled = form.watch('date_range_enabled');

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        const filteredData = Object.fromEntries(
            Object.entries(data).filter(
                ([_, value]) =>
                    value !== false &&
                    value !== undefined &&
                    value !== null &&
                    !(Array.isArray(value) && value.length === 0),
            ),
        );

        const newFilterPreset: Hikka.FilterPreset = {
            name: data.name,
            description: data.description,
            content_types: data.content_types,
            ...filteredData,
            id: filterPreset?.id || crypto.randomUUID(),
            ...(data.date_range_enabled && {
                years: undefined,
                seasons: undefined,
            }),
            ...(!data.date_range_enabled && {
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
        closeModal();
    };

    const handleBack = () => {
        openModal({
            content: <FilterPresetModal />,
            className: '!max-w-xl',
            title: 'Пресети',
            forceModal: true,
        });
    };

    return (
        <Form {...form}>
            <div className="flex flex-col gap-8">
                <div className="flex w-full flex-col gap-6">
                    <FormInput
                        name="name"
                        label="Назва"
                        placeholder="Назва"
                        required
                    />
                    <FormTextarea
                        name="description"
                        label="Опис"
                        placeholder="Опис"
                    />
                    <ContentTypeSelect
                        disabled={!!filterPreset}
                        defaultValues={DEFAULT_VALUES}
                    />
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
                        {content_types && (
                            <FormSort
                                sort_type={
                                    content_types.length > 1
                                        ? 'anime'
                                        : (content_types[0] as SortType)
                                }
                            />
                        )}
                        <FormAgeRating />
                        {content_types &&
                            content_types.includes(ContentTypeEnum.ANIME) && (
                                <FormStudio />
                            )}
                    </div>
                </div>
                <div className="flex w-full justify-end gap-4">
                    <Button size="md" variant="outline" onClick={handleBack}>
                        Скасувати
                    </Button>
                    <Button
                        size="md"
                        type="submit"
                        onClick={form.handleSubmit(handleSubmit)}
                    >
                        Зберегти
                    </Button>
                </div>
            </div>
        </Form>
    );
};

export default Component;
