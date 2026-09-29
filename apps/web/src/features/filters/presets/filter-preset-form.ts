import { formOptions } from '@tanstack/react-form';

import { ContentTypeEnum } from '@hikka/api';

import { z } from '@/utils/i18n/zod';
import { DATE_RANGE } from '@/utils/season';

import { SCORE_RANGE, YEARS } from '../filter-ranges';

const filterPresetFormSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().max(500).optional(),
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

export type FilterPresetFormValues = z.infer<typeof filterPresetFormSchema>;

const DEFAULT_VALUES: Omit<FilterPresetFormValues, 'name' | 'content_types'> = {
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

export const filterPresetFormOptions = formOptions({
    // A new preset starts without name and content_types, which only the submit schema requires.
    defaultValues: DEFAULT_VALUES as FilterPresetFormValues,
    validators: { onSubmit: filterPresetFormSchema },
});
