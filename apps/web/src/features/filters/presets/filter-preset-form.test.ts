import { describe, expect, it } from 'vitest';

import { ContentTypeEnum } from '@hikka/api';

import { presetFromSearch } from '../preset-search-mapper';
import { filterPresetFormOptions } from './filter-preset-form';

const schema = filterPresetFormOptions.validators.onSubmit;

const fromCurrentFilters = (overrides: Record<string, unknown> = {}) => ({
    ...filterPresetFormOptions.defaultValues,
    ...presetFromSearch({ genres: ['action'] }, ContentTypeEnum.ANIME),
    ...overrides,
});

describe('filter preset form schema', () => {
    it('saves a preset from the current filters without a description', () => {
        expect(
            schema.safeParse(fromCurrentFilters({ name: 'Мій пресет' }))
                .success,
        ).toBe(true);
    });

    it('saves a new preset without a description', () => {
        expect(
            schema.safeParse({
                ...filterPresetFormOptions.defaultValues,
                name: 'Мій пресет',
                content_types: [ContentTypeEnum.ANIME],
            }).success,
        ).toBe(true);
    });

    it('keeps a typed description', () => {
        const parsed = schema.safeParse(
            fromCurrentFilters({ name: 'Мій пресет', description: 'Опис' }),
        );

        expect(parsed.success && parsed.data.description).toBe('Опис');
    });

    it('still requires a name', () => {
        expect(schema.safeParse(fromCurrentFilters()).success).toBe(false);
    });

    it('still caps the description', () => {
        expect(
            schema.safeParse(
                fromCurrentFilters({
                    name: 'Мій пресет',
                    description: 'a'.repeat(501),
                }),
            ).success,
        ).toBe(false);
    });
});
