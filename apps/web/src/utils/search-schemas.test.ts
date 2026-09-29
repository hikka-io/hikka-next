import { defaultParseSearch } from '@tanstack/react-router';
import { describe, expect, it } from 'vitest';

import {
    ContentTypeEnum,
    EditContentToDoEnum,
    EditContentTypeEnum,
    FavouriteContentTypeEnum,
} from '@hikka/api';

import {
    editContentSearchSchema,
    favoritesSearchSchema,
    historySearchSchema,
    loginSearchSchema,
} from './search-schemas';

const parse = <T>(schema: { parse: (input: unknown) => T }, search: string) =>
    schema.parse(defaultParseSearch(search));

describe('loginSearchSchema', () => {
    it('keeps a path callbackUrl', () => {
        expect(parse(loginSearchSchema, '?callbackUrl=%2Fanime')).toEqual({
            callbackUrl: '/anime',
        });
        expect(
            parse(loginSearchSchema, '?callbackUrl=%2Fanime%3Fpage%3D2'),
        ).toEqual({ callbackUrl: '/anime?page=2' });
    });

    it('drops a callbackUrl the search parser turned into JSON', () => {
        expect(parse(loginSearchSchema, '?callbackUrl=123').callbackUrl).toBe(
            undefined,
        );
        expect(
            parse(loginSearchSchema, '?callbackUrl=%5B1%5D').callbackUrl,
        ).toBe(undefined);
        expect(
            parse(loginSearchSchema, '?callbackUrl=%7B%22a%22%3A1%7D')
                .callbackUrl,
        ).toBe(undefined);
        expect(parse(loginSearchSchema, '?callbackUrl=null').callbackUrl).toBe(
            undefined,
        );
    });

    it('leaves a missing callbackUrl undefined', () => {
        expect(parse(loginSearchSchema, '')).toEqual({});
    });
});

describe('historySearchSchema', () => {
    it('keeps any string type, known or not', () => {
        expect(parse(historySearchSchema, '?type=following')).toEqual({
            type: 'following',
        });
        expect(parse(historySearchSchema, '?type=user')).toEqual({
            type: 'user',
        });
        expect(parse(historySearchSchema, '?type=garbage')).toEqual({
            type: 'garbage',
        });
        expect(parse(historySearchSchema, '?type=')).toEqual({ type: '' });
    });

    it('drops a non-string type instead of failing the route', () => {
        expect(parse(historySearchSchema, '?type=123').type).toBe(undefined);
        expect(parse(historySearchSchema, '?type=null').type).toBe(undefined);
        expect(parse(historySearchSchema, '?type=true').type).toBe(undefined);
    });

    it('leaves a missing type undefined', () => {
        expect(parse(historySearchSchema, '')).toEqual({});
    });
});

describe('favoritesSearchSchema', () => {
    it('keeps a known type and drops an unknown one', () => {
        expect(parse(favoritesSearchSchema, '?type=person')).toEqual({
            type: 'person',
        });
        expect(parse(favoritesSearchSchema, '?type=garbage').type).toBe(
            undefined,
        );
    });
});

type EnumSchemaCase = {
    name: string;
    schema: { parse: (input: unknown) => Record<string, unknown> };
    key: string;
    generated: Record<string, string>;
    previous: string[];
};

const ENUM_SCHEMA_CASES: EnumSchemaCase[] = [
    {
        name: 'editContentSearchSchema tab',
        schema: editContentSearchSchema,
        key: 'tab',
        generated: EditContentTypeEnum,
        previous: ['anime', 'manga', 'novel', 'character', 'person'],
    },
    {
        name: 'editContentSearchSchema content_type',
        schema: editContentSearchSchema,
        key: 'content_type',
        generated: EditContentToDoEnum,
        previous: ['anime', 'manga', 'novel'],
    },
    {
        name: 'favoritesSearchSchema type',
        schema: favoritesSearchSchema,
        key: 'type',
        generated: FavouriteContentTypeEnum,
        previous: [
            'anime',
            'manga',
            'novel',
            'character',
            'person',
            'collection',
        ],
    },
];

describe('schemas built on generated enums', () => {
    const candidates = [...Object.values(ContentTypeEnum), 'garbage'];

    it.each(
        ENUM_SCHEMA_CASES,
    )('$name accepts exactly its previous value set', ({
        schema,
        key,
        generated,
        previous,
    }) => {
        expect(new Set(Object.values(generated))).toEqual(new Set(previous));

        const accepted = candidates.filter(
            (value) => parse(schema, `?${key}=${value}`)[key] === value,
        );
        expect(new Set(accepted)).toEqual(new Set(previous));
    });
});
