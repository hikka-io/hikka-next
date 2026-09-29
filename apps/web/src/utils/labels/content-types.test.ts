import { describe, expect, it } from 'vitest';

import {
    COLLECTION_CONTENT_TYPE_OPTIONS,
    CONTENT_TYPES,
} from './content-types';

describe('content type labels', () => {
    it('keeps the singular labels', () => {
        expect(
            Object.entries(CONTENT_TYPES).map(([key, { title_ua }]) => [
                key,
                title_ua,
            ]),
        ).toEqual([
            ['anime', 'Аніме'],
            ['character', 'Персонаж'],
            ['person', 'Людина'],
            ['edit', 'Правка'],
            ['comment', 'Коментар'],
            ['collection', 'Колекція'],
            ['manga', 'Манґа'],
            ['novel', 'Ранобе'],
            ['user', 'Користувач'],
            ['article', 'Стаття'],
            ['history', 'Активність'],
        ]);
    });

    it('keeps the plural and case forms', () => {
        expect({
            plural: [
                CONTENT_TYPES.anime.plural,
                CONTENT_TYPES.manga.plural,
                CONTENT_TYPES.novel.plural,
                CONTENT_TYPES.character.plural,
                CONTENT_TYPES.person.plural,
                CONTENT_TYPES.collection.plural,
            ],
            genitive: [
                CONTENT_TYPES.anime.genitive,
                CONTENT_TYPES.manga.genitive,
                CONTENT_TYPES.novel.genitive,
            ],
            accusative: [
                CONTENT_TYPES.anime.accusative,
                CONTENT_TYPES.manga.accusative,
                CONTENT_TYPES.novel.accusative,
            ],
        }).toEqual({
            plural: [
                'Аніме',
                'Манґа',
                'Ранобе',
                'Персонажі',
                'Люди',
                'Колекції',
            ],
            genitive: ['аніме', 'манґи', 'ранобе'],
            accusative: ['аніме', 'манґу', 'ранобе'],
        });
    });

    it('labels the person content type as Людина and Люди', () => {
        expect({
            singular: CONTENT_TYPES.person.title_ua,
            plural: CONTENT_TYPES.person.plural,
            collectionOption: COLLECTION_CONTENT_TYPE_OPTIONS.find(
                ({ value }) => value === 'person',
            )?.label,
        }).toEqual({
            singular: 'Людина',
            plural: 'Люди',
            collectionOption: 'Людина',
        });
    });

    it('keeps the collection content type options in order', () => {
        expect(COLLECTION_CONTENT_TYPE_OPTIONS).toEqual([
            { value: 'anime', label: 'Аніме' },
            { value: 'manga', label: 'Манґа' },
            { value: 'novel', label: 'Ранобе' },
            { value: 'character', label: 'Персонаж' },
            { value: 'person', label: 'Людина' },
        ]);
    });
});
